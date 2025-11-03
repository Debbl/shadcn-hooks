import { defineConfig } from 'tsdown'

export default defineConfig({
  sourcemap: true,
  dts: { sourcemap: true },
  exports: true,
})
