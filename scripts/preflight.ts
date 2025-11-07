import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import consola from 'consola'
import { globSync } from 'glob'
import matter from 'gray-matter'
import type { getRegistryItems as getRegistryItemsShadcn } from 'shadcn/registry'

type RegistryItem = Awaited<ReturnType<typeof getRegistryItemsShadcn>>[number]

// eslint-disable-next-line n/prefer-global/process
const CWD = process.cwd()

async function generateRegistryItemSchema() {
  const res = await fetch('https://ui.shadcn.com/schema/registry-item.json')
  const data = await res.json()

  if (data.properties) {
    delete data.required
  }

  writeFileSync(
    path.join(CWD, 'schema/registry-item.json'),
    `${JSON.stringify(data, null, 2)}\n`,
  )
}

async function getRegistryItems() {
  const registryItemsPaths = globSync(
    ['src/registry/**/registry-item.json', '!meta.json'],
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

    const docsPath = globSync(`${path.dirname(itemPath)}/index.mdx`)[0]
    const docsMatter = docsPath ? matter.read(docsPath).data : {}

    registryItems.push({
      type: _type ?? type,
      name,
      author: 'Brendan Dash (https://shadcn-hooks.vercel.app)',
      description: docsMatter.description ?? rest.description,
      ...rest,
      files: [
        ...(isExist
          ? [
              {
                target: hookPath
                  .replace('src/registry/', '')
                  .replace('/index', ''),
                path: hookPath,
                type,
              },
            ]
          : []),
        ...(files ?? []),
      ],
    })
    count++
    consola.info(
      `registry: ${type} - ${count.toString().padStart(3, '0')} - ${name}`,
    )
  }
  consola.success(`registry: done ${count} items`)

  const registry = JSON.parse(
    readFileSync(path.join(CWD, '_registry.json'), 'utf-8'),
  )
  registry.items = registryItems

  writeFileSync(
    path.join(CWD, 'registry.json'),
    `${JSON.stringify(registry, null, 2)}\n`,
  )

  // write public/r/registry.json
  const publicRegistryPath = path.join(CWD, 'public/r')
  if (!existsSync(publicRegistryPath)) {
    mkdirSync(publicRegistryPath, { recursive: true })
  }
  writeFileSync(
    path.join(publicRegistryPath, 'registry.json'),
    `${JSON.stringify(registry, null, 2)}\n`,
  )
}

async function main() {
  await Promise.all([generateRegistryItemSchema(), getRegistryItems()])
}

main()
