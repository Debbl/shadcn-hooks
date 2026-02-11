# useQuery

Data fetching hook from [`@tanstack/react-query`](https://tanstack.com/query). Provides caching, background updates, stale data management, and more.

> **EXTERNAL**: Only use if the project already has `@tanstack/react-query` installed.

## Installation

```bash
npm install @tanstack/react-query
```

Or via shadcn CLI:

```bash
npx shadcn@latest add https://shadcn-hooks.vercel.app/r/use-query.json
```

## Usage

Refer to the [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) for full API details.

```tsx
import { useQuery } from '@tanstack/react-query'

function Component() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then((res) => res.json()),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```
