---
"@seed-design/lynx-react": minor
---

Add recipe/slot-recipe context utilities and refactor ActionButton to use them.

- `createRecipeContext`: single-slot recipe context with `withContext` HOC.
- `createSlotRecipeContext`: multi-slot recipe context with `withRootProvider` / `withProvider` / `withContext` for wrapping React function components, plus `withViewContext` / `withTextContext` factories that emit literal `<view>` / `<text>` JSX for native intrinsic slots (required to pass the Lynx compiler's BackgroundSnapshot static analysis).
- Export `NativeSlotProps` type for compound components extending native slot props.
- Internal `splitMultipleVariantsProps` utility for compound components that host multiple recipes (first consumer: TagGroup in a follow-up PR).
- `ActionButton` refactored internally to compose via `withProvider("view", "root")` + `withContext("text", "text")`. Public API unchanged.
