import React from 'react'
import { SvgAst } from './common'

export type IconProps = React.SVGAttributes<SVGElement> & {
  children?: React.ReactNode
  size?: string | number
}

function astToElements(svgAst: SvgAst[]): React.ReactElement[] {
  return svgAst.map((node, i) =>
    React.createElement(
      node.tag,
      { key: i, ...node.attrs },
      astToElements(node.children),
    ),
  )
}

export type IconType = (props: IconProps) => JSX.Element

export function Icon({ children, size, ...props }: IconProps) {
  const iconSize = size || '1em'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      width={iconSize}
      height={iconSize}
    >
      {children}
    </svg>
  )
}

export function buildIcon(svgAst: SvgAst): IconType {
  return (props: IconProps) => {
    return (
      <Icon {...svgAst.attrs} {...props}>
        {astToElements(svgAst.children)}
      </Icon>
    )
  }
}
