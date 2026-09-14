import { register } from 'fumadocs-mdx/node'
import { printErrors, scanURLs, validateFiles } from 'next-validate-link'

register()

const { source } = await import('../src/lib/source')
const pages = source.getPages()
const scanned = await scanURLs({
  preset: 'next',
  populate: {
    'docs/[[...slug]]': pages.map((page) => ({
      value: { slug: page.slugs },
      hashes: page.data.toc.map((item) => item.url.slice(1)),
    })),
  },
})

const files = await Promise.all(
  pages.map(async (page) => ({
    path: page.data.info.fullPath,
    content: await page.data.getText('raw'),
    url: page.url,
  })),
)

printErrors(
  await validateFiles(files, {
    scanned,
    markdown: {
      components: {
        Card: { attributes: ['href'] },
        Link: { attributes: ['href'] },
        a: { attributes: ['href'] },
      },
    },
    checkRelativePaths: 'as-url',
  }),
  true,
)
