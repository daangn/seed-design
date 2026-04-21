---
"@seed-design/lynx-css": patch
---

Regenerate Lynx CSS after qvism preset web/Lynx split. `packages/lynx-css` now uses its own `qvism.config.mjs` driven by the dedicated Lynx preset entry (`@seed-design/qvism-preset/lynx`), and no longer depends on the removed `targets` mechanism in `qvism-core`.
