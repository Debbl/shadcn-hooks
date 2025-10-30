/* eslint-disable n/prefer-global/process */
import { cp } from 'node:fs'
import path from 'node:path'
import { x } from 'tinyexec'

async function main() {
  cp(
    path.join(process.cwd(), 'src/app/docs/[[...slug]]/_opengraph-image.tsx'),
    path.join(process.cwd(), 'src/app/docs/[[...slug]]/opengraph-image.tsx'),
    async () => {
      await x('pnpm', ['run', 'preflight'], {
        nodeOptions: {
          stdio: 'inherit',
        },
      })
      await x('pnpm', ['run', 'registry:build'], {
        nodeOptions: {
          stdio: 'inherit',
        },
      })

      await x('next', ['build', '--webpack'], {
        nodeOptions: {
          stdio: 'inherit',
        },
      })
    },
  )
}

main()
