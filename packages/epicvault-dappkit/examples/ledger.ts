import { EpicVaultInvoker } from '@epicchain/epicvault-dappkit'
import { default as Neon } from '@epicchain/epicvault-js'
import * as NeonLedger from '@epicchain/epicvault-ledger'

const account = Neon.create.account('NKuyBkoGdZZSLyPbJEetheRhMjeznFZszf')

/* eslint "@typescript-eslint/no-unused-vars": "off" */
const invoker = await EpicVaultInvoker.init({
  rpcAddress: EpicVaultInvoker.MAINNET,
  account,
  signingCallback: async (transactionClass, { network, witnessIndex }) => {
    const ledger = await NeonLedger.init()
    try {
      const publicKey = await ledger.getPublicKey(account)
      const scriptHashLedger = Neon.wallet.getScriptHashFromPublicKey(publicKey.key)
      const scriptHashWitness = Neon.wallet.getScriptHashFromVerificationScript(
        transactionClass.witnesses[witnessIndex].verificationScript.toString(),
      )

      if (scriptHashLedger !== scriptHashWitness) {
        throw new Error('Requested signature is different from ledger key')
      }

      return await ledger.getSignature(transactionClass.serialize(false), network, account)
    } finally {
      await ledger.close()
    }
  },
})
