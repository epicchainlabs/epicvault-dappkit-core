# Change Log - @epicchain/epicvault-dappkit-types

This log was last generated on Fri, 14 Jun 2024 20:54:31 GMT and should not be manually modified.

## 0.4.0
Fri, 14 Jun 2024 20:54:31 GMT

### Minor changes

- SignedMessage object might have an optional message property instead of the messageHex

## 0.3.1
Mon, 30 Oct 2023 11:49:17 GMT

### Patches

- Added an instruction to the changelog for Vite users

## 0.3.0
Mon, 02 Oct 2023 18:41:15 GMT

### Minor changes

- The calculateFee function was exported in the EpicChainInvoker interface.

## 0.2.0
Thu, 28 Sep 2023 13:15:04 GMT

### Minor changes

- Enable multi-signing with various wallets. Use "signTransaction" for signing without invoking. Share the response with another user, who can then call "invokeFunction" later.

## 0.1.0
Wed, 27 Sep 2023 16:59:04 GMT

### Minor changes

- Expand EpicChainParser documentation; shorten hexstring methods names to use 'hex' instead of 'hexstring'
- Add TypeChecker

## 0.0.7
Thu, 14 Sep 2023 20:35:01 GMT

### Patches

- Renamed "Neo3Involker.ts" to "EpicChainInvoker.ts"

## 0.0.6
Mon, 11 Sep 2023 14:54:03 GMT

### Patches

- Return Promises on encrypt, descrypt and decryptFromArray methods

