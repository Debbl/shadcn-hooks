import { oxlint } from '@debbl/oxc-config'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [oxlint({ react: true })],
  overrides: [
    {
      // Match the registry sources: preserve custom ref and dependency behavior.
      files: ['src/hooks/*.ts'],
      rules: {
        'react/refs': 'warn',
        'react/exhaustive-deps': 'warn',
        'react/set-state-in-effect': 'warn',
      },
    },
    {
      // The ponyfill deliberately probes React.use inside a try/catch.
      files: ['src/hooks/use-effect-event.ts'],
      rules: { 'react/rules-of-hooks': 'off' },
    },
  ],
})
