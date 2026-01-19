// @ts-check
import { serwist } from '@serwist/next/config'

export default serwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'out/sw.js',
  globIgnores: ['public/r/**/*.json'],
})
