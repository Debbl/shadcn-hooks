import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import type { Transformer } from 'unified'

export function remarkInstallCli(): Transformer<Root, Root> {
  const fn = (node: MdxJsxFlowElement) => {
    node.children.forEach((n) => {
      if (n.type !== 'mdxJsxFlowElement') return

      fn(n)
    })

    if (node.name !== 'InstallCLI') return

    const attrValue = node.attributes[0]?.value
    const value = `npx shadcn@latest add @hooks/${attrValue}"`

    Object.assign(node, {
      type: 'code',
      lang: 'package-install',
      value,
    })
  }

  return (tree) => {
    visit(tree, 'mdxJsxFlowElement', (node) => {
      fn(node)
    })
  }
}
