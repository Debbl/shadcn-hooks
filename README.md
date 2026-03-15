<p align="center">
  <img alt="shadcn-hooks-logo" src="https://github.com/user-attachments/assets/2029994c-260d-4c4f-ac53-35ce089b4d39">
</p>

<h1 align="center">Shadcn Hooks</h1>

<p align="center">
  A comprehensive React Hooks Collection built with Shadcn
</p>

<p align="center">
  <a href="https://shadcn-hooks.com/">📚 Documentation</a>
  •
  <a href="https://github.com/shadcn-ui/ui">Shadcn UI</a>
</p>

## ✨ Features

- **TypeScript First**: All hooks are written in TypeScript with full type safety
- **SSR Compatible**: Hooks work seamlessly with server-side rendering
- **Modern React**: Built for React 19+ with latest patterns and optimizations
- **Zero Dependencies**: Most hooks have minimal or no external dependencies
- **Tree Shakeable**: Import only what you need
- **Well Tested**: Each hook is thoroughly tested and documented
- **Tested**: Each hook is thoroughly tested

## 🚀 Quick Start

### Installation

Each hook can be installed individually using the shadcn CLI:

```bash
npx shadcn@latest add @shadcnhooks/use-counter
```

Or manually copy the source code from the [use-counter](https://shadcn-hooks.com/docs/hooks/use-counter).

## 🤖 Skills

Install [Shadcn Hooks](https://skills.sh/debbl/shadcn-hooks/shadcn-hooks) as a skill:

```bash
npx skills add https://github.com/debbl/shadcn-hooks --skill shadcn-hooks
```

### Usage

```tsx
import { useCounter } from '@/hooks/use-counter'

function Counter() {
  const { count, increment, decrement, reset } = useCounter(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

## 📦 Registry

> components.json

```json
{
  "registries": {
    "@shadcnhooks": "https://shadcn-hooks.com/r/{name}.json"
  }
}
```

## 📚 Documentation

Visit [shadcn-hooks.com](https://shadcn-hooks.com/) for complete documentation, examples, and API references.

## 🤝 Credits

This collection is inspired by and builds upon the excellent work of:

- [ahooks](https://ahooks.js.org/) - Comprehensive React hooks library
- [usehooks-ts](https://usehooks-ts.com/) - TypeScript-first hooks collection
- [vueuse](https://github.com/vueuse/vueuse) - Collection of essential Vue Composition Utilities for Vue 3

## 📄 License

[MIT](LICENSE)
