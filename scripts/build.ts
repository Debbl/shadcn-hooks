import { x } from 'tinyexec'

async function main() {
  await x('pnpm', ['run', 'preflight'], {
    throwOnError: true,
    nodeOptions: {
      stdio: 'inherit',
    },
  })

  await x('next', ['build'], {
    throwOnError: true,
    nodeOptions: {
      stdio: 'inherit',
    },
  })
}

await main()
