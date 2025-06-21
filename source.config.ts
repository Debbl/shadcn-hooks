import { remarkInstall } from 'fumadocs-docgen'
import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config'
import { remarkInstallCli } from './remark/remark-install-cli'
import { remarkPackageInstall } from './remark/remark-package-install'
import { remarkRegistrySourceCode } from './remark/remark-registry-source-code'

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
})

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    remarkPlugins: [
      remarkPackageInstall,
      remarkInstallCli,
      remarkRegistrySourceCode,
      [remarkInstall, { persist: { id: 'package-manager' } }],
    ],
  },
})
