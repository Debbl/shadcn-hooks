import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '~/app/layout.config'
import { source } from '~/lib/source'
import type { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  const pageTree = {
    ...source.pageTree,
    children: source.pageTree?.children?.map((i) => {
      if (i.type === 'folder' && i.children.length === 0) {
        return i.index as any // FIXME: type
      }

      return i
    }),
  }

  return (
    <DocsLayout tree={pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  )
}
