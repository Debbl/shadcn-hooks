export const websiteConfig = {
  baseUrl:
    // eslint-disable-next-line n/prefer-global/process
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://shadcn-hooks.vercel.app',
}
