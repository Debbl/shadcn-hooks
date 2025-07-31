import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import consola from 'consola'
import { globSync } from 'glob'
import type { RegistryItem } from 'shadcn/registry'

// eslint-disable-next-line n/prefer-global/process
const CWD = process.cwd()

async function getRegistryItems() {
  const registryItemsPaths = globSync(
    ['registry/**/index.json', '!meta.json'],
    {
      cwd: CWD,
    },
  )

  const registryItems: RegistryItem[] = []
  let count = 0
  for (const itemPath of registryItemsPaths) {
    const {
      $schema: _schema,
      type: _type,
      files,
      ...rest
    } = JSON.parse(readFileSync(itemPath, 'utf-8'))
    const hookPath = globSync(`${path.dirname(itemPath)}/index.{ts,tsx}`)[0]
    const isExist = existsSync(hookPath)

    const registryType = path.dirname(itemPath).split('/').at(-2)
    const type = registryType === 'hooks' ? 'registry:hook' : 'registry:lib'
    const name = path.dirname(itemPath).split('/').pop() ?? ''

    registryItems.push({
      type: _type ?? type,
      name,
      author: 'Brendan Dash (https://shadcn-hooks.vercel.app)',
      ...rest,
      files: [
        ...(isExist
          ? [
              {
                path: hookPath,
                type,
              },
            ]
          : []),
        ...(files ?? []),
      ],
    })
    count++
    consola.info(`registry: ${count} - ${name} - ${type}`)
  }
  consola.success(`registry: done ${count} items`)

  const registry = JSON.parse(
    readFileSync(path.join(CWD, 'registry.json'), 'utf-8'),
  )
  registry.items = registryItems

  writeFileSync(
    path.join(CWD, 'registry.json'),
    `${JSON.stringify(registry, null, 2)}\n`,
  )
}

async function getDocsContent() {
  const hooksContentDir = path.join(CWD, 'content/docs/hooks')
  const libsContentDir = path.join(CWD, 'content/docs/lib')

  if (!existsSync(hooksContentDir)) {
    mkdirSync(hooksContentDir, { recursive: true })
  }

  if (!existsSync(libsContentDir)) {
    mkdirSync(libsContentDir, { recursive: true })
  }

  const contentPaths = globSync(
    [
      'registry/**/index.mdx',
      'registry/hooks/meta.json',
      'registry/lib/meta.json',
    ],
    {
      cwd: CWD,
    },
  )

  let count = 0
  for (const itemPath of contentPaths) {
    const content = readFileSync(itemPath, 'utf-8')
    const fileName = path.basename(itemPath)
    const registryType = path.dirname(itemPath).split('/').at(-2)

    const dir = registryType === 'hooks' ? hooksContentDir : libsContentDir

    if (fileName === 'meta.json') {
      writeFileSync(path.join(dir, 'meta.json'), content)
      continue
    }

    const name = path.dirname(itemPath).split('/').pop()
    const contentPath = path.join(dir, `${name}.mdx`)
    writeFileSync(contentPath, content)
    count++
    consola.info(`docs: ${count} - ${name} - ${registryType}`)
  }
  consola.success(`docs: done ${count} items`)
}

async function main() {
  await Promise.all([getRegistryItems(), getDocsContent()])
}

main()
