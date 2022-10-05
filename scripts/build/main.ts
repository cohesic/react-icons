import { copyFile, distPath, getIconFiles, projectRootPath } from './files'
import { addAstToIconFiles, optimizeIconFiles } from './transform'
import { exec as cbExec } from 'child_process'
import { promisify } from 'util'
import { writeIconsFile } from './icons'
import { writePackageJson } from './package'

const exec = promisify(cbExec)

const timerLabel = 'Elapsed'

async function main() {
  console.log('--- Converting Icons ---')
  console.time(timerLabel)
  const iconFiles = await getIconFiles()
  const optimizedIconFiles = await optimizeIconFiles(iconFiles)
  const optimizedAstIconFiles = await addAstToIconFiles(optimizedIconFiles)
  console.timeEnd(timerLabel)

  console.log('--- Writing Icons ---')
  console.time(timerLabel)
  await writeIconsFile(
    optimizedAstIconFiles,
    projectRootPath('src', 'index.ts'),
  )
  console.timeEnd(timerLabel)

  console.log('--- Bundle ---')
  console.time(timerLabel)
  await exec(`npx tsup src/index.ts --format esm,cjs --dts --minify`)
  console.timeEnd(timerLabel)

  console.log('--- Preparing for Publish ---')
  console.time(timerLabel)
  await copyFile(projectRootPath('README.md'), distPath('README.md'))
  await writePackageJson(
    projectRootPath('package.json'),
    distPath('package.json'),
  )
  console.timeEnd(timerLabel)
}

main()
  .then(() => {
    console.log('Complete')
    process.exit(0)
  })
  .catch((e) => {
    console.log('Failed', e.message)
    process.exit(1)
  })
