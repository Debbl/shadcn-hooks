import { x } from 'tinyexec'

async function main() {
  // Fumadocs lastModified needs the complete history, including on hosted builds.
  const shallow = await x('git', ['rev-parse', '--is-shallow-repository'], {
    throwOnError: true,
  })
  if (shallow.stdout.trim() === 'true') {
    await x('git', ['fetch', '--unshallow'], {
      throwOnError: true,
      nodeOptions: { stdio: 'inherit' },
    })
  }

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
