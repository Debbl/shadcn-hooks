import { readFileSync } from 'node:fs'
import { globSync } from 'glob'
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import type { Transformer } from 'unified'

export function remarkRegistrySourceCode(): Transformer<Root, Root> {
  const fn = (node: MdxJsxFlowElement) => {
    node.children.forEach((n) => {
      if (n.type !== 'mdxJsxFlowElement') return

      fn(n)
    })

    if (node.name !== 'RegistrySourceCode') return

    const attrValue = node.attributes[0]?.value
    const files = globSync(`./registry/**/${attrValue}.{ts,tsx}`)
    const file = files[0]
    if (!file) return

    const ext = file.split('.').pop()
    const value = readFileSync(file, 'utf-8')

    Object.assign(node, {
      type: 'code',
      lang: ext,
      meta: `title=\"${attrValue}.${ext}\"`,
      value,
    })
  }

  return (tree) => {
    visit(tree, 'mdxJsxFlowElement', (node) => {
      fn(node)
    })
  }
}
