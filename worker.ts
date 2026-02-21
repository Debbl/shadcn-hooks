export default {
  async fetch(request: Request, env: Env) {
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
