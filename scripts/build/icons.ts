import { writeFile } from './files'
import { OptimizedAstIconFile } from './transform'

function tsIcon({ ast, baseName }: OptimizedAstIconFile) {
  return (
    `export function ${baseName}(props: IconProps) {\n` +
    `  return buildIcon(${JSON.stringify(ast)})(props)\n` +
    `}\n`
  )
}

const iconFilesPreamble = `// THIS FILE IS AUTO-GENERATED\n`
const tsPreamble = `${iconFilesPreamble}import { buildIcon, IconProps } from './icon'\n`

export async function writeIconsFile(
  iconsFiles: OptimizedAstIconFile[],
  path: string,
) {
  const content = iconsFiles.reduce(
    (out, iconFile) => out + tsIcon(iconFile),
    tsPreamble,
  )

  await writeFile(path, content)
}
