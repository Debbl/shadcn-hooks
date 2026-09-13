import { oxfmt } from '@debbl/oxc-config'

export default oxfmt({
  tailwind: './src/app/globals.css',
  ignorePatterns: [
    '.agents/**',
    '**/README.md',
    'content/**',
    'skills/**',
    'src/components/ui/**',
    'pnpm-lock.yaml',
  ],
})
