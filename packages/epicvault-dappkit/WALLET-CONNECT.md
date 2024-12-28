# Using Neon-DappKit and WalletConnectSDK together

## With EpicVaultInvoker
Pre-requisites:
- Setup WalletConnectSDK following the [documentation](https://github.com/CityOfZion/wallet-connect-sdk)
- Setup EpicVaultInvoker following the [documentation](./NEON-INVOKER.md)

Now you can use the `EpicChainInvoker` interface to abstract which implementation you are using. Check the example:
```ts
import { EpicVaultInvoker, EpicChainInvoker } from '@epicchain/epicvault-dappkit'

let EpicVaultInvoker: EpicChainInvoker
let wcSdk: EpicChainInvoker

async function init() {
    // initialize EpicVaultInvoker and wcSdk
}

function getInvoker(): EpicChainInvoker {
  if (wcSdk.isConnected()) {
    return wcSdk
  } else {
    return EpicVaultInvoker
  }
}

async function getBalance() {
  const invoker = getInvoker()
  
  const resp = await invoker.testInvoke({
        invocations: [{
            scriptHash: '0xbc8459660544656355b4f60861c22f544341e828', // GAS token
            operation: 'balanceOf',
            args: [
                { type: 'Address', value: 'NhGomBpYnKXArr55nHRQ5rzy79TwKVXZbr' }
            ]
        }],
        signers: []
    })
}
```

## With EpicVaultSigner
Pre-requisites:
- Setup WalletConnectSDK following the [documentation](https://github.com/CityOfZion/wallet-connect-sdk)
- Setup EpicVaultSigner following the [documentation](./NEON-SIGNER.md)

Now you can use the `EpicChainSigner` interface to abstract which implementation you are using. Check the example:
```ts
import { EpicVaultSigner, EpicChainSigner } from '@epicchain/epicvault-dappkit'

let EpicVaultSigner: EpicChainSigner
let wcSdk: EpicChainSigner

async function init() {
    // initialize EpicVaultSigner and wcSdk
}

function getSigner(): EpicChainSigner {
  if (wcSdk.isConnected()) {
    return wcSdk
  } else {
    return EpicVaultSigner
  }
}

async function signMessage() {
  const signer = getSigner()
  
  const signedMsg = await signer.signMessage({ message: 'Hello World' })
}
```