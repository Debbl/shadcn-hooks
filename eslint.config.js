// @ts-check
import { defineConfig } from '@debbl/eslint-config'

export default defineConfig(
  {
    ignores: {
      files: ['content/**/*'],
    },
    typescript: {
      overrides: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['motion/*'],
                message: "Please use the import from '~/lib/motion' instead.",
              },
            ],
          },
        ],
      },
    },
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
