import { OptimizeOptions } from 'svgo'

export const svgoConfig: OptimizeOptions = {
  multipass: true,
  plugins: [
    { name: 'removeAttrs', params: { attrs: ['class', 'fill', 'stroke'] } },
    {
      name: 'addAttributesToSVGElement',
      // @ts-expect-error Seems that the types don't agree with this (correct use).
      params: {
        // These are set due to the stroke-only nature of these icons.
        attributes: [
          { fill: 'none' },
          { stroke: 'currentColor' },
          { 'stroke-width': 2 },
        ],
      },
    },
  ],
}
