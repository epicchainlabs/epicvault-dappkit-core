import { EpicVaultParser } from '../src'
import { describe, it } from 'mocha'
import * as assert from 'assert'
import { RpcResponseStackItem } from '@epicchain/epicvault-dappkit-types'

describe('EpicVaultParser', function () {
  this.timeout(60000)

  it('converts an ArrayBuffer into a hex string', async () => {
    const encoder = new TextEncoder()
    const arrayBuffer = encoder.encode('unit test')
    const hexString = '756e69742074657374'

    assert.equal(EpicVaultParser.abToHex(arrayBuffer), hexString)
  })

  it('converts an ArrayBuffer into a string', async () => {
    const encoder = new TextEncoder()
    const str = 'unit test'
    const arrayBuffer = encoder.encode(str)

    assert.equal(EpicVaultParser.abToStr(arrayBuffer), str)
  })

  it('converts an account input into its address', async () => {
    const address = 'NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs'
    const privateKey = '087780053c374394a48d685aacf021804fa9fab19537d16194ee215e825942a0'
    const publicKey = '03cdb067d930fd5adaa6c68545016044aaddec64ba39e548250eaea551172e535c'
    const scriptHash = 'a5de523ae9d99be784a536e9412b7a3cbe049e1a'

    assert.equal(EpicVaultParser.accountInputToAddress(privateKey), address)
    assert.equal(EpicVaultParser.accountInputToAddress(publicKey), address)
    assert.equal(EpicVaultParser.accountInputToAddress(scriptHash), address)
  })

  it('converts an account input into its scripthash', async () => {
    const scriptHash = 'a5de523ae9d99be784a536e9412b7a3cbe049e1a'
    const privateKey = '087780053c374394a48d685aacf021804fa9fab19537d16194ee215e825942a0'
    const publicKey = '03cdb067d930fd5adaa6c68545016044aaddec64ba39e548250eaea551172e535c'
    const address = 'NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs'

    assert.equal(EpicVaultParser.accountInputToScripthash(privateKey), scriptHash)
    assert.equal(EpicVaultParser.accountInputToScripthash(publicKey), scriptHash)
    assert.equal(EpicVaultParser.accountInputToScripthash(address), scriptHash)
  })

  it('converts a base64 string to a hex string', async () => {
    let base64String = 'dW5pdCB0ZXN0'
    let hexString = '756e69742074657374'
    assert.equal(EpicVaultParser.base64ToHex(base64String), hexString)

    base64String = 'TmVvblBhcnNlcg=='
    hexString = '4e656f6e506172736572'
    assert.equal(EpicVaultParser.base64ToHex(base64String), hexString)
  })

  it('converts a base64 string to a hex and revert it', async () => {
    assert.equal(
      EpicVaultParser.reverseHex(EpicVaultParser.base64ToHex('ateeXCdGd+AdYKWa5w8SikaAqlk=')),
      '59aa80468a120fe79aa5601de07746275c9ed76a',
    )
  })

  it('converts a base64 string into an utf-8 string', async () => {
    const base64String = 'VVRGLTggU3RyaW5nIMOhw6PDoMOn'
    const utf8String = 'UTF-8 String áãàç'
    assert.equal(EpicVaultParser.base64ToUtf8(base64String), utf8String)
  })

  it('converts a hex string into a base64 string', async () => {
    let base64String = 'dW5pdCB0ZXN0'
    let hexString = '756e69742074657374'
    assert.equal(EpicVaultParser.hexToBase64(hexString), base64String)

    base64String = 'TmVvblBhcnNlcg=='
    hexString = '4e656f6e506172736572'
    assert.equal(EpicVaultParser.hexToBase64(hexString), base64String)
  })

  it('converts a hex string into an array buffer', async () => {
    const encoder = new TextEncoder()
    const arrayBuffer = encoder.encode('unit test')
    const hexString = '756e69742074657374'
    assert.deepEqual(EpicVaultParser.hexToAb(hexString), arrayBuffer)
  })

  it('converts a hex string into a string', async () => {
    let str = 'unit test'
    let hexString = '756e69742074657374'
    assert.equal(EpicVaultParser.hexToStr(hexString), str)

    str = 'EpicVaultParser'
    hexString = '4e656f6e506172736572'
    assert.equal(EpicVaultParser.hexToStr(hexString), str)
  })

  it('converts a number into a hex string intToHex', async () => {
    let num = 16
    let hexString = '10'
    assert.equal(EpicVaultParser.intToHex(num), hexString)

    num = 512
    hexString = '0200'
    assert.equal(EpicVaultParser.intToHex(num), hexString)
  })

  it('converts a number into a hex string numToHexstring', async () => {
    let num = 16
    let hexString = '10'
    assert.equal(EpicVaultParser.numToHex(num), hexString)

    num = 512
    hexString = '00'
    assert.equal(EpicVaultParser.numToHex(num), hexString)

    num = 512
    hexString = '0200'
    assert.equal(EpicVaultParser.numToHex(num, 2), hexString)

    num = 512
    hexString = '0002'
    assert.equal(EpicVaultParser.numToHex(num, 2, true), hexString)
  })

  it('converts a number into a variable length Int', async () => {
    let num = 16
    let str = '10'
    assert.equal(EpicVaultParser.numToVarInt(num), str)

    num = 512
    str = 'fd0002'
    assert.equal(EpicVaultParser.numToVarInt(num), str)

    num = 65535
    str = 'fdffff'
    assert.equal(EpicVaultParser.numToVarInt(num), str)

    num = 4294967295
    str = 'feffffffff'
    assert.equal(EpicVaultParser.numToVarInt(num), str)

    num = 4294967296
    str = 'ff0000000001000000'
    assert.equal(EpicVaultParser.numToVarInt(num), str)
  })

  it('reverts a hex string', async () => {
    const hexString = 'abcdef'
    const reverseHexString = 'efcdab'
    assert.equal(EpicVaultParser.reverseHex(hexString), reverseHexString)
  })

  it('converts a string into an array buffer', async () => {
    const encoder = new TextEncoder()
    const str = 'unit test'
    const arrayBuffer = encoder.encode(str)

    assert.deepEqual(EpicVaultParser.strToAb(str), arrayBuffer)
  })

  it('converts a string into a base64 string ', async () => {
    let str = 'unit test'
    let base64String = 'dW5pdCB0ZXN0'
    assert.equal(EpicVaultParser.strToBase64(str), base64String)

    str = 'EpicVaultParser'
    base64String = 'TmVvblBhcnNlcg=='
    assert.equal(EpicVaultParser.strToBase64(str), base64String)
  })

  it('converts a string into a hex string', async () => {
    let str = 'unit test'
    let hexString = '756e69742074657374'
    assert.equal(EpicVaultParser.strToHex(str), hexString)

    str = 'EpicVaultParser'
    hexString = '4e656f6e506172736572'
    assert.equal(EpicVaultParser.strToHex(str), hexString)
  })

  // Currently neon-core's utf82base64 method is bugged, but will be fixed on the next patch release
  it.skip('converts a utf-8 string into a base64 string', async () => {
    let utf8String = 'unit test'
    let base64String = 'dW5pdCB0ZXN0'
    assert.equal(EpicVaultParser.utf8ToBase64(utf8String), base64String)

    utf8String = 'EpicVaultParser'
    base64String = 'TmVvblBhcnNlcg=='
    assert.equal(EpicVaultParser.utf8ToBase64(utf8String), base64String)

    utf8String = 'ãõáàç'
    base64String = 'w6PDtcOhw6DDpw=='
    assert.equal(EpicVaultParser.utf8ToBase64(utf8String), base64String)
  })

  it('converts a ascii string into a base64 string', async () => {
    let asciiString = 'unit test'
    let base64String = 'dW5pdCB0ZXN0'
    assert.equal(EpicVaultParser.asciiToBase64(asciiString), base64String)

    asciiString = 'EpicVaultParser'
    base64String = 'TmVvblBhcnNlcg=='
    assert.equal(EpicVaultParser.asciiToBase64(asciiString), base64String)
  })

  describe('parseRpcResponse', function () {
    it('parses Address', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        value: EpicVaultParser.asciiToBase64('NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs'),
      }

      const address = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'String', hint: 'Address' })
      assert.deepEqual(address, 'NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs')
    })

    it('parses invalid Address', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        // Address will end up too short
        value: EpicVaultParser.hexToBase64('Nnnnnnnnnnnnnnnn'),
      }
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'String', hint: 'Address' }))

      // Address will be too big
      rpcResponse.value = EpicVaultParser.strToBase64('NnnnnnnnnnnnnnnnNnnnnnnnnnnnnnnnNnnnnnnnnnnnnnnn')
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'String', hint: 'Address' }))

      // Address shouldn't start with a letter that isn't 'A' or 'N'
      rpcResponse.value = EpicVaultParser.strToBase64('BNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs')
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'String', hint: 'Address' }))

      // Address shouldn't have invalid base58 characters
      rpcResponse.value = EpicVaultParser.strToBase64('NNLI44dJNXtDNSBkofB48aTVYtb1zZrNEL')
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'String', hint: 'Address' }))
    })

    it('parses ScriptHash and ScriptHashLittleEndian', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        value: EpicVaultParser.hexToBase64('61479ab68fd5c2c04b254f382d84ddf2f5c67ced'),
      }

      const scriptHash = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash160', hint: 'ScriptHash' })
      assert.deepEqual(scriptHash, '0xed7cc6f5f2dd842d384f254bc0c2d58fb69a4761')

      const scriptHashLilEndian = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Hash160',
        hint: 'ScriptHashLittleEndian',
      })
      assert.deepEqual(scriptHashLilEndian, '61479ab68fd5c2c04b254f382d84ddf2f5c67ced')
    })

    it('parses invalid ScriptHash and ScriptHashLittleEndian', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        // ScriptHash will end up too short
        value: EpicVaultParser.hexToBase64('61479ab68fd5c2c04b25'),
      }
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash160', hint: 'ScriptHash' }))
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash160', hint: 'ScriptHashLittleEndian' }))

      // ScriptHash will be too big
      rpcResponse.value = EpicVaultParser.hexToBase64('61479ab68fd5c2c04b254f382d84ddf2f5c67ced111111111111')
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash160', hint: 'ScriptHash' }))
      assert.throws(() => EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash160', hint: 'ScriptHashLittleEndian' }))
    })

    it('parses BlockHash or TransactionId', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        value: EpicVaultParser.hexToBase64(
          EpicVaultParser.reverseHex('0x6c513de791b17ddadec205a07301229ac890d71c16c1d5a0320c655fb69214fc'.substring(2)),
        ),
      }

      const blockHash = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash256', hint: 'BlockHash' })
      const transactionId = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash256', hint: 'TransactionId' })
      assert.deepEqual(transactionId, '0x6c513de791b17ddadec205a07301229ac890d71c16c1d5a0320c655fb69214fc')
      assert.deepEqual(blockHash, transactionId)

      // There isn't a different on how they are returned right now
      const hash256 = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Hash256' })
      assert.deepEqual(hash256, blockHash)
    })

    it('parses ByteString without parseConfig', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        value: EpicVaultParser.asciiToBase64('Testing'),
      }

      const stringValue = EpicVaultParser.parseRpcResponse(rpcResponse)
      assert.deepEqual(stringValue, 'Testing')

      const bytesValue = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'ByteArray' })
      assert.deepEqual(bytesValue, '54657374696e67')
    })

    it('parses PublicKey', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        value: EpicVaultParser.hexToBase64('03cdb067d930fd5adaa6c68545016044aaddec64ba39e548250eaea551172e535c'),
      }

      const scriptHash = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'PublicKey' })
      assert.deepEqual(scriptHash, '03cdb067d930fd5adaa6c68545016044aaddec64ba39e548250eaea551172e535c')
    })

    it('parses Integer', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'Integer',
        value: '18',
      }

      const integer = EpicVaultParser.parseRpcResponse(rpcResponse)
      assert.deepEqual(integer, 18)
    })

    it('parses single type Array', async () => {
      let rpcResponse: RpcResponseStackItem = {
        type: 'Array',
        value: [
          {
            type: 'Integer',
            value: '10',
          },
          {
            type: 'Integer',
            value: '20',
          },
          {
            type: 'Integer',
            value: '30',
          },
        ],
      }
      let array = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Array', generic: { type: 'Integer' } })
      assert.deepEqual(array, [10, 20, 30])

      rpcResponse = {
        type: 'Array',
        value: [
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('test'),
          },
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('array'),
          },
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('return'),
          },
        ],
      }
      array = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Array', generic: { type: 'String' } })
      assert.deepEqual(array, ['test', 'array', 'return'])

      // Will also work if you don't send a parseConfig and expects the ByteString results to be a String
      assert.deepEqual(array, EpicVaultParser.parseRpcResponse(rpcResponse))

      rpcResponse = {
        type: 'Array',
        value: [
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('test'),
          },
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('array'),
          },
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('return'),
          },
        ],
      }
      array = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Array', generic: { type: 'ByteArray' } })
      assert.deepEqual(array, ['74657374', '6172726179', '72657475726e'])
    })

    it('parses Union', async () => {
      let rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        value: EpicVaultParser.strToBase64('test'),
      }
      let union = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Any',
        union: [{ type: 'String' }, { type: 'Integer' }],
      })
      assert.deepEqual(union, 'test')

      rpcResponse = {
        type: 'Integer',
        value: '12',
      }
      union = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Any',
        union: [{ type: 'String' }, { type: 'Integer' }],
      })
      assert.deepEqual(union, 12)

      rpcResponse = {
        type: 'ByteString',
        value: EpicVaultParser.hexToBase64('61479ab68fd5c2c04b254f382d84ddf2f5c67ced'),
      }
      union = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Any',
        union: [{ type: 'Hash160', hint: 'ScriptHash' }, { type: 'Integer' }],
      })
      assert.deepEqual(union, '0xed7cc6f5f2dd842d384f254bc0c2d58fb69a4761')
    })

    it('parses same internal types with Union', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'ByteString',
        value: EpicVaultParser.strToBase64('test'),
      }

      // It's not possible to definitly know the correct return of the same internal type, currently, it's only a ByteString problem,
      // so whenever there are multiple ByteStrings on a union it will be considerer as a String
      const str = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Any',
        union: [{ type: 'Hash160', hint: 'ScriptHash' }, { type: 'Hash256', hint: 'BlockHash' }, { type: 'Integer' }],
      })
      assert.deepEqual(str, 'test')
    })

    it('parses multiple types Array', async () => {
      let rpcResponse: RpcResponseStackItem = {
        type: 'Array',
        value: [
          {
            type: 'Integer',
            value: '10',
          },
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('test'),
          },
          {
            type: 'ByteString',
            value: EpicVaultParser.strToBase64('parser'),
          },
        ],
      }
      let array = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Array',
        generic: {
          type: 'Any',
          union: [
            {
              type: 'Integer',
            },
            {
              type: 'String',
            },
          ],
        },
      })
      assert.deepEqual(array, [10, 'test', 'parser'])

      rpcResponse = {
        type: 'Array',
        value: [
          {
            type: 'Integer',
            value: '10',
          },
          {
            type: 'ByteString',
            value: 'Tk5MaTQ0ZEpOWHRETlNCa29mQjQ4YVRWWXRiMXpack5Fcw',
          },
          {
            type: 'ByteString',
            value: 'TlozcHFuYzFoTU44RUhXNTVabkNudThCMndvb1hKSEN5cg==',
          },
        ],
      }
      array = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Array',
        generic: {
          type: 'Any',
          union: [
            {
              type: 'Integer',
            },
            {
              type: 'String',
              hint: 'Address',
            },
          ],
        },
      })
      assert.deepEqual(array, [10, 'NNLi44dJNXtDNSBkofB48aTVYtb1zZrNEs', 'NZ3pqnc1hMN8EHW55ZnCnu8B2wooXJHCyr'])
    })

    it('parses single type Map', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('unit'),
            },
            value: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('test'),
            },
          },
          {
            key: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('neo'),
            },
            value: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('parser'),
            },
          },
        ],
      }
      const map = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Map',
        genericKey: { type: 'String' },
        genericItem: { type: 'String' },
      })
      assert.deepEqual(map, { unit: 'test', neo: 'parser' })
      // Will also work if you don't send a parseConfig and expects the ByteString results to be a String
      assert.deepEqual(map, EpicVaultParser.parseRpcResponse(rpcResponse))
    })

    it('parses multiple types Map', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('unit'),
            },
            value: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('test'),
            },
          },
          {
            key: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('neo'),
            },
            value: {
              type: 'Integer',
              value: '123',
            },
          },
          {
            key: {
              type: 'Integer',
              value: '789',
            },
            value: {
              type: 'Integer',
              value: '123',
            },
          },
        ],
      }
      const map = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Map',
        genericKey: { type: 'Any', union: [{ type: 'String' }, { type: 'Integer' }] },
        genericItem: { type: 'Any', union: [{ type: 'String' }, { type: 'Integer' }] },
      })
      assert.deepEqual(map, { unit: 'test', neo: 123, 789: 123 })
    })

    it('parses Boolean', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'Boolean',
        value: true,
      }

      let bool = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Boolean' })
      assert.deepEqual(bool, true)
      bool = EpicVaultParser.parseRpcResponse(rpcResponse)
      assert.deepEqual(bool, true)

      rpcResponse.value = false
      bool = EpicVaultParser.parseRpcResponse(rpcResponse, { type: 'Boolean' })
      assert.deepEqual(bool, false)
      bool = EpicVaultParser.parseRpcResponse(rpcResponse)
      assert.deepEqual(bool, false)
    })

    it('parses Iterator', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'InteropInterface',
        interface: 'IIterator',
        id: 'e93e82f7-629b-4b4b-9fae-054d18bd32e2',
      }

      // currently can't parse an iterator
      const iterator = EpicVaultParser.parseRpcResponse(rpcResponse)
      assert.deepEqual(iterator, undefined)
    })

    it('parses Array inside Map', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('test'),
            },
            value: {
              type: 'Array',
              value: [
                { type: 'ByteString', value: EpicVaultParser.strToBase64('abc') },
                { type: 'ByteString', value: EpicVaultParser.strToBase64('def') },
                { type: 'ByteString', value: EpicVaultParser.strToBase64('ghi') },
              ],
            },
          },
          {
            key: {
              type: 'ByteString',
              value: EpicVaultParser.strToBase64('neo'),
            },
            value: {
              type: 'Integer',
              value: '123',
            },
          },
        ],
      }

      const map = EpicVaultParser.parseRpcResponse(rpcResponse)
      assert.deepEqual(map, { test: ['abc', 'def', 'ghi'], neo: 123 })

      const mapWithConfig = EpicVaultParser.parseRpcResponse(rpcResponse, {
        type: 'Map',
        genericKey: { type: 'String' },
        genericItem: { type: 'Any', union: [{ type: 'Integer' }, { type: 'Array', generic: { type: 'ByteArray' } }] },
      })
      assert.deepEqual(mapWithConfig, { test: ['616263', '646566', '676869'], neo: 123 })
    })

    it('parses Map inside Array', async () => {
      const rpcResponseArray: RpcResponseStackItem = {
        type: 'Array',
        value: [
          { type: 'ByteString', value: EpicVaultParser.strToBase64('abc') },
          {
            type: 'Map',
            value: [
              {
                key: { type: 'ByteString', value: EpicVaultParser.strToBase64('neon') },
                value: { type: 'ByteString', value: EpicVaultParser.strToBase64('parser') },
              },
              {
                key: { type: 'ByteString', value: EpicVaultParser.strToBase64('unit') },
                value: { type: 'ByteString', value: EpicVaultParser.strToBase64('test') },
              },
            ],
          },
          { type: 'ByteString', value: EpicVaultParser.strToBase64('def') },
        ],
      }
      let array = EpicVaultParser.parseRpcResponse(rpcResponseArray)
      assert.deepEqual(array, ['abc', { neon: 'parser', unit: 'test' }, 'def'])

      array = EpicVaultParser.parseRpcResponse(rpcResponseArray, {
        type: 'Array',
        generic: {
          type: 'Any',
          union: [
            { type: 'String' },
            { type: 'Map', genericKey: { type: 'String' }, genericItem: { type: 'ByteArray' } },
          ],
        },
      })
      assert.deepEqual(array, ['abc', { neon: '706172736572', unit: '74657374' }, 'def'])
    })

    it('parses raw when UTF8 parsing fails', async () => {
      const rpcResponse: RpcResponseStackItem = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'ByteString',
              value: 'bmFtZQ==',
            },
            value: {
              type: 'ByteString',
              value: 'TElaQVJE',
            },
          },
          {
            key: {
              type: 'ByteString',
              value: 'c2VlZA==',
            },
            value: {
              type: 'ByteString',
              value: 'dphNnS0kGxelyR4Q8ntrbA==',
            },
          },
        ],
      }

      const parsed = EpicVaultParser.parseRpcResponse(rpcResponse)
      assert.deepEqual(parsed, { name: 'LIZARD', seed: 'dphNnS0kGxelyR4Q8ntrbA==' })
    })
  })

  describe('formatRpcArgument', () => {
    it('format numbers', async () => {
      let numberArg = EpicVaultParser.formatRpcArgument(0)
      let expectedResult = { type: 'Integer', value: '0' }
      assert.deepStrictEqual(numberArg, expectedResult)

      numberArg = EpicVaultParser.formatRpcArgument(1)
      expectedResult = { type: 'Integer', value: '1' }
      assert.deepStrictEqual(numberArg, expectedResult)

      numberArg = EpicVaultParser.formatRpcArgument(123)
      expectedResult = { type: 'Integer', value: '123' }
      assert.deepStrictEqual(numberArg, expectedResult)

      numberArg = EpicVaultParser.formatRpcArgument(-10)
      expectedResult = { type: 'Integer', value: '-10' }
      assert.deepStrictEqual(numberArg, expectedResult)
    })

    it('format boolean', async () => {
      let booleanArg = EpicVaultParser.formatRpcArgument(true)
      let expectedResult = { type: 'Boolean', value: true }
      assert.deepStrictEqual(booleanArg, expectedResult)

      booleanArg = EpicVaultParser.formatRpcArgument(false)
      expectedResult = { type: 'Boolean', value: false }
      assert.deepStrictEqual(booleanArg, expectedResult)
    })

    it('format string', async () => {
      let stringArg = EpicVaultParser.formatRpcArgument('unit test')
      let expectedResult = { type: 'String', value: 'unit test' }
      assert.deepStrictEqual(stringArg, expectedResult)

      stringArg = EpicVaultParser.formatRpcArgument('1234')
      expectedResult = { type: 'String', value: '1234' }
      assert.deepStrictEqual(stringArg, expectedResult)
    })

    it('format ByteArray', async () => {
      let byteArrayValue = EpicVaultParser.strToHex('unit test')
      let byteArrayArg = EpicVaultParser.formatRpcArgument(byteArrayValue, { type: 'ByteArray' })
      let expectedResult = { type: 'ByteArray', value: byteArrayValue }
      assert.deepStrictEqual(byteArrayArg, expectedResult)

      byteArrayValue = EpicVaultParser.strToHex('another value 1234')
      byteArrayArg = EpicVaultParser.formatRpcArgument(byteArrayValue, { type: 'ByteArray' })
      expectedResult = { type: 'ByteArray', value: byteArrayValue }
      assert.deepStrictEqual(byteArrayArg, expectedResult)

      // Not passing a config will endup returning a String instead of a ByteArray
      byteArrayArg = EpicVaultParser.formatRpcArgument(byteArrayValue)
      expectedResult = { type: 'ByteArray', value: byteArrayValue }
      assert.notDeepStrictEqual(byteArrayArg, expectedResult)
    })

    it('format Hash160', async () => {
      let hash160Arg = EpicVaultParser.formatRpcArgument('0xbc8459660544656355b4f60861c22f544341e828', { type: 'Hash160' })
      let expectedResult = { type: 'Hash160', value: 'd2a4cff31913016155e38e474a2c06d08be276cf' }
      assert.deepStrictEqual(hash160Arg, expectedResult)

      hash160Arg = EpicVaultParser.formatRpcArgument('d2a4cff31913016155e38e474a2c06d08be276cf', { type: 'Hash160' })
      expectedResult = { type: 'Hash160', value: 'd2a4cff31913016155e38e474a2c06d08be276cf' }
      assert.deepStrictEqual(hash160Arg, expectedResult)

      // Not passing a config will endup returning a String instead of a Hash160
      hash160Arg = EpicVaultParser.formatRpcArgument('d2a4cff31913016155e38e474a2c06d08be276cf')
      expectedResult = { type: 'Hash160', value: 'd2a4cff31913016155e38e474a2c06d08be276cf' }
      assert.notDeepStrictEqual(hash160Arg, expectedResult)
    })

    it('format Hash256', async () => {
      let hash256Arg = EpicVaultParser.formatRpcArgument(
        '0xd2b24b57ea05821766877241a51e17eae06ed66a6c72adb5727f8ba701d995be',
        { type: 'Hash256' },
      )
      let expectedResult = {
        type: 'Hash256',
        value: 'd2b24b57ea05821766877241a51e17eae06ed66a6c72adb5727f8ba701d995be',
      }
      assert.deepStrictEqual(hash256Arg, expectedResult)

      hash256Arg = EpicVaultParser.formatRpcArgument('d2b24b57ea05821766877241a51e17eae06ed66a6c72adb5727f8ba701d995be', {
        type: 'Hash256',
      })
      expectedResult = { type: 'Hash256', value: 'd2b24b57ea05821766877241a51e17eae06ed66a6c72adb5727f8ba701d995be' }
      assert.deepStrictEqual(hash256Arg, expectedResult)

      // Not passing a config will endup returning a String instead of a Hash256
      hash256Arg = EpicVaultParser.formatRpcArgument('d2b24b57ea05821766877241a51e17eae06ed66a6c72adb5727f8ba701d995be')
      expectedResult = { type: 'Hash256', value: 'd2b24b57ea05821766877241a51e17eae06ed66a6c72adb5727f8ba701d995be' }
      assert.notDeepStrictEqual(hash256Arg, expectedResult)
    })

    it('format PublicKey', async () => {
      let publicKeyArg = EpicVaultParser.formatRpcArgument(
        '035a928f201639204e06b4368b1a93365462a8ebbff0b8818151b74faab3a2b61a',
        { type: 'PublicKey' },
      )
      const expectedResult = {
        type: 'PublicKey',
        value: '035a928f201639204e06b4368b1a93365462a8ebbff0b8818151b74faab3a2b61a',
      }
      assert.deepStrictEqual(publicKeyArg, expectedResult)

      publicKeyArg = EpicVaultParser.formatRpcArgument('035a928f201639204e06b4368b1a93365462a8ebbff0b8818151b74faab3a2b61a')
      assert.notDeepStrictEqual(publicKeyArg, expectedResult)
    })

    it('format array of primitive types', async () => {
      let arrayArg = EpicVaultParser.formatRpcArgument([1, 2, 3], { type: 'Array', generic: { type: 'Integer' } })
      let arrayArgNoConfig = EpicVaultParser.formatRpcArgument([1, 2, 3])
      let expectedResult: any = {
        type: 'Array',
        value: [
          { type: 'Integer', value: '1' },
          { type: 'Integer', value: '2' },
          { type: 'Integer', value: '3' },
        ],
      }
      assert.deepStrictEqual(arrayArg, expectedResult)
      assert.deepStrictEqual(arrayArg, arrayArgNoConfig)

      arrayArg = EpicVaultParser.formatRpcArgument([true, false], { type: 'Array', generic: { type: 'Boolean' } })
      arrayArgNoConfig = EpicVaultParser.formatRpcArgument([true, false])
      expectedResult = {
        type: 'Array',
        value: [
          { type: 'Boolean', value: true },
          { type: 'Boolean', value: false },
        ],
      }
      assert.deepStrictEqual(arrayArg, expectedResult)
      assert.deepStrictEqual(arrayArg, arrayArgNoConfig)

      arrayArg = EpicVaultParser.formatRpcArgument(['unit', 'test'], { type: 'Array', generic: { type: 'String' } })
      arrayArgNoConfig = EpicVaultParser.formatRpcArgument(['unit', 'test'])
      expectedResult = {
        type: 'Array',
        value: [
          { type: 'String', value: 'unit' },
          { type: 'String', value: 'test' },
        ],
      }
      assert.deepStrictEqual(arrayArg, expectedResult)
      assert.deepStrictEqual(arrayArg, arrayArgNoConfig)

      arrayArg = EpicVaultParser.formatRpcArgument(['756e6974', '74657374'], {
        type: 'Array',
        generic: { type: 'ByteArray' },
      })
      arrayArgNoConfig = EpicVaultParser.formatRpcArgument(['unit', 'test'])
      expectedResult = {
        type: 'Array',
        value: [
          { type: 'ByteArray', value: '756e6974' },
          { type: 'ByteArray', value: '74657374' },
        ],
      }
      assert.deepStrictEqual(arrayArg, expectedResult)
      assert.notDeepStrictEqual(arrayArg, arrayArgNoConfig)
    })

    it('format map of primitive types', async () => {
      let mapArg = EpicVaultParser.formatRpcArgument({}, { type: 'Map' })
      let mapArgNoConfig = EpicVaultParser.formatRpcArgument({})
      let expectedResult = {
        type: 'Map',
        value: [] as any[],
      }
      assert.deepStrictEqual(mapArg, expectedResult)
      assert.deepStrictEqual(mapArg, mapArgNoConfig)

      mapArg = EpicVaultParser.formatRpcArgument(
        { unit: 'test', neon: 'parser', neo3: 'parser' },
        { type: 'Map', genericKey: { type: 'String' }, genericItem: { type: 'String' } },
      )
      mapArgNoConfig = EpicVaultParser.formatRpcArgument({ unit: 'test', neon: 'parser', neo3: 'parser' })
      expectedResult = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'String',
              value: 'unit',
            },
            value: {
              type: 'String',
              value: 'test',
            },
          },
          {
            key: {
              type: 'String',
              value: 'neon',
            },
            value: {
              type: 'String',
              value: 'parser',
            },
          },
          {
            key: {
              type: 'String',
              value: 'neo3',
            },
            value: {
              type: 'String',
              value: 'parser',
            },
          },
        ],
      }
      assert.deepStrictEqual(mapArg, expectedResult)
      assert.deepStrictEqual(mapArg, mapArgNoConfig)

      mapArg = EpicVaultParser.formatRpcArgument(
        { true: true, false: false },
        { type: 'Map', genericKey: { type: 'Boolean' }, genericItem: { type: 'Boolean' } },
      )
      mapArgNoConfig = EpicVaultParser.formatRpcArgument({ true: true, false: false })
      expectedResult = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'Boolean',
              value: true,
            },
            value: {
              type: 'Boolean',
              value: true,
            },
          },
          {
            key: {
              type: 'Boolean',
              value: false,
            },
            value: {
              type: 'Boolean',
              value: false,
            },
          },
        ],
      }
      assert.deepStrictEqual(mapArg, expectedResult)
      assert.notDeepStrictEqual(mapArg, mapArgNoConfig)

      mapArg = EpicVaultParser.formatRpcArgument(
        { 98765: 12345 },
        { type: 'Map', genericKey: { type: 'Integer' }, genericItem: { type: 'Integer' } },
      )
      mapArgNoConfig = EpicVaultParser.formatRpcArgument({ 98765: 12345 })
      expectedResult = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'Integer',
              value: '98765',
            },
            value: {
              type: 'Integer',
              value: '12345',
            },
          },
        ],
      }
      assert.deepStrictEqual(mapArg, expectedResult)
      assert.notDeepStrictEqual(mapArg, mapArgNoConfig)

      mapArg = EpicVaultParser.formatRpcArgument(
        { '627974654172726179': EpicVaultParser.strToHex('unit test') },
        { type: 'Map', genericKey: { type: 'ByteArray' }, genericItem: { type: 'ByteArray' } },
      )
      mapArgNoConfig = EpicVaultParser.formatRpcArgument({ '627974654172726179': EpicVaultParser.strToHex('unit test') })
      expectedResult = {
        type: 'Map',
        value: [
          {
            key: {
              type: 'ByteArray',
              value: '627974654172726179',
            },
            value: {
              type: 'ByteArray',
              value: '756e69742074657374',
            },
          },
        ],
      }
      assert.deepStrictEqual(mapArg, expectedResult)
      assert.notDeepStrictEqual(mapArg, mapArgNoConfig)
    })

    it('format Any', async () => {
      let anyArg = EpicVaultParser.formatRpcArgument(12345, { type: 'Any' })
      let expectedResult: any = {
        type: 'Integer',
        value: '12345',
      }
      assert.deepStrictEqual(anyArg, expectedResult)

      anyArg = EpicVaultParser.formatRpcArgument(false, { type: 'Any' })
      expectedResult = {
        type: 'Boolean',
        value: false,
      }
      assert.deepStrictEqual(anyArg, expectedResult)

      anyArg = EpicVaultParser.formatRpcArgument('unit test', { type: 'Any' })
      expectedResult = {
        type: 'String',
        value: 'unit test',
      }
      assert.deepStrictEqual(anyArg, expectedResult)

      anyArg = EpicVaultParser.formatRpcArgument([1, 2], { type: 'Any' })
      expectedResult = {
        type: 'Array',
        value: [
          { type: 'Integer', value: '1' },
          { type: 'Integer', value: '2' },
        ],
      }
      assert.deepStrictEqual(anyArg, expectedResult)

      anyArg = EpicVaultParser.formatRpcArgument(null, { type: 'Any' })
      expectedResult = { type: 'Any', value: null }
      assert.deepStrictEqual(anyArg, expectedResult)
    })
  })
})
