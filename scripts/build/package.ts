import { readFile, writeFile } from 'node:fs/promises'

export async function writePackageJson(sourcePath: string, destPath: string) {
  const originalJson = await readFile(sourcePath, { encoding: 'utf8' })
  const originalPackage = JSON.parse(originalJson)

  delete originalPackage['devDependencies']
  delete originalPackage['scripts']

  originalPackage['type'] = 'module'
  originalPackage['exports'] = {
    '.': {
      import: './index.js',
      require: './index.cjs.js',
      types: './index.d.ts',
    },
  }
  originalPackage['main'] = './index.cjs.js'
  originalPackage['module'] = './index.js'
  originalPackage['types'] = './index.d.ts'

  await writeFile(destPath, JSON.stringify(originalPackage, null, 2))
}
