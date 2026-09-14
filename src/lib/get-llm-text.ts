import { websiteConfig } from '~/constants'
import type { Page } from '~/lib/source'

export async function getLLMText(page: Page) {
  const content = await page.data.getText('processed')

  return `# ${page.data.title}
URL: ${new URL(page.url, websiteConfig.baseUrl)}
Source: ${websiteConfig.githubUrl}/blob/main/${page.absolutePath}

${page.data.description ?? ''}

${content}`
}
