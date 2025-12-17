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
import { ChatGPTIcon, ClaudeIcon, GitHubIcon, V0Icon } from '~/components/icons'
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
        className='border-border gap-2'
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
        <DropdownMenuTrigger
          render={(props) => (
            <Button
              {...props}
              variant='outline'
              size='icon'
              aria-label='More Options'
            >
              <ChevronDownIcon />
            </Button>
          )}
        />
        <DropdownMenuContent
          align='end'
          className='w-auto gap-y-1.5'
          sideOffset={12}
        >
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.label}
              render={(props) => (
                <Link {...props} href={item.href}>
                  {item.icon}
                  {item.label}
                </Link>
              )}
            />
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export function GitHubLink({ url }: { url: string }) {
  return (
    <Button
      variant='secondary'
      className='gap-2'
      render={(props) => (
        <Link {...props} href={url}>
          <GitHubIcon />
          View on GitHub
        </Link>
      )}
    />
  )
}
