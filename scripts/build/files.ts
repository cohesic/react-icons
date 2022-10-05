import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getIconFilePaths } from '../files'

export type IconFile = {
  baseName: string
  fullPath: string
  originalContent: string
}

export async function getIconFiles(): Promise<IconFile[]> {
  return Promise.all(
    (await getIconFilePaths()).map(async (fullPath) => {
      const originalContent = await readFile(fullPath, { encoding: 'utf-8' })
      return {
        baseName: path.basename(fullPath, '.svg'),
        fullPath,
        originalContent,
      }
    }),
  )
}
