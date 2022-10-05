import { getIconFilePaths } from '../files'
import { dirname, join } from 'node:path'
import { copyFile, rm } from 'node:fs/promises'

const figmaExportFileNameMatcher = new RegExp(/Name=(.+\.svg)$/)

async function rename(fromPath: string, toPath: string) {
  try {
    await copyFile(fromPath, toPath)
    await rm(fromPath)
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(e.message)
    } else {
      throw new Error(
        `Unknown error while trying to move file from ${fromPath} to ${toPath}`,
      )
    }
  }
}

async function main() {
  console.log('--- Cleaning Icon Filenames ---')
  const iconFilePaths = await getIconFilePaths()
  await Promise.all(
    iconFilePaths.map(async (filePath) => {
      const match = filePath.match(figmaExportFileNameMatcher)
      if (match !== null) {
        const newPath = join(dirname(filePath), match[1])
        await rename(filePath, newPath)
        console.log(`  > Corrected ${match[1]}`)
      } else {
        return
      }
    }),
  )
}

main()
  .then(() => {
    console.log('Complete')
    process.exit(0)
  })
  .catch((e) => {
    console.log('Failed', e)
    process.exit(1)
  })
