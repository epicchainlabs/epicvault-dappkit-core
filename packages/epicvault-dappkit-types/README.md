<p align="center">
  <img src="https://via.placeholder.com/800x150?text=EpicVault+DappKit" alt="EpicVault-DappKit"/>
  <br/>
  <b>EpicVault-DappKit:</b> Your Ultimate Gateway to Building Decentralized Applications on EpicChain Blockchain.
  <br/>
  Built with ❤ by <b>EpicChain Labs</b>, empowering developers worldwide.
</p>

# EpicVault-DappKit

**EpicVault-DappKit** is an all-in-one, developer-friendly toolkit designed to simplify the process of building decentralized applications (dApps) on the **EpicChain** blockchain. Whether you're connecting Web Applications, managing Off-chain JS Servers, or creating React-Native Apps, EpicVault-DappKit seamlessly bridges your app to the powerful EpicChain ecosystem.

## Why Choose EpicVault-DappKit?
- **Comprehensive & Flexible**: Integrates seamlessly with existing projects using the WalletConnectSDK.
- **User-Centric**: Simplified tools for dApp development without compromising functionality.
- **Scalable & Robust**: Designed to support small projects and large-scale blockchain solutions alike.

> 🛠 **Pro Tip:** EpicVault-DappKit leverages types compatible with [WalletConnectSDK](https://github.com/epicchainlabs/epicchain-wallet-connect), enabling you to alternate between implementations while reusing existing code. Check out the comprehensive [WalletConnect Guide](/packages/EpicVault-dappkit/WALLET-CONNECT.md) for more insights.

---

## 🚀 Installation
To get started with EpicVault-DappKit, install the core package using npm:

```sh
npm i @epicchain/epicvault-dappkit-types
```

<details>
<summary>👉 For Vite Users (Important Configuration)</summary>

To ensure compatibility with Vite, update your `vite.config.ts` file with the following snippet:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  // Custom configuration
  define: {
    global: 'globalThis',
    process: {
      version: 'globalThis',
    },
  },
});
```
</details>

---

## 📚 Components Overview
EpicVault-DappKit comes packed with powerful modules tailored to streamline dApp development:

1. **[EpicVaultInvoker](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-INVOKER.md)**  
   A smart contract invocation tool for efficient blockchain interactions.

2. **[EpicVaultParser](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-PARSER.md)**  
   A versatile parser for managing EpicChain-specific data types.

3. **[EpicVaultSigner](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-SIGNER.md)**  
   Handles cryptographic signing, verification, encryption, and decryption.

4. **[EpicVaultEventListener](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/EpicVault-EVENT-LISTENER.md)**  
   A robust event listener to capture real-time blockchain updates.

> 🗂 Explore sample implementations in the [examples folder](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/EpicVault-dappkit/examples).

---

## 🛠 Quick Start Guide
Here’s a simple example to illustrate how to interact with EpicChain using EpicVault-DappKit:

```ts
import { EpicVaultInvoker, EpicVaultParser, TypeChecker } from '@epicchain/epicvault-dappkit';
import { ContractInvocationMulti } from '@epicchain/epicvault-dappkit-types';

// Initialize the EpicVaultInvoker
const invoker = await EpicVaultInvoker.init({
  rpcAddress: EpicVaultInvoker.TESTNET,
});

// Define the contract invocation
const invocation: ContractInvocationMulti = {
  invocations: [
    {
      scriptHash: '0x309b6b2e0538fe4095ecc48e81bb4735388432b5',
      operation: 'getMetaData',
      args: [
        {
          type: 'Hash160',
          value: '0x6dc3bff7b2e6061f3cad5744edf307c14823328e',
        },
      ],
    },
  ],
};

// Test the invocation
const testInvokeResult = await invoker.testInvoke(invocation);

// Log results
console.log(`Invocation state returned: ${testInvokeResult.state}`);
console.log(`Estimated EpicPulse consumed: ${testInvokeResult.epicpulseconsumed} EpicPulse`);
console.log(`Returned a map? ${TypeChecker.isStackTypeMap(testInvokeResult.stack[0])}`);
console.log(`Parsed data: ${JSON.stringify(EpicVaultParser.parseRpcResponse(testInvokeResult.stack[0]), null, 2)}`);
```

---

## 🌟 Key Features at a Glance
- **Zero EpicPulse Fee Testing**: Use `testInvoke` to simulate smart contract calls without consuming EpicPulse.
- **Real-Time Parsing**: Effortlessly convert blockchain data into developer-friendly formats.
- **Modular Architecture**: Adapt components to fit specific project needs.
- **Cross-Platform Compatibility**: Supports a wide range of environments including Web, Node.js, and React-Native.

---

### Join the Revolution 🌐  
Take your dApp development to the next level with **EpicVault-DappKit**. Visit our [official repository](https://github.com/epicchainlabs/epicvault-dappkit-core) to get started. Let's shape the future of blockchain technology together!