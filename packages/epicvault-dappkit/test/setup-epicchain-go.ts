import * as fs from 'fs'
import * as path from 'path'
import { https } from 'follow-redirects'
import { execSync } from 'child_process'

async function installEpicChainGo(): Promise<string | undefined> {
  const toolsDir = path.resolve(path.join(__dirname, '..', 'epicchaingo'))

  const platform = process.platform
  let osType = platform.toString()
  let fileExtension = ''
  if (platform == 'win32') {
    osType = 'windows'
    fileExtension = '.exe'
  }

  const goCompilerExecutablePath = path.resolve(path.join(toolsDir, `epicchaingo${fileExtension}`))
  if (fs.existsSync(goCompilerExecutablePath)) {
    return goCompilerExecutablePath
  }

  const version = '0.106.0'
  const arch = process.arch

  let archType = 'arm64'
  if (arch == 'x64') {
    archType = 'amd64'
  }

  if (osType == 'windows' && archType == 'arm64') {
    throw new Error(`Unsupported architecture: ${osType}-${arch}`)
  }

  if (!fs.existsSync(toolsDir)) {
    fs.mkdirSync(toolsDir, { recursive: true })
  }

  if (!fs.existsSync(goCompilerExecutablePath)) {
    if (osType == 'darwin' && archType == 'arm64') {
      const epicchainGoArchivePage = 'https://github.com/nspcc-dev/epicchain-go/archive/refs/tags'
      const downloadUrl = `${epicchainGoArchivePage}/v${version}.zip`
      const zipPath = path.join(toolsDir, 'epicchaingo.zip')

      await downloadAndVerify(downloadUrl, zipPath)

      /* eslint-disable @typescript-eslint/no-var-requires */
      const AdmZip = require('adm-zip')
      const zip = new AdmZip(zipPath)

      zip.extractAllTo(toolsDir, true)
      const extractedFolderPath = path.join(toolsDir, 'epicchain-go-' + version)
      console.log(extractedFolderPath)
      execSync(`make -C ${extractedFolderPath}`)
    } else {
      const fileName = `epicchain-go-${osType}-${archType}${fileExtension}`
      const epicchainGoReleasePage = 'https://github.com/epicchainlabs/epicchain-go/releases'
      const downloadUrl = `${epicchainGoReleasePage}/download/v${version}/${fileName}`

      await downloadAndVerify(downloadUrl, goCompilerExecutablePath)
    }
  }

  fs.chmodSync(goCompilerExecutablePath, '755')
  execSync(`${goCompilerExecutablePath} node -h`)
  return goCompilerExecutablePath
}

async function downloadAndVerify(downloadUrl: string, downloadPath: string) {
  try {
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(downloadPath)
      https
        .get(downloadUrl, (response: { pipe: (stream: fs.WriteStream) => void }) => {
          response.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve()
          })
        })
        .on('error', (err: { message: any }) => {
          fs.unlink(downloadPath, () => {}) // Delete the file async on error
          reject(err.message)
        })
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

installEpicChainGo()
