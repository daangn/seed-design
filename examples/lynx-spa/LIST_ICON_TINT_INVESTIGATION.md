# Lynx List Icon Tint Investigation

## Context

ActionButton `layout="iconOnly"` and Checkbox checked icons render correctly in
the Examples tab, but can render with stale or missing tint in the Table tab.

The key structural difference is:

- Examples render inside regular `view` / `scroll-view` content.
- Table renders all component previews inside `list` / `list-item` in
  `src/components/variant-table.tsx`.

## Current Hypothesis

The issue is likely not ActionButton-specific recipe output. It is more likely
that the shared icon tint bridge is not robust enough under Lynx list item
reuse / hydration timing.

`packages/lynx-react/src/hooks/use-icon-color.ts` currently performs a one-shot
main-thread sync:

1. wait for React effect,
2. call `runOnMainThread`,
3. read computed `color`,
4. mirror it to image `tint-color`.

That works in ordinary view trees, but a Lynx `list-item` may be reused or may
attach its main-thread elements at timing that differs from ordinary visible
content.

## Evidence

- Lynx image docs define `tint-color` as an image attribute whose value is a
  concrete CSS color:
  https://lynxjs.org/api/elements/built-in/image.html
- Lynx list docs describe `recyclable` and `reuse-identifier`; list items are
  reused by default:
  https://lynxjs.org/api/elements/built-in/list.html
- ReactLynx PR 770 notes that ref / effect timing around `list` differs from
  ordinary visible content:
  https://github.com/lynx-family/lynx-stack/pull/770
- ReactLynx PR 1001 and PR 1667 both fixed main-thread ref / hydration timing
  issues:
  https://github.com/lynx-family/lynx-stack/pull/1001
  https://github.com/lynx-family/lynx-stack/pull/1667
- ReactLynx PR 1598 and PR 1900 both adjusted list-item hydration / reuse
  behavior based on `item-key`:
  https://github.com/lynx-family/lynx-stack/pull/1598
  https://github.com/lynx-family/lynx-stack/pull/1900
- `lynx-ui` List guidance requires both React `key` and Lynx `item-key`, and
  says list virtualization and reuse depend on `item-key`:
  https://github.com/lynx-family/lynx-ui/tree/main/packages/lynx-ui-list

## Local Verification Toggle

To isolate whether list recycling is the trigger, temporarily set
`recyclable={false}` on `VariantTable` list items:

```tsx
<list-item key={entry.key} item-key={entry.key} recyclable={false}>
```

If this fixes first-render icon tint in the Table tab, it strongly indicates the
bug is tied to list item recycle / attach timing rather than qvism recipe class
generation.

This is not necessarily the final production fix. It is a diagnostic switch.

Result: this did not fix the ActionButton Table `layout=iconOnly` first-render
black icon. That makes list item recycling itself less likely as the direct
cause, and points more toward one-shot `useEffect` / main-thread ref timing or
computed-style availability inside `list`.

## Direct Color Diagnostic

As a second isolation step, temporarily pass a concrete color to the
ActionButton Table icon:

```tsx
icon={<IconPlusFill color="#FFFFFF" />}
```

If this renders white on first Table entry, then the generated icon component
and native `<image tint-color>` path are working, and the failure is specifically
the CSS color -> main-thread `tint-color` bridge timing.

Result: this rendered white. Therefore the native image tint path and generated
icon component are not the problem. The failing path is the one-shot
`useIconColor` bridge that reads CSS `color` from the image node and mirrors it
to `tint-color`.

Follow-up diagnostic: replace `#FFFFFF` with
`var(--seed-color-palette-static-white)`. If this renders white, native
`tint-color` accepts CSS variables and recipe token strings can be passed
directly. If it renders black, native `tint-color` requires a concrete color and
the bridge/ref timing remains the real problem to solve.

Result: this rendered black. Native Lynx image `tint-color` does not resolve the
CSS variable string in this path. Passing recipe token strings directly to icon
`color` is not a valid general fix; the bridge must provide a concrete color.

## UI Appearance Bridge Diagnostic

The next minimal bridge test is to keep the existing effect-based sync, but also
run the same sync once on `main-thread:binduiappear`.

Why this is narrower than timer-based retry:

- It is tied to Lynx's native visibility lifecycle.
- It does not poll or keep watching.
- It only runs when the icon's UI node appears, which is the moment list-backed
  content should have a native node and computed style available.

This diagnostic has been applied locally in `useIconColor` and the icon slots,
then `bun --filter @seed-design/lynx-react build` was run so `examples/lynx-spa`
uses the updated package `lib` output.

Result: this fixed the ActionButton Table first-render `iconOnly` tint. The
bridge can be finalized as the single `useIconColor` API: existing callers can
keep destructuring `{ ref }`, while icon slots can spread/use the additional
`main-thread:binduiappear` prop when they need visibility-time synchronization.

## Candidate Fix Directions

1. Make `useIconColor` sync when the main-thread ref is assigned, not only from a
   background-thread React effect.
2. If list visibility is the missing lifecycle point, evaluate a small
   `main-thread:binduiappear` sync for icon image nodes.
3. Avoid semantic token maps in `@seed-design/lynx-react`; computed CSS color or
   direct concrete color props should remain the source of truth.
4. Only use `recyclable={false}` in the catalog if the table itself does not
   need virtualization reuse and the problem is catalog-only.
