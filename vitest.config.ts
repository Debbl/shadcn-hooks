import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    include: ['src/registry/**/*.test.ts'],
    globals: true,
    environment: 'jsdom',
  },
})
