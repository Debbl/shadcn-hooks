import { rm } from 'node:fs'
import path from 'node:path'
import { x } from 'tinyexec'

async function main() {
  rm(
    // eslint-disable-next-line n/prefer-global/process
    path.join(process.cwd(), 'src/app/docs/[[...slug]]/opengraph-image.tsx'),
    async () => {
      await x('next', ['dev', '--webpack'], {
        nodeOptions: {
          stdio: 'inherit',
        },
      })
    },
  )
}

main()
