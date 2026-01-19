// @ts-check
import { serwist } from '@serwist/next/config'

export default serwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'out/sw.js',
  globIgnores: ['.next/server/app/_global-error.html', 'public/r/**/*.json'],
})
