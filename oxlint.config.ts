import { oxlint } from '@debbl/oxc-config'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [oxlint({ react: true, next: true, a11y: true })],
  // Provided by next-auto-import during compilation.
  globals: { motion: 'readonly', Fragment: 'readonly' },
  rules: {
    'jsx-a11y/label-has-associated-control': [
      'error',
      { controlComponents: ['Input', 'Textarea', 'Select'] },
    ],
  },
  ignorePatterns: [
    '.agents/**',
    '**/README.md',
    'content/**',
    'skills/**',
    'src/components/ui/**',
    'auto-imports.d.ts',
    'worker-configuration.d.ts',
    'next-env.d.ts',
  ],
  overrides: [
    {
      // These hooks implement ref caches and accept caller-owned dependencies.
      // Keep compiler diagnostics visible without changing their public behavior.
      files: ['src/registry/hooks/*/index.ts', 'src/hooks/*.ts'],
      rules: {
        'react/refs': 'warn',
        'react/exhaustive-deps': 'warn',
        'react/set-state-in-effect': 'warn',
      },
    },
    {
      // Existing animation primitives need a separate React Compiler review.
      files: ['src/components/animate-ui/primitives/**/*.tsx'],
      rules: {
        'react/set-state-in-effect': 'warn',
        'react/preserve-manual-memoization': 'warn',
      },
    },
    {
      // Vitest infers implementations; unimplemented spies observe calls only.
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: { 'vitest/require-mock-type-parameters': 'off' },
    },
    {
      // This ponyfill probes React.use and tests event calls outside rendering.
      files: ['src/registry/hooks/use-effect-event/index{,.test}.ts'],
      rules: { 'react/rules-of-hooks': 'off' },
    },
  ],
})
