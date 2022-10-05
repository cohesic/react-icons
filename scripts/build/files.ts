import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'
import glob from 'glob'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type IconFile = {
  baseName: string
  fullPath: string
  originalContent: string
}

export function projectRootPath(...pathParts: string[]) {
  return path.resolve(__dirname, '..', '..', ...pathParts)
}

export function assetsPath(...pathParts: string[]) {
  return path.resolve(__dirname, 'assets', ...pathParts)
}

export function distPath(...pathParts: string[]) {
  return path.resolve(__dirname, '..', '..', 'dist', ...pathParts)
}

export function iconsPath(...pathParts: string[]) {
  return path.resolve(__dirname, '..', '..', 'src', 'icons', ...pathParts)
}

export const copyFile = promisify(fs.copyFile)

export const readFile = promisify(fs.readFile)

export const writeFile = promisify(fs.writeFile)

async function getIconFilePaths(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(iconsPath('*.svg'), (err, matches) => {
      if (err) {
        reject(err)
      } else {
        resolve(matches)
      }
    })
  })
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
