// @ts-check
import { defineConfig } from '@debbl/eslint-config'

export default defineConfig(
  {
    ignores: {
      files: ['content/**/*'],
    },
    typescript: true,
    react: {
      next: true,
      compiler: true,
    },
    tailwindcss: 'prettier',
  },
  {
    files: ['registry/**/*.ts', 'registry/**/*.tsx'],
    rules: {
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    },
  },
)
