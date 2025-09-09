import { createGenerator } from 'fumadocs-typescript'
import { AutoTypeTable } from 'fumadocs-typescript/ui'
import * as TabsComponents from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import type { MDXComponents } from 'mdx/types'

const generator = createGenerator()

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    AutoTypeTable: (props) => (
      <AutoTypeTable {...props} generator={generator} />
    ),
    ...TabsComponents,
    ...components,
  } satisfies MDXComponents
}

declare module 'mdx/types.js' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = React.JSX.Element
    type ElementClass = React.JSX.ElementClass
    type ElementType = React.JSX.ElementType
    type IntrinsicAttributes = React.JSX.IntrinsicAttributes
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
