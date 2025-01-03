import {
  ContractInvocationMulti,
  Signer,
  EpicChainInvoker,
  Arg,
  InvokeResult,
  RpcResponseStackItem,
  BuiltTransaction,
  TypeChecker,
  CalculateFee,
} from '@epicchain/epicvault-dappkit-types'
import { tx, u, rpc, sc, api, wallet } from '@epicchain/epicvault-js'
import type * as EpicVaultTypes from '@epicchain/epicvault-core'

export type ExtendedArg = Arg | { type: 'Address'; value: string } | { type: 'ScriptHash'; value: string }

export type InitOptions = {
  rpcAddress: string
  account?: EpicVaultTypes.wallet.Account | EpicVaultTypes.wallet.Account[]
  validBlocks?: number
  signingCallback?: api.SigningFunction
}

export type Options = InitOptions & {
  networkMagic: number
  validBlocks: number
}
export class EpicVaultInvoker implements EpicChainInvoker {
  static MAINNET = 'https://mainnet1.neo.coz.io:443'
  static TESTNET = 'https://testnet1.neo.coz.io:443'

  private constructor(public options: Options) {}

  async testInvoke(cim: ContractInvocationMulti): Promise<InvokeResult> {
    const accountArr = this.normalizeAccountArray(this.options.account)
    const script = this.buildScriptHex(cim)

    const rpcResult = await new rpc.RPCClient(this.options.rpcAddress).invokeScript(
      u.HexString.fromHex(script),
      accountArr[0] ? EpicVaultInvoker.buildMultipleSigner(accountArr, cim.signers) : undefined,
    )
    if (rpcResult.state === 'FAULT') throw Error(`Execution state is FAULT. Exception: ${rpcResult.exception}`)

    return { ...rpcResult, stack: rpcResult.stack as RpcResponseStackItem[] }
  }

  async invokeFunction(cimOrBt: ContractInvocationMulti | BuiltTransaction): Promise<string> {
    const accountArr = this.normalizeAccountArray(this.options.account)
    const transaction = await this.buildTransactionFromCimOrBt(cimOrBt, accountArr)
    const rpcClient = new rpc.RPCClient(this.options.rpcAddress)
    const signedTransaction = await this.signTransactionByAccounts(transaction, accountArr)
    return await rpcClient.sendRawTransaction(signedTransaction)
  }

  async signTransaction(cimOrBt: ContractInvocationMulti | BuiltTransaction): Promise<BuiltTransaction> {
    const accountArr = this.normalizeAccountArray(this.options.account)
    const transaction = await this.buildTransactionFromCimOrBt(cimOrBt, accountArr)
    const signedTransaction = await this.signTransactionByAccounts(transaction, accountArr)
    const signedTransactionJson = signedTransaction.toJson()

    return {
      ...cimOrBt,
      hash: signedTransactionJson.hash,
      script: u.base642hex(signedTransactionJson.script),
      nonce: signedTransactionJson.nonce,
      version: signedTransactionJson.version,
      size: signedTransactionJson.size,
      validUntilBlock: signedTransactionJson.validuntilblock,
      witnesses: signedTransactionJson.witnesses,
      networkFee: signedTransactionJson.netfee,
      systemFee: signedTransactionJson.sysfee,
    }
  }

  async calculateFee(cimOrBt: ContractInvocationMulti): Promise<CalculateFee> {
    const accountArr = this.normalizeAccountArray(this.options.account)
    const transaction = await this.buildTransactionFromCimOrBt(cimOrBt, accountArr)

    return {
      networkFee: transaction.networkFee.toDecimal(8),
      systemFee: transaction.systemFee.toDecimal(8),
      total: Number(transaction.networkFee.add(transaction.systemFee).toDecimal(8)),
    }
  }

  async traverseIterator(sessionId: string, iteratorId: string, count: number): Promise<RpcResponseStackItem[]> {
    const rpcClient = new rpc.RPCClient(this.options.rpcAddress)
    const result = await rpcClient.traverseIterator(sessionId, iteratorId, count)

    return result.map((item): RpcResponseStackItem => ({ value: item.value as any, type: item.type as any }))
  }

  static async init({ validBlocks = 100, ...options }: InitOptions): Promise<EpicVaultInvoker> {
    const networkMagic = await this.getMagicOfRpcAddress(options.rpcAddress)
    return new EpicVaultInvoker({ ...options, validBlocks, networkMagic })
  }

