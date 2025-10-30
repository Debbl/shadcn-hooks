'use client'
import Link from 'fumadocs-core/link'
import { useCopyButton } from 'fumadocs-ui/utils/use-copy-button'
import {
  ChevronDownIcon,
  Copy,
  CopyCheck,
  MessageCircleIcon,
} from 'lucide-react'
import { useState } from 'react'
import { ChatGPTIcon, ClaudeIcon, V0Icon } from '~/components/icons'
import { Button } from '~/components/ui/button'
import { ButtonGroup } from '~/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { websiteConfig } from '~/constants'

const cache = new Map<string, string>()

function getPromptUrl(baseURL: string, url: string) {
  return `${baseURL}?q=${encodeURIComponent(
    `I'm looking at this shadcn-hooks documentation: ${url}.
Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.
  `,
  )}`
}

export function LLMCopyButton({ slug, url }: { slug: string[]; url: string }) {
  const [isLoading, setLoading] = useState(false)
  const [checked, onClick] = useCopyButton(async () => {
    setLoading(true)

    const url = `/llms.mdx/${slug.join('/')}`
    try {
      const cached = cache.get(url)

      if (cached) {
        await navigator.clipboard.writeText(cached)
      } else {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': fetch(url).then(async (res) => {
              const content = await res.text()
              cache.set(url, content)

              return content
            }),
          }),
        ])
      }
    } finally {
      setLoading(false)
    }
  })

  const docsUrl = websiteConfig.baseUrl + url
  const menuItems = [
    {
      label: 'Open in ChatGPT',
      icon: <ChatGPTIcon className='size-3.5' />,
      href: getPromptUrl('https://chatgpt.com', docsUrl),
    },
    {
      label: 'Open in v0',
      icon: <V0Icon className='size-3.5' />,
      href: getPromptUrl('https://v0.dev', docsUrl),
    },
    {
      label: 'Open in Claude',
      icon: <ClaudeIcon className='size-3.5' />,
      href: getPromptUrl('https://claude.ai/new', docsUrl),
    },
    {
      label: 'Open in T3 Chat',
      icon: <MessageCircleIcon className='size-3.5' />,
      href: getPromptUrl('https://t3.chat/new', docsUrl),
    },
  ]

  return (
    <ButtonGroup>
      <Button
        disabled={isLoading}
        variant='secondary'
        className='gap-2'
        onClick={onClick}
      >
        {checked ? (
          <CopyCheck className='size-3.5' />
        ) : (
          <Copy className='size-3.5' />
        )}
        Copy Markdown
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' aria-label='More Options'>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='gap-y-1.5' sideOffset={12}>
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link href={item.href}>
                {item.icon}
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export function GitHubLink({ url }: { url: string }) {
  return (
    <Button variant='secondary' className='gap-2' asChild>
      <Link href={url}>
        <svg
          fill='currentColor'
          role='img'
          viewBox='0 0 24 24'
          className='size-3.5'
        >
          <title>GitHub</title>
          <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
        </svg>
        View on GitHub
      </Link>
    </Button>
  )
}
