# AGENTS.md

## Code style and conventions

- TypeScript strict; avoid `any` (use precise types). Comments in English. Keep solutions simple and maintainable.

## Team preferences

- Prefer simple, easy-to-maintain solutions.
- Avoid using the `any` type in TypeScript.
- Write code comments in English.

## Context7 (up-to-date docs)

- Use Context7 to fetch current library docs before using APIs prone to change.
- Workflow:
  1. Resolve a library ID: resolve the library (e.g., React Native, Vite, TanStack Query).
  2. Fetch docs scoped to the topic (e.g., hooks, routing).
  3. Integrate code examples following our style rules.

## Sequential Thinking (step-by-step problem solving)

- Break work into small thought steps:
  1. Define immediate goal/assumption.
  2. Use suitable tool (search, code edit, error explainer, docs).
  3. Record the output/results.
  4. Decide next step or branch alternatives; compare trade-offs.
- Encourage rollback/iteration if new information contradicts prior steps.

## Quick checklists

- Implementation
  - [ ] Type-safe (no `any`), readable names, English comments where needed.
