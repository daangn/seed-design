---
"@ride-developer/css": minor
"@ride-developer/qvism-preset": minor
"@ride-developer/rootage-artifacts": minor
---

Apply real Ride brand palette values from token-studio.json to rootage.

Replaces Seed-inherited `theme-light` values in `packages/rootage/color.yaml`
for the following palettes with the authentic Ride values sourced from
`tokens/token-studio.json`:

- `gray`: 10 slots updated (100..1000). New gray is cooler and flatter.
  E.g., `gray-1000: #121414` (was `#1a1c20`).
- `blue`: 9 slots updated (100..900). Synced with `carrot` (which already
  held Ride blue) so the two palettes now share identical Ride blue values.
  `carrot` remains the brand source; `blue` mirrors it for compatibility.
- `red`: 9 slots updated (100..900). New red is muted (e.g. `red-600: #d64c4c`
  was `#fc6a66`).
- `yellow`: 9 slots updated (100..900). New yellow is saturated
  (`yellow-600: #ffcc00` was `#c49725`).
- `green`: 9 slots updated (100..900). New green is vibrant
  (`green-600: #15bd66` was `#10ab7d`).

Preserved (not changed):
- `theme-dark` values across all palettes (token-studio has no dark values).
- `*-1000` slots for blue/red/yellow/green (token-studio has no 1000 shade
  for these). They keep their previous Seed-derived theme-light values.
- `gray-00` (#ffffff), alpha palettes (static-black-alpha-*, static-white-alpha-*),
  purple, carrot, oxford (none are in token-studio).
- Rootage structure: slot names, reference syntax, component specs, alpha
  tokens, gradients, shadows, font-size clamp system.

Regenerated `packages/css/vars/**`, `packages/css/recipes/**`, and
`packages/qvism-preset/src/vars/**` via `bun generate:all`. All 589 tests
pass (`bun test:all`).

Semantic tokens automatically pick up new values via palette references
(e.g. `fg-neutral → palette.gray-1000 → #121414`). Visual change is
expected in components that use any of the updated palettes.
