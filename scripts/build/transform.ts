import SVGO from 'svgo'
import { IconFile } from './files'
import { svgoConfig } from './svgo'
import cheerio from 'cheerio'
import camelCase from 'camelcase'
import { SvgAst } from '../../src/common'

export type OptimizedIconFile = IconFile & {
  optimizedContent: string
  width: number
  height: number
}

async function optimizeSvg(
  input: string,
): Promise<{ data: string; width: number; height: number }> {
  const result = SVGO.optimize(input, svgoConfig)

  if ('data' in result) {
    return {
      data: result.data,
      width: parseInt(result.info.width),
      height: parseInt(result.info.height),
    }
  } else {
    throw new Error(result.error)
  }
}

export async function optimizeIconFiles(
  iconFiles: IconFile[],
): Promise<OptimizedIconFile[]> {
  return Promise.all(
    iconFiles.map(async (iconFile) => {
      const { data, ...sizes } = await optimizeSvg(iconFile.originalContent)
      return { ...iconFile, optimizedContent: data, ...sizes }
    }),
  )
}

export type OptimizedAstIconFile = OptimizedIconFile & {
  ast: SvgAst
}

function remapCheerioAttrs(tag: string, attrs: Record<string, string>) {
  return Object.entries(attrs).reduce<Record<string, string>>(
    (newAttrs, [attr, value]) => {
      if (tag === 'svg' && ['width', 'height', 'xmlns'].includes(attr)) {
        return newAttrs
      } else {
        newAttrs[camelCase(attr)] = value
        return newAttrs
      }
    },
    {},
  )
}

function cheerioToAst(el: cheerio.Element): SvgAst | null {
  if (el.type === 'tag') {
    const tag = el.name
    const attrs = remapCheerioAttrs(tag, el.attribs)
    const children = el.children
      .map(cheerioToAst)
      .filter((c) => c !== null) as SvgAst[]
    return { tag, attrs, children }
  } else {
    return null
  }
}

export async function addAstToIconFiles(
  iconFiles: OptimizedIconFile[],
): Promise<OptimizedAstIconFile[]> {
  return Promise.resolve(
    iconFiles.map((iconFile) => {
      const parsedSvg = cheerio.load(iconFile.optimizedContent, {
        xmlMode: true,
      })
      const ast = cheerioToAst(parsedSvg('svg').get()[0])

      if (ast !== null) {
        return {
          ...iconFile,
          ast: cheerioToAst(parsedSvg('svg').get()[0]),
        } as OptimizedAstIconFile
      } else {
        throw new Error(
          `Unable to parse optimized SVG from ${iconFile.fullPath}`,
        )
      }
    }),
  )
}