  static async getMagicOfRpcAddress(rpcAddress: string): Promise<number> {
    const resp = await new rpc.RPCClient(rpcAddress).getVersion()
    return resp.protocol.network
  }

  static convertParams(args: ExtendedArg[] | undefined): EpicVaultTypes.sc.ContractParam[] {
    return (args ?? []).map((a) => {
      if (a.type === undefined) throw new Error('Invalid argument type')
      if (a.value === undefined) throw new Error('Invalid argument value')

      switch (a.type) {
        case 'Any':
          return sc.ContractParam.any(a.value)
        case 'String':
          return sc.ContractParam.string(a.value)
        case 'Boolean':
          return sc.ContractParam.boolean(a.value)
        case 'PublicKey':
          return sc.ContractParam.publicKey(a.value)
        case 'ScriptHash':
          return sc.ContractParam.hash160(u.HexString.fromHex(a.value))
        case 'Address':
        case 'Hash160':
          return sc.ContractParam.hash160(a.value)
        case 'Hash256':
          return sc.ContractParam.hash256(a.value)
        case 'Integer':
          return sc.ContractParam.integer(a.value)
        case 'Array':
          return sc.ContractParam.array(...this.convertParams(a.value))
        case 'Map':
          return sc.ContractParam.map(
            ...a.value.map((map) => ({
              key: this.convertParams([map.key])[0],
              value: this.convertParams([map.value])[0],
            })),
          )
        case 'ByteArray': {
          const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
          const hexLowerRegex = /^([0-9a-f]{2})*$/
          const hexUpperRegex = /^([0-9A-F]{2})*$/
          let byteArrayValue
          if (hexLowerRegex.test(a.value) || hexUpperRegex.test(a.value)) {
            byteArrayValue = u.hex2base64(a.value)
          } else if (base64Regex.test(a.value)) {
            byteArrayValue = a.value
          } else {
            throw new Error(`Invalid ByteArray value, should be either a valid hex or base64, got: ${a.value}`)
          }

          return sc.ContractParam.byteArray(byteArrayValue)
        }
      }
    })
  }

  static buildSigner(optionsAccount: EpicVaultTypes.wallet.Account | undefined, signerEntry?: Signer): EpicVaultTypes.tx.Signer {
    let scopes = signerEntry?.scopes ?? 'CalledByEntry'
    if (typeof scopes === 'number') {
      scopes = tx.toString(scopes)
    }

    const account = signerEntry?.account ?? optionsAccount?.scriptHash
    if (!account) throw new Error('You need to provide at least one account to sign.')

    return tx.Signer.fromJson({
      scopes,
      account,
      allowedcontracts: signerEntry?.allowedContracts,
      allowedgroups: signerEntry?.allowedGroups,
      rules: signerEntry?.rules,
    })
  }

  static buildMultipleSigner(
    optionAccounts: EpicVaultTypes.wallet.Account[],
    signers: Signer[] = [],
  ): EpicVaultTypes.tx.Signer[] {
    const allSigners: EpicVaultTypes.tx.Signer[] = []
    for (let i = 0; i < Math.max(signers.length, optionAccounts.length); i++) {
      allSigners.push(this.buildSigner(optionAccounts?.[i], signers?.[i]))
    }
    return allSigners
  }

  private normalizeAccountArray(
    acc: EpicVaultTypes.wallet.Account | EpicVaultTypes.wallet.Account[] | undefined,
  ): EpicVaultTypes.wallet.Account[] {
    if (!acc) {
      return []
    }

    if (Array.isArray(acc)) {
      return acc
    }

    return [acc]
  }

  private buildScriptHex(cim: ContractInvocationMulti): string {
    const sb = new sc.ScriptBuilder()

    cim.invocations.forEach((c) => {
      sb.emitContractCall({
        scriptHash: c.scriptHash,
        operation: c.operation,
        args: EpicVaultInvoker.convertParams(c.args),
      })

      if (c.abortOnFail) {
        sb.emit(0x39)
      }
    })

    return sb.build()
  }

