import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { Transformer } from 'unified'

export function remarkCodeSource(): Transformer<Root, Root> {
  return (tree) => {
    visit(tree, 'code', (node) => {
      if (node.lang !== 'code-source') return 'skip'

      const value = `npx shadcn@latest add "https://shadcn-hooks.vercel.app/r/${node.value}.json"`

      Object.assign(node, {
        lang: 'package-install',
        value,
      })
    })
  }
}
