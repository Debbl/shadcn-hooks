# useSWR

Data fetching hook from [`swr`](https://swr.vercel.app/). Provides stale-while-revalidate caching strategy for React applications.

> **EXTERNAL**: Only use if the project already has `swr` installed.

## Installation

```bash
npm install swr
```

Or via shadcn CLI:

```bash
npx shadcn@latest add https://shadcn-hooks.com/r/use-swr.json
```

## Usage

Refer to the [SWR documentation](https://swr.vercel.app/docs/getting-started) for full API details.

```tsx
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

function Component() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error</div>

  return <div>Hello, {data.name}</div>
}
```
