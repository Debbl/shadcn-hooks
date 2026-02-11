# useMcp

Model Context Protocol (MCP) client hook from the [`use-mcp`](https://github.com/modelcontextprotocol/use-mcp) package.

> **EXTERNAL**: Only use if the project already has `use-mcp` installed.

## Installation

```bash
npm install use-mcp
```

Or via shadcn CLI:

```bash
npx shadcn@latest add https://shadcn-hooks.vercel.app/r/use-mcp.json
```

## Usage

Refer to the [use-mcp documentation](https://github.com/modelcontextprotocol/use-mcp) for full API details and usage examples.

```tsx
import { useMcp } from 'use-mcp'

function Component() {
  const mcp = useMcp({
    url: 'https://example.com/mcp',
  })

  return <div>...</div>
}
```