  private async signTransactionByAccounts(
    transaction: EpicVaultTypes.tx.Transaction,
    accountArr: EpicVaultTypes.wallet.Account[],
  ): Promise<EpicVaultTypes.tx.Transaction> {
    const txClone = new tx.Transaction(transaction)

    let signerIndex = 0
    for (const signer of txClone.signers) {
      for (const account of accountArr) {
        if (signer.account.equals(account.scriptHash)) {
          let txCopy = new tx.Transaction(transaction)
          txCopy.witnesses = []

          if (this.options.signingCallback) {
            txCopy.addWitness(
              new tx.Witness({
                invocationScript: '',
                verificationScript: wallet.getVerificationScriptFromPublicKey(account.publicKey),
              }),
            )

            const facade = await api.NetworkFacade.fromConfig({
              node: this.options.rpcAddress,
            })

            txCopy = await facade.sign(txCopy, {
              signingCallback: this.options.signingCallback,
            })
          } else {
            txCopy.sign(account, this.options.networkMagic)
          }
          txClone.witnesses[signerIndex] = txCopy.witnesses[0]
        }
      }
      signerIndex++
    }

    return txClone
  }

  private async buildTransactionFromCimOrBt(
    cimOrBt: ContractInvocationMulti | BuiltTransaction,
    accountArr: EpicVaultTypes.wallet.Account[],
  ): Promise<EpicVaultTypes.tx.Transaction> {
    const cimHexString = this.buildScriptHex(cimOrBt)
    const signers = EpicVaultInvoker.buildMultipleSigner(accountArr, cimOrBt.signers)

    if ('script' in cimOrBt) {
      if (cimOrBt.script !== cimHexString) {
        throw new Error(
          'The script in the BuiltTransaction is not the same as the one generated from the ContractInvocationMulti',
        )
      }

      return new tx.Transaction({
        validUntilBlock: cimOrBt.validUntilBlock,
        version: cimOrBt.version,
        nonce: cimOrBt.nonce,
        script: cimOrBt.script,
        systemFee: cimOrBt.systemFee,
        networkFee: cimOrBt.networkFee,
        witnesses: cimOrBt.witnesses.map((witness) => tx.Witness.fromJson(witness)),
        signers,
      })
    }

    const rpcClient = new rpc.RPCClient(this.options.rpcAddress)
    const currentHeight = await rpcClient.getBlockCount()

    const transaction = new tx.Transaction({
      script: u.HexString.fromHex(cimHexString),
      validUntilBlock: currentHeight + this.options.validBlocks,
      signers,
    })

    const systemFee = await this.getSystemFee(cimOrBt)
    const networkFee = await this.getNetworkFee(cimOrBt, rpcClient, accountArr, transaction)
    transaction.networkFee = networkFee
    transaction.systemFee = systemFee
    transaction.witnesses = signers.map(() => tx.Witness.fromJson({ invocation: '', verification: '' }))

    return transaction
  }

  private async getNetworkFee(
    cim: ContractInvocationMulti,
    rpcClient: EpicVaultTypes.rpc.RPCClient,
    accountArr: EpicVaultTypes.wallet.Account[],
    transaction: EpicVaultTypes.tx.Transaction,
  ): Promise<EpicVaultTypes.u.BigInteger> {
    if (cim.networkFeeOverride) {
      return u.BigInteger.fromNumber(cim.networkFeeOverride)
    }

    const txClone = new tx.Transaction(transaction)

    // Add one witness for each signer and use placeholder accounts to calculate the network fee.
    // This is needed to calculate the network fee, since the signer is considered to calculate the fee and we need
    // the same number of witnesses as signers, otherwise the fee calculation will fail
    for (let i = 0; i < txClone.signers.length; i++) {
      const placeholderAccount = new wallet.Account()
      txClone.signers[i].account = u.HexString.fromHex(placeholderAccount.scriptHash)

      txClone.addWitness(
        new tx.Witness({
          invocationScript: '',
          verificationScript: wallet.getVerificationScriptFromPublicKey(placeholderAccount.publicKey),
        }),
      )
    }

    const networkFee = await api.smartCalculateNetworkFee(txClone, rpcClient)

    return networkFee.add(cim.extraNetworkFee ?? 0)
  }

  private async getSystemFee(cimOrBt: ContractInvocationMulti): Promise<EpicVaultTypes.u.BigInteger> {
    if (cimOrBt.systemFeeOverride) {
      return u.BigInteger.fromNumber(cimOrBt.systemFeeOverride)
    }

    const { gasconsumed } = await this.testInvoke(cimOrBt)
    const systemFee = u.BigInteger.fromNumber(gasconsumed)

    return systemFee.add(cimOrBt.extraSystemFee ?? 0)
  }
}

export { TypeChecker }
