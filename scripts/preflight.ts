import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import consola from 'consola'
import { globSync } from 'glob'
import matter from 'gray-matter'
import { registryItemSchema, registrySchema } from 'shadcn/schema'
import type { Registry, RegistryItem } from 'shadcn/schema'

// eslint-disable-next-line n/prefer-global/process
const CWD = process.cwd()

async function generateRegistryItemSchema() {
  const res = await fetch('https://ui.shadcn.com/schema/registry-item.json')
  const data = (await res.json()) as any

  if (data.properties) {
    delete data.required
  }

  // Ensure font conditional only applies when "type" exists: in JSON Schema,
  // "properties" does not require keys to exist, so missing "type" would
  // incorrectly trigger the "then" (required name/type/font). Add "required":
  // ["type"] to the "if" so items without "type" (e.g. hooks) go to "else".
  const allOf = data.allOf as
    | Array<{ if?: { required?: string[] }; then?: { required?: string[] } }>
    | undefined
  if (Array.isArray(allOf)) {
    const fontRule = allOf.find(
      (r) =>
        r.then?.required?.includes('font') &&
        r.if &&
        !r.if.required?.includes('type'),
    )
    if (fontRule?.if) {
      fontRule.if.required = ['type']
    }
  }

  writeFileSync(
    path.join(CWD, 'schema/registry-item.json'),
    `${JSON.stringify(data, null, 2)}\n`,
  )
}

async function generateRegistry() {
  const getRegistry = async (): Promise<Registry> => {
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
        author: 'Brendan Dash (https://shadcn-hooks.com)',
        description: docsMatter.description ?? rest.description,
        ...rest,
        files: [
          ...(isExist
            ? [
                {
                  path: `registry/${registryType}/${name}${path.extname(
                    hookPath,
                  )}`,
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
    ) as Registry
    registry.items = registryItems

    // validate registry
    return registrySchema.parse(registry)
  }

  const writeRegistry = async (registry: Registry) => {
    writeFileSync(
      path.join(CWD, 'registry.json'),
      `${JSON.stringify(registry, null, 2)}\n`,
    )
    const allRegistry = {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: 'all',
      type: 'registry:file',
      author: 'Brendan Dash (https://shadcn-hooks.com)',
      description: 'All shadcn hooks registry items.',
      registryDependencies: registry.items.map((item) => `@hooks/${item.name}`),
    } satisfies RegistryItem

    const publicRegistryDir = path.join(CWD, 'public/r')
    if (!existsSync(publicRegistryDir)) {
      mkdirSync(publicRegistryDir, { recursive: true })
    }
    // write public/r/all.json
    writeFileSync(
      path.join(publicRegistryDir, 'all.json'),
      `${JSON.stringify(allRegistry, null, 2)}\n`,
    )

    // write public/r/registry.json
    writeFileSync(
      path.join(publicRegistryDir, 'registry.json'),
      `${JSON.stringify(registry, null, 2)}\n`,
    )
  }

  const generateRegistryItem = async (registry: Registry) => {
    for (const item of registry.items) {
      const registryItem = registryItemSchema.parse(item)

      const files =
        registryItem.files?.map((file) => {
          const contentPath = file.path
          let content = ''
          if (existsSync(contentPath)) {
            content = readFileSync(contentPath, 'utf-8')
          } else {
            const ext = path.extname(contentPath)
            const dirname = path.basename(contentPath, ext)
            const indexPath = path.join(
              CWD,
              `src/${path.dirname(contentPath)}/${dirname}/index${ext}`,
            )
            if (existsSync(indexPath)) {
              content = readFileSync(indexPath, 'utf-8')
            } else {
              throw new Error(`File ${indexPath} not found`)
            }
          }

          return {
            ...file,
            content,
          }
        }) ?? []

      writeFileSync(
        path.join(CWD, `public/r/${registryItem.name}.json`),
        `${JSON.stringify(
          registryItemSchema.parse({
            ...registryItem,
            files,
          }),
          null,
          2,
        )}\n`,
      )
    }
  }

  const registry = await getRegistry()

  await Promise.all([writeRegistry(registry), generateRegistryItem(registry)])
}

async function main() {
  await Promise.all([generateRegistryItemSchema(), generateRegistry()])
}

main()
