# @seed-design/lynx-qvism-preset

This package is a Lynx preset for [@seed-design/ecosystem/qvism](../../ecosystem/qvism).

Following libraries are generated from this preset.

- [@seed-design/lynx-css/*.css](../lynx-css)
- [@seed-design/lynx-css/recipes](../lynx-css/recipes)

## Architecture boundary

`ecosystem/qvism` stays framework-neutral. Lynx-only recipe shape, theme selectors,
supported CSS policy, and fallback values belong in this preset source rather than
qvism core or a PostCSS compatibility pass.

Use `defineRecipe`, `defineSlotRecipe`, `defineGlobalCss`, and `defineKeyframes`
from `src/utils/define.ts` when adding Lynx CSS. These helpers intentionally reject
CSS that SEED does not want to emit for Lynx, even if the upstream Lynx type package
contains a broader web-like property.

qvism core remains target-neutral and only exposes a final CSS post-transform hook.
This preset uses that hook for Lynx compatibility fixes that can appear after
Lightning CSS optimization, such as expanding `inset` shorthand back to physical
`top` / `right` / `bottom` / `left` longhands.

## Authoring rules

- Model root/text/compound parts explicitly with `defineSlotRecipe`.
- Do not rely on `initial`, `inherit`, or `unset`; write explicit fallback values.
- Do not write `inset` or `inset-*` shorthand in source; use physical longhands
  when a full-position fill is needed.
- Avoid web-only CSS such as `boxSizing`, `verticalAlign`, SVG stroke/fill CSS,
  generated `content`, and attribute selector based theme/platform switching.
- Use Lynx class selectors such as `.seed-color-mode-dark-only` and
  `.seed-platform-ios` for platform-specific branches.
- Font-size and line-height tokens are emitted as `sp` in `src/seed-css.ts`; static
  token variants remain px based.
