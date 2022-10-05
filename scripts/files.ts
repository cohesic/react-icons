import path from 'node:path'
import { fileURLToPath } from 'node:url'
import glob from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function projectRootPath(...pathParts: string[]) {
  return path.resolve(__dirname, '..', ...pathParts)
}

export function distPath(...pathParts: string[]) {
  return path.resolve(__dirname, '..', 'dist', ...pathParts)
}

export function iconsPath(...pathParts: string[]) {
  return path.resolve(__dirname, '..', 'src', 'icons', ...pathParts)
}

export async function getIconFilePaths(): Promise<string[]> {
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
