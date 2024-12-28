import { ContractInvocationMulti } from '@epicchain/epicvault-dappkit-types'
import { EpicVaultInvoker, EpicVaultParser } from '../src/index'
import * as path from 'path'
import { wallet } from '@cityofzion/neon-core'

export const rpcAddress = 'http://127.0.0.1:30222'
export const gasScriptHash = '0xbc8459660544656355b4f60861c22f544341e828'
export const epicchainScriptHash = '0x6dc3bff7b2e6061f3cad5744edf307c14823328e'
export const waitTime = 1000
export const EpicVaultEventListenerOptions = {
  waitForApplicationLog: { maxAttempts: 10, waitMs: 100 },
  waitForEventMs: 100,
}

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export function epicchainGoPath() {
  return path.resolve(path.join(__dirname, '..', 'neogo', 'neogo'))
}

export function getDataDir() {
  return path.resolve(path.join(__dirname, '..', 'data'))
}

export function toDecimal(num: number, decimal: number) {
  return num / 10 ** decimal
}

export function transferInvocation(
  smartContract: string,
  sender: wallet.Account,
  receiver: wallet.Account,
  amount: string,
): ContractInvocationMulti {
  return {
    invocations: [
      {
        scriptHash: smartContract,
        operation: 'transfer',
        args: [
          { type: 'Hash160', value: sender.address },
          { type: 'Hash160', value: receiver.address },
          { type: 'Integer', value: amount },
          { type: 'String', value: 'test' },
        ],
      },
    ],
  }
}

export async function getBalance(invoker: EpicVaultInvoker, address: string) {
  const payerBalanceResp = await invoker.testInvoke({
    invocations: [
      {
        operation: 'balanceOf',
        scriptHash: '0xbc8459660544656355b4f60861c22f544341e828',
        args: [{ value: address, type: 'Hash160' }],
      },
    ],
  })
  return EpicVaultParser.parseRpcResponse(payerBalanceResp.stack[0])
}
