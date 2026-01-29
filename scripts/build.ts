import { x } from 'tinyexec'

async function main() {
  await x('pnpm', ['run', 'preflight'], {
    nodeOptions: {
      stdio: 'inherit',
    },
  })

  await x('next', ['build'], {
    nodeOptions: {
      stdio: 'inherit',
    },
  })
}

main()
