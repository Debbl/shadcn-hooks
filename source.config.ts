import { remarkInstall } from 'fumadocs-docgen'
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config'
import lastModified from 'fumadocs-mdx/plugins/last-modified'
import { remarkDemo } from './remark/remark-demo'
import { remarkInstallCli } from './remark/remark-install-cli'
import { remarkPackageInstall } from './remark/remark-package-install'
import { remarkRegistrySourceCode } from './remark/remark-registry-source-code'

// You can customize Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
})

export const registry = defineDocs({
  dir: 'src/registry',
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
})

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: [
      remarkDemo,
      remarkPackageInstall,
      remarkInstallCli,
      remarkRegistrySourceCode,
      [remarkInstall, { persist: { id: 'package-manager' } }],
    ],
  },
})
