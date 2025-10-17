import * as TabsComponents from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { ContainerWithDemo } from './components/mdx/container-with-demo'
import type { MDXComponents } from 'mdx/types'

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ContainerWithDemo,
    ...defaultMdxComponents,
    ...TabsComponents,
    ...components,
  }
}
