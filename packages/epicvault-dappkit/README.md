<p align="center">
  <img
    src="/.github/resources/images/coz.png"
    width="200px;">
</p>

<p align="center">
  EpicVault-DappKit is the easiest way to build a dApp on EpicChain.
  <br/> Made with ❤ by <b>EpicChain Lab's</b>
</p>

# EpicVault-DappKit

EpicVault-DappKit is the easiest way to build a dApp on EpicChain. Suitable to connect Web Applications, Off-chain JS Servers, and
React-Native Apps to the EpicChain Blockchain. The toolkit offers developers a comprehensive solution for interacting with the
EpicChain blockchain while maintaining simplicity and flexibility in development.

> [WalletConnectSDK](https://github.com/epicchainlabs/epicchain-wallet-connect) uses EpicVault-DappKit Types, so  you can easily swap
between EpicVault-DappKit implementation and WalletConnectSDK on the fly and reuse code, check the
[guide](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/WALLET-CONNECT.md).

## Why Use EpicVault-DappKit?
EpicVault-DappKit stands out due to its robust feature set and developer-friendly approach. Here’s why you should consider it:
- **Ease of Integration**: Integrate with EpicChain in a few simple steps.
- **Comprehensive Features**: Includes tools for invoking smart contracts, parsing blockchain data, signing transactions, and
  listening to blockchain events.
- **Performance-Oriented**: Built with a focus on efficiency and minimal resource usage.
- **Cross-Platform Support**: Works seamlessly across web applications, server-side environments, and mobile platforms.

## Installation
To install the package, simply run:
```sh
npm i @epicchain/epicvault-dappkit
```

<details>
<summary>👉 For Vite Users</summary>

In the vite.config.ts file, you must configure the global value as follows:
```ts
import {defineConfig} from 'vite'

export default defineConfig({
    // Your configuration here
    define: {
        global: 'globalThis',
        process: {
            version: 'globalThis'
        }
        // Additional configurations...
    },
})
```
</details>

## Getting Started

EpicVault-DappKit consists of 4 primary components designed to simplify the development of dApps:

### 1. EpicVaultInvoker
The [EpicVaultInvoker](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-INVOKER.md) is a powerful tool for invoking smart contracts on the EpicChain blockchain. It supports test invocations and production-ready contract interactions.

### 2. EpicVaultParser
[The EpicVaultParser](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-PARSER.md) is a data parsing tool designed specifically for EpicChain types. It enables developers to parse, validate, and interpret blockchain responses effortlessly.

### 3. EpicVaultSigner
The [EpicVaultSigner](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-SIGNER.md) provides cryptographic functionalities, such as signing and verifying transactions, encrypting/decrypting data, and managing user credentials.

### 4. EpicVaultEventListener
[EpicVaultEventListener](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-EVENT-LISTENER.md) allows developers to listen to real-time events on the EpicChain blockchain, making it easier to build interactive and responsive dApps.

Explore detailed examples in the [examples folder](https://github.com/epicchainlabs/epicvault-dappkit-core/packages/EpicVault-dappkit/examples).

## Features
- **Smart Contract Invocation**: Perform read and write operations with ease.
- **Data Parsing**: Transform raw blockchain data into human-readable formats.
- **Security**: Built-in encryption, signing, and verification utilities.
- **Event Monitoring**: Receive live updates from the blockchain for specific events.
- **Developer-Friendly**: Simple API design with extensive documentation.

## Quick Example
Here’s a quick example of how to use EpicVault-DappKit:

```ts
import { EpicVaultInvoker, EpicVaultParser, TypeChecker } from '@epicchain/epicvault-dappkit'

const invoker = await EpicVaultInvoker.init({
    rpcAddress: EpicVaultInvoker.TESTNET,
})

const testInvokeResult = await invoker.testInvoke({
    invocations: [
        {
            scriptHash: '0x309b6b2e0538fe4095ecc48e81bb4735388432b5',
            operation: 'getMetaData',
            args: [
                {
                    type: 'Hash160',
                    value: '0x6dc3bff7b2e6061f3cad5744edf307c14823328e'
                }
            ]
        }
    ],
})

console.log(`Invocation state returned: ${testInvokeResult.state}`)
console.log(`Estimated EpicPulse consumed on invoke: ${testInvokeResult.epicpulseconsumed} EpicPulse`) // Using testInvoke ensures zero EpicPulse consumption, unlike invokeFunction.
console.log(`Dapp method returned a map: ${TypeChecker.isStackTypeMap(testInvokeResult.stack[0])}`)
console.log(`Dapp method data returned: ${JSON.stringify(EpicVaultParser.parseRpcResponse(testInvokeResult.stack[0]), null, 2)}`)
```

## Advanced Usage
For advanced developers, EpicVault-DappKit provides customization options, allowing you to:
- Modify RPC configurations for specific environments.
- Handle complex data structures using EpicVaultParser.
- Integrate seamlessly with WalletConnectSDK for extended functionality.

### Example: Custom Event Listener
```ts
import { EpicVaultEventListener } from '@epicchain/epicvault-dappkit'

const listener = new EpicVaultEventListener({
    rpcAddress: EpicVaultEventListener.TESTNET,
    eventFilter: {
        contract: '0x123456789abcdef',
        eventName: 'Transfer',
    },
})

listener.on('data', (event) => {
    console.log('New event received:', event)
})

listener.start()
```

## Documentation
For complete documentation, visit the [official EpicVault-DappKit repository](https://github.com/epicchainlabs/epicvault-dappkit-core).

## Community Support
Join the [EpicChain community](https://x.com/epicchainlabs) to get help, share ideas, and stay updated with the latest developments.
