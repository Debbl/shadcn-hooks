# useStickToBottom

Scroll-stick behavior from [`use-stick-to-bottom`](https://github.com/nicejmkim/use-stick-to-bottom). Keeps a scrollable container scrolled to the bottom as new content is added (e.g. chat interfaces, log viewers).

> **EXTERNAL**: Only use if the project already has `use-stick-to-bottom` installed.

## Installation

```bash
npm install use-stick-to-bottom
```

Or via shadcn CLI:

```bash
npx shadcn@latest add https://shadcn-hooks.com/r/use-stick-to-bottom.json
```

## Usage

Refer to the [use-stick-to-bottom documentation](https://github.com/nicejmkim/use-stick-to-bottom) for full API details.

```tsx
import { useStickToBottom } from 'use-stick-to-bottom'

function ChatLog({ messages }: { messages: string[] }) {
  const { scrollRef, contentRef } = useStickToBottom()

  return (
    <div ref={scrollRef} style={{ overflow: 'auto', height: 400 }}>
      <div ref={contentRef}>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
    </div>
  )
}
```
