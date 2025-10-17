import { readFileSync } from 'node:fs'
import path from 'node:path'
import consola from 'consola'
import { cloneDeep } from 'es-toolkit'
import { globSync } from 'glob'
import { visit } from 'unist-util-visit'
import type { ImportDeclaration } from 'estree'
import type { Root } from 'mdast'
import type { MdxJsxFlowElement } from 'mdast-util-mdx-jsx'
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm'
import type { Transformer } from 'unified'

function findDemoImportPath(tree: Root, demoName: string) {
  let importPath: string | null = null
  visit(tree, 'mdxjsEsm', (node: MdxjsEsm) => {
    const body = node.data?.estree?.body
    if (!body) return 'skip'

    const importDeclaration = body.find((node): node is ImportDeclaration => {
      if (node.type !== 'ImportDeclaration') return false

      return node.specifiers.some((specifier) => {
        return (
          specifier.type === 'ImportSpecifier' &&
          specifier.imported.type === 'Identifier' &&
          specifier.imported.name === demoName
        )
      })
    })

    if (!importDeclaration) {
      consola.error(`Demo ${demoName} import declaration not found`)
      return 'skip'
    }

    const source = importDeclaration.source.value
    importPath = typeof source === 'string' ? source : null
  })

  return importPath
}

function readDemoFileContent(filePath: string, demoFilePath: string): string {
  try {
    const currentDir = path.dirname(filePath)
    const file = globSync(`${currentDir}/${demoFilePath}.{ts,tsx}`)[0]

    return readFileSync(file, 'utf-8')
  } catch {
    return ''
  }
}

export function remarkDemo(): Transformer<Root, Root> {
  return (tree, file) => {
    visit(tree, 'mdxJsxFlowElement', (node, _index, _parent) => {
      if (!node.name?.startsWith('Demo')) return 'skip'
      if (
        node.attributes.find(
          (attr) => attr.type === 'mdxJsxAttribute' && attr.name === 'done',
        )
      )
        return 'skip'

      const clonedNode = cloneDeep(node)
      clonedNode.attributes.push({
        type: 'mdxJsxAttribute',
        name: 'done',
        value: 'true',
      })

      const demoName = node.name
      const importPath = findDemoImportPath(tree, demoName)
      if (!importPath) {
        consola.error(`Demo ${demoName} not found`)
        return 'skip'
      }

      let demoCode = ''
      if (importPath && file?.path) {
        demoCode = readDemoFileContent(file.path, importPath)
      }
      if (!demoCode) {
        consola.error(`Demo ${demoName} code not found`)
        return 'skip'
      }

      const demoContainerNode: MdxJsxFlowElement = {
        type: 'mdxJsxFlowElement',
        name: 'ContainerWithDemo',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'code',
            value: demoCode,
          },
          {
            type: 'mdxJsxAttribute',
            name: 'name',
            value: demoName,
          },
        ],
        children: [clonedNode],
      }

      Object.assign(node, demoContainerNode)
    })
  }
}
