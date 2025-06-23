import { readFileSync } from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import type { Transformer } from 'unified'

// eslint-disable-next-line n/prefer-global/process
const registryPath = path.join(process.cwd(), 'registry')

const fn = (node: MdxJsxFlowElement) => {
  node.children.forEach((n) => {
    if (n.type !== 'mdxJsxFlowElement') return

    fn(n)
  })

  if (node.name !== 'RegistrySourceCode') return
  const attrValue = node.attributes[0].value
  const files = globSync(`${registryPath}/**/${attrValue}.{ts,tsx}`)
  const file = files[0]
  if (!file) return

  const ext = file.split('.').pop()
  const content = readFileSync(file, 'utf-8')

  Object.assign(node, {
    type: 'code',
    lang: ext ?? 'ts',
    meta: `title=\"${attrValue}.${ext}\"`,
    value: content,
  })
}

export function remarkRegistrySourceCode(): Transformer<Root, Root> {
  return (tree) => {
    visit(tree, 'mdxJsxFlowElement', (node) => {
      fn(node)
    })
  }
}
