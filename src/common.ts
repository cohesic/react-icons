export type SvgAst = {
  tag: string
  attrs: Record<string, string>
  children: SvgAst[]
}
