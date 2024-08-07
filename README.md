
<p align="center">
  Welcome to <b>EpicVault-DappKit-Core</b> the most intuitive and powerful toolkit for developing decentralized applications (dApps) on the EpicChain blockchain.
  <br/> Proudly created with ❤ by <b>EpicChain Labs</b>
</p>

# EpicVault-DappKit-Core

**EpicVault-DappKit-Core** is your essential toolkit for building and integrating decentralized applications (dApps) on the EpicChain blockchain. This comprehensive framework is designed to simplify the development process, making it easier to connect Web Applications, Off-chain JavaScript Servers, and React-Native Apps to the EpicChain blockchain. By using EpicVault-DappKit-Core, you can enhance your application’s capabilities and create robust, scalable dApps with ease.

EpicVault-DappKit-Core is built to offer a rich set of features and utilities that streamline blockchain interaction, enabling developers to focus on crafting exceptional dApps rather than wrestling with complex blockchain integration issues. With support for various components and tools, this repository serves as a one-stop solution for all your dApp development needs on EpicChain.

> **WalletConnectSDK** utilizes types from EpicVault-DappKit-Core, providing a seamless experience when switching between EpicVault-DappKit-Core and WalletConnectSDK. This interchangeability ensures code reuse and flexibility, allowing you to integrate with ease. For detailed guidance on leveraging this feature, check out our [WalletConnect Guide](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/epicvault-dappkit-core/WALLET-CONNECT.md).

## Installation

To incorporate EpicVault-DappKit-Core into your project, follow these steps to install the package:

```sh
npm install @epicchainlabs/epicvault-dappkit-core
```

This command will add the EpicVault-DappKit-Core library to your project, making its functionalities available for use in your application.

<details>
<summary>👉 Special Instructions for Vite Users</summary>

If you are using Vite as your build tool, you will need to configure certain global values in your `vite.config.ts` file to ensure compatibility. Update your Vite configuration as shown below:

```ts
import { defineConfig } from 'vite';

export default defineConfig({
    // Your existing configuration settings
    define: {
        global: 'globalThis', // Required to replace the global object
        process: {
            version: 'globalThis' // Define process.version to avoid errors
        }
        // Additional configurations as needed...
    },
});
```

This configuration adjustment ensures that global variables are properly recognized, which is essential for the smooth operation of EpicVault-DappKit-Core with Vite.
</details>

## Getting Started

EpicVault-DappKit-Core provides four main components that are integral to dApp development:

- **[EpicVaultInvoker](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/epicvault-dappkit-core/EPICVAULT-INVOKER.md)**: The EpicVaultInvoker is a powerful tool designed for invoking smart contracts on EpicChain. It allows you to execute contract functions, perform transactions, and interact with the blockchain in a straightforward manner. With EpicVaultInvoker, you can manage contract interactions effortlessly.

- **[EpicVaultParser](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/epicvault-dappkit-core/EPICVAULT-PARSER.md)**: EpicVaultParser is a sophisticated parser for EpicChain types. It helps in decoding and interpreting data from the EpicChain blockchain, making it easier to work with blockchain data structures and responses.

- **[EpicVaultSigner](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/epicvault-dappkit-core/EPICVAULT-SIGNER.md)**: EpicVaultSigner provides functionality for signing, verifying, encrypting, and decrypting data. This component ensures the security and integrity of your transactions and communications with the blockchain, offering critical cryptographic operations necessary for secure dApp development.

- **[EpicVaultEventListener](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/epicvault-dappkit-core/EPICVAULT-EVENT-LISTENER.md)**: EpicVaultEventListener allows you to listen to and handle events emitted by the EpicChain blockchain. With this component, you can monitor blockchain activity in real-time and respond to events such as transactions and contract updates.

For practical implementations and real-world usage examples, please visit the [examples folder](https://github.com/epicchainlabs/epicvault-dappkit-core/blob/main/packages/epicvault-dappkit-core/examples).

## Quick Example

To illustrate the usage of EpicVault-DappKit-Core, here’s a quick example showcasing how to initialize the EpicVaultInvoker, perform a contract invocation, and handle the results:

```ts
import { EpicVaultInvoker, EpicVaultParser, TypeChecker } from '@epicchainlabs/epicvault-dappkit-core';
import { ContractInvocationMulti } from '@epicchainlabs/epicvault-dappkit-core-types';

// Initialize the EpicVaultInvoker with the testnet RPC address
const invoker = await EpicVaultInvoker.init({
    rpcAddress: EpicVaultInvoker.TESTNET, // Use the appropriate RPC address for your network
});

// Define the contract invocation parameters
const invocation: ContractInvocationMulti = {
    invocations: [
        {
            scriptHash: '0x309b6b2e0538fe4095ecc48e81bb4735388432b5', // Replace with your contract’s script hash
            operation: 'getMetaData', // The operation to be invoked
            args: [
                {
                    type: 'Hash160', // Data type for the argument
                    value: '0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5' // Argument value
                }
            ]
        }
    ],
};

// Execute the invocation and obtain results
const testInvokeResult = await invoker.testInvoke(invocation);

// Log the results for inspection
console.log(`Invocation state returned: ${testInvokeResult.state}`);
console.log(`Estimated EpicPulse consumed on invoke: ${testInvokeResult.epicpulseconsumed} EpicPulse`); // testInvoke does not consume real EpicPulse
console.log(`Contract method returned a map: ${TypeChecker.isStackTypeMap(testInvokeResult.stack[0])}`);
console.log(`Contract method data returned: ${JSON.stringify(EpicVaultParser.parseRpcResponse(testInvokeResult.stack[0]), null, 2)}`);
```

This example demonstrates how to set up the EpicVaultInvoker, define a contract invocation, and handle the response, providing a practical starting point for using EpicVault-DappKit-Core in your projects.

## Contributing

We welcome contributions from the community to help improve EpicVault-DappKit-Core. If you are interested in contributing, please review our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request. Your feedback, bug reports, and code contributions are crucial to the continued enhancement of this project.

## Support

If you encounter any issues or need assistance, please open an issue on our [GitHub Issues](https://github.com/epicchainlabs/epicvault-dappkit-core/issues) page. Our team is committed to providing support and addressing any questions or concerns you may have.

## License

EpicVault-DappKit-Core is licensed under the [MIT License](LICENSE). This open-source license allows you to freely use, modify, and distribute the software, provided that you comply with the terms specified.

## Acknowledgements

We extend our sincere gratitude to the developers, contributors, and community members who have supported the EpicVault-DappKit-Core project. Your contributions and feedback play a vital role in the success and evolution of this toolkit.

## Contact

For further inquiries, feedback, or suggestions, please contact us at [contact@epic-chain.org](mailto:contact@epic-chain.org). We value your input and are here to assist with any questions or concerns you may have.

---

Thank you for choosing EpicVault-DappKit-Core. We look forward to seeing how you leverage our toolkit to build innovative and impactful dApps on EpicChain. Happy coding!