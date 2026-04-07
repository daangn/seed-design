# Migration Guide: `@seed-design/*` → `@ride-developer/*`

> **Audience:** Consumer apps that previously imported `@seed-design/css`, `@seed-design/react`, or any related packages from this fork.
>
> **Effective version:** `@ride-developer/*@2.0.0` (published from this monorepo). All `@seed-design/*` package paths from this fork are removed and will no longer receive updates.

---

## Why this migration

`ride-design-system` is a fork of `daangn/seed-design`. Previously the fork only renamed two packages (`@ride-developer/css`, `@ride-developer/react`) while the rest of the workspace still used the `@seed-design/*` scope. That left consumer apps in an awkward middle state where they had to depend on a custom `seed-bridge.ts` adapter file with hardcoded RGBA values to overwrite Seed CSS variables with Ride brand colors. The Dialog dim handling was the most visible casualty — alpha tokens did not flow end-to-end.

This release completes the rename:

1. **All 47+ packages** in this monorepo are now scoped under `@ride-developer/*`
2. **CSS variable prefix** is now `--ride-*` (was `--seed-*`)
3. **Data attributes** are now `data-ride-*` (was `data-seed-*`)
4. **CSS class prefix** is now `ride-*` (was `seed-*`)
5. **CSS layer names** are now `@layer ride-base, ride-components` (was `seed-base, seed-components`)
6. **Alpha tokens** (`overlay`, `overlay-muted`, `static-black-alpha-*`, `static-white-alpha-*`) are now natively published — `seed-bridge.ts` is obsolete and should be deleted

This is a hard breaking change. There is no fallback path. Pin to `@seed-design/*@1.x.x` if you cannot migrate yet.

---

## Package name mapping

All 44 publishable packages are renamed. The new versions all start at `2.0.0`.

| Old (`@seed-design/*`) | New (`@ride-developer/*`) | Category |
|---|---|---|
| `@seed-design/css` | `@ride-developer/css` | core |
| `@seed-design/react` | `@ride-developer/react` | core |
| `@seed-design/dom-utils` | `@ride-developer/dom-utils` | utils |
| `@seed-design/react-avatar` | `@ride-developer/react-avatar` | headless |
| `@seed-design/react-checkbox` | `@ride-developer/react-checkbox` | headless |
| `@seed-design/react-collapsible` | `@ride-developer/react-collapsible` | headless |
| `@seed-design/react-dialog` | `@ride-developer/react-dialog` | headless |
| `@seed-design/react-drawer` | `@ride-developer/react-drawer` | headless |
| `@seed-design/react-field` | `@ride-developer/react-field` | headless |
| `@seed-design/react-field-button` | `@ride-developer/react-field-button` | headless |
| `@seed-design/react-fieldset` | `@ride-developer/react-fieldset` | headless |
| `@seed-design/react-image` | `@ride-developer/react-image` | headless |
| `@seed-design/react-popover` | `@ride-developer/react-popover` | headless |
| `@seed-design/react-portal` | `@ride-developer/react-portal` | headless |
| `@seed-design/react-primitive` | `@ride-developer/react-primitive` | headless |
| `@seed-design/react-progress` | `@ride-developer/react-progress` | headless |
| `@seed-design/react-pull-to-refresh` | `@ride-developer/react-pull-to-refresh` | headless |
| `@seed-design/react-radio-group` | `@ride-developer/react-radio-group` | headless |
| `@seed-design/react-scrollable` | `@ride-developer/react-scrollable` | headless |
| `@seed-design/react-segmented-control` | `@ride-developer/react-segmented-control` | headless |
| `@seed-design/react-slider` | `@ride-developer/react-slider` | headless |
| `@seed-design/react-snackbar` | `@ride-developer/react-snackbar` | headless |
| `@seed-design/react-supports` | `@ride-developer/react-supports` | headless |
| `@seed-design/react-switch` | `@ride-developer/react-switch` | headless |
| `@seed-design/react-tabs` | `@ride-developer/react-tabs` | headless |
| `@seed-design/react-text-field` | `@ride-developer/react-text-field` | headless |
| `@seed-design/react-toggle` | `@ride-developer/react-toggle` | headless |
| `@seed-design/react-use-controllable-state` | `@ride-developer/react-use-controllable-state` | headless |
| `@seed-design/cli` | `@ride-developer/cli` | tooling |
| `@seed-design/codemod` | `@ride-developer/codemod` | tooling |
| `@seed-design/design-token` | `@ride-developer/design-token` | tooling |
| `@seed-design/docs-mcp` | `@ride-developer/docs-mcp` | tooling |
| `@seed-design/figma` | `@ride-developer/figma` | tooling |
| `@seed-design/figma-extractor` | `@ride-developer/figma-extractor` | tooling |
| `@seed-design/mcp` | `@ride-developer/mcp` | tooling |
| `@seed-design/migration-index` | `@ride-developer/migration-index` | tooling |
| `@seed-design/rootage-artifacts` | `@ride-developer/rootage-artifacts` | tooling |
| `@seed-design/rsbuild-plugin` | `@ride-developer/rsbuild-plugin` | plugins |
| `@seed-design/stackflow` | `@ride-developer/stackflow` | plugins |
| `@seed-design/stylesheet` | `@ride-developer/stylesheet` | plugins |
| `@seed-design/tailwind3-plugin` | `@ride-developer/tailwind3-plugin` | plugins |
| `@seed-design/tailwind4-theme` | `@ride-developer/tailwind4-theme` | plugins |
| `@seed-design/vite-plugin` | `@ride-developer/vite-plugin` | plugins |
| `@seed-design/webpack-plugin` | `@ride-developer/webpack-plugin` | plugins |

### Packages **not** renamed (intentional)

These remain under `@seed-design/*` because they are external Karrot packages, not part of this fork:

- `@seed-design/react-icon` — Karrot's icon library (we depend on it as an external)

---

## CSS variables: `--seed-*` → `--ride-*`

Every CSS variable that previously started with `--seed-` is now `--ride-`. This affects ~25,000+ token references across recipes, vars, generated CSS, and any places consumer apps might have referenced them directly.

### Examples

```diff
- background: var(--seed-color-bg-overlay);
+ background: var(--ride-color-bg-overlay);

- color: var(--seed-color-fg-brand-solid);
+ color: var(--ride-color-fg-brand-solid);

- font-size: var(--seed-font-size-t5);
+ font-size: var(--ride-font-size-t5);

- padding: var(--seed-dimension-x4);
+ padding: var(--ride-dimension-x4);
```

### How to find them

```bash
rg -- "--seed-" src/
```

### How to fix them (sed)

```bash
find src \( -name "*.css" -o -name "*.scss" -o -name "*.tsx" -o -name "*.ts" \) \
  -exec sed -i '' 's/--seed-/--ride-/g' {} +
```

---

## Data attributes: `data-seed-*` → `data-ride-*`

The dataset attributes used for theme switching, color mode, font scaling, and platform detection are renamed.

### HTML attribute renames

| Old | New |
|---|---|
| `data-seed` | `data-ride` |
| `data-seed-color-mode` | `data-ride-color-mode` |
| `data-seed-platform` | `data-ride-platform` |
| `data-seed-user-color-scheme` | `data-ride-user-color-scheme` |
| `data-seed-font-scaling` | `data-ride-font-scaling` |
| `data-seed-font-multiplier` | `data-ride-font-multiplier` |

### JavaScript dataset access (camelCase!)

When you read these attributes from JS, they show up as camelCase properties on `element.dataset`:

```diff
- document.documentElement.dataset.seedColorMode = "dark-only";
+ document.documentElement.dataset.rideColorMode = "dark-only";

- const platform = document.documentElement.dataset.seedPlatform;
+ const platform = document.documentElement.dataset.ridePlatform;

- if (el.dataset.seedFontScaling === "1.5") { ... }
+ if (el.dataset.rideFontScaling === "1.5") { ... }
```

**This is the most common silent-failure point.** If even one `dataset.seed*` reference is missed, color mode toggling and font scaling will quietly stop working with no error. Run a JS-side grep before deploying.

### How to find them

```bash
# HTML attributes
rg "data-seed" src/

# JS dataset access
rg "dataset\.seed" src/
```

### How to fix them (sed)

```bash
# HTML/JSX attributes (with trailing dash for the multi-word ones)
find src \( -name "*.tsx" -o -name "*.ts" -o -name "*.html" -o -name "*.css" \) \
  -exec sed -i '' \
    -e 's/data-seed-/data-ride-/g' \
    -e 's/data-seed/data-ride/g' {} +

# JS dataset access (camelCase)
find src \( -name "*.ts" -o -name "*.tsx" \) \
  -exec sed -i '' \
    -e 's/dataset\.seedColorMode/dataset.rideColorMode/g' \
    -e 's/dataset\.seedPlatform/dataset.ridePlatform/g' \
    -e 's/dataset\.seedUserColorScheme/dataset.rideUserColorScheme/g' \
    -e 's/dataset\.seedFontScaling/dataset.rideFontScaling/g' \
    -e 's/dataset\.seedFontMultiplier/dataset.rideFontMultiplier/g' {} +
```

---

## CSS classes: `seed-*` → `ride-*`

The following utility class names are renamed:

| Old | New |
|---|---|
| `seed-icon` | `ride-icon` |
| `seed-prefix-icon` | `ride-prefix-icon` |
| `seed-suffix-icon` | `ride-suffix-icon` |
| `seed-loading-indicator` | `ride-loading-indicator` |
| `seed-count` | `ride-count` |
| `seed-box` | `ride-box` |
| `seed-grid` | `ride-grid` |
| `seed-consistent-width` | `ride-consistent-width` |

### How to fix them (sed)

```bash
find src \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) \
  -exec sed -i '' \
    -e 's/seed-icon\b/ride-icon/g' \
    -e 's/seed-prefix-icon\b/ride-prefix-icon/g' \
    -e 's/seed-suffix-icon\b/ride-suffix-icon/g' \
    -e 's/seed-loading-indicator\b/ride-loading-indicator/g' \
    -e 's/seed-count\b/ride-count/g' \
    -e 's/seed-box\b/ride-box/g' \
    -e 's/seed-grid\b/ride-grid/g' \
    -e 's/seed-consistent-width\b/ride-consistent-width/g' {} +
```

---

## CSS layers: `@layer seed-* → @layer ride-*`

If your consumer CSS imports the layered variants (`base.layered.css`, `all.layered.css`) and declares its own `@layer` order, you must update the layer names:

```diff
- @layer seed-base, seed-components, app;
+ @layer ride-base, ride-components, app;
```

---

## Bridge removal: delete `seed-bridge.ts`

Many consumer apps had a file like `src/lib/seed-bridge.ts` (also seen as `ride-bridge.ts`). It contained ~300 lines of dynamic CSS that:

1. Mapped Seed palette names (carrot, blue, gray, ...) to Ride palette names
2. Mapped Seed semantic tokens to Ride semantic tokens
3. Hardcoded RGBA values like `#00000074` for alpha overlays because Ride didn't have alpha tokens

**This file is now obsolete and must be deleted.**

### What replaces it

`@ride-developer/css@2.0.0` natively publishes the alpha tokens that were missing:

| Token | CSS variable | Use case |
|---|---|---|
| `bg.overlay` | `--ride-color-bg-overlay` | Standard dialog backdrop dim |
| `bg.overlay-muted` | `--ride-color-bg-overlay-muted` | Light dim variant |
| `palette.static-black-alpha-100..1000` | `--ride-color-palette-static-black-alpha-{100..1000}` | Reusable alpha overlays |
| `palette.static-white-alpha-50..1000` | `--ride-color-palette-static-white-alpha-{50..1000}` | Light overlays for dark mode |

These flow through the rootage pipeline and are referenced directly by the Dialog, BottomSheet, and ActionSheet recipes. Importing `@ride-developer/css/recipes/dialog.css` is enough — no bridge required.

### Removal steps

```bash
# 1. Find every reference to the bridge
rg "seed-bridge|ride-bridge" src/

# 2. Delete the file
rm src/lib/seed-bridge.ts  # or src/lib/ride-bridge.ts
rm src/lib/seed-bridge.css # if you also generated CSS

# 3. Remove imports/injections — examples:
#    import "./lib/seed-bridge"
#    import { generateSeedBridgeCSS } from "./lib/seed-bridge"
#    <style dangerouslySetInnerHTML={{ __html: generateSeedBridgeCSS() }} />

# 4. Find and replace any hardcoded RGBA fallbacks
rg "#00000074|#0000004c|#000000a2|rgba\(0,\s*0,\s*0,\s*0\.4" src/
# Replace with var(--ride-color-bg-overlay) or similar
```

---

## Step-by-step migration procedure

### 1. Backup and branch

```bash
cd <consumer-app>
git checkout -b backup/before-ride-migration
git checkout -b chore/migrate-to-ride-design-system
```

### 2. Update `.npmrc` for GitHub Packages

```ini
@ride-developer:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

You will need a GitHub PAT with `read:packages` scope.

### 3. Update `package.json` dependencies

Remove all `@seed-design/*` (except the external `@seed-design/react-icon` if you use it) and add the new ones:

```bash
bun remove $(jq -r '.dependencies | keys[]' package.json | grep '^@seed-design/' | grep -v '^@seed-design/react-icon$')
bun add @ride-developer/css@^2.0.0 @ride-developer/react@^2.0.0
# Add others as needed: @ride-developer/stackflow, @ride-developer/vite-plugin, etc.
```

### 4. Apply the sed automation

Run the four sed blocks above (CSS variables, data attributes, class names, JS dataset access) in order. Then run them again on `node_modules`-free directories to be sure:

```bash
# Quick combined script
find src \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.html" \) \
  -exec sed -i '' \
    -e 's|@seed-design/|@ride-developer/|g' \
    -e 's/--seed-/--ride-/g' \
    -e 's/data-seed-/data-ride-/g' \
    -e 's/data-seed/data-ride/g' \
    -e 's/dataset\.seedColorMode/dataset.rideColorMode/g' \
    -e 's/dataset\.seedPlatform/dataset.ridePlatform/g' \
    -e 's/dataset\.seedUserColorScheme/dataset.rideUserColorScheme/g' \
    -e 's/dataset\.seedFontScaling/dataset.rideFontScaling/g' \
    -e 's/dataset\.seedFontMultiplier/dataset.rideFontMultiplier/g' \
    -e 's/seed-icon\b/ride-icon/g' \
    -e 's/seed-prefix-icon\b/ride-prefix-icon/g' \
    -e 's/seed-suffix-icon\b/ride-suffix-icon/g' \
    -e 's/seed-loading-indicator\b/ride-loading-indicator/g' \
    -e 's/seed-count\b/ride-count/g' \
    -e 's/seed-box\b/ride-box/g' \
    -e 's/seed-grid\b/ride-grid/g' \
    -e 's/seed-consistent-width\b/ride-consistent-width/g' {} +
```

After this, restore any external Karrot package references that the sed accidentally renamed:

```bash
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) \
  -exec sed -i '' 's|@ride-developer/react-icon|@seed-design/react-icon|g' {} +
```

### 5. Delete the bridge file

```bash
rm src/lib/seed-bridge.ts src/lib/ride-bridge.ts 2>/dev/null
# Find and remove imports
rg -l "seed-bridge|ride-bridge" src/ | xargs sed -i '' '/seed-bridge\|ride-bridge/d'
```

### 6. Reinstall and validate

```bash
bun install
bun tsc --noEmit
bun build
```

### 7. Visual smoke test

Run the dev server and verify:
- Dialog backdrop dims correctly (gray, ~45% opacity)
- BottomSheet, MenuSheet overlays look right
- Light/dark mode toggle works
- Brand color (Ride blue) shows in primary buttons
- Font scaling (iOS/Android) responds correctly

---

## Verification checklist

Run each grep and confirm zero results:

- [ ] `rg "@seed-design/" src/ | grep -v "@seed-design/react-icon"` → 0
- [ ] `rg -- "--seed-" src/` → 0
- [ ] `rg "data-seed" src/` → 0
- [ ] `rg "dataset\.seed" src/` → 0
- [ ] `rg "seed-(icon|prefix-icon|suffix-icon|loading-indicator|count|box|grid|consistent-width)" src/` → 0
- [ ] `rg "seed-bridge|ride-bridge" src/` → 0
- [ ] `rg "#00000074|#0000004c|#000000a2" src/` → 0 (or replaced with `var(--ride-color-*)`)
- [ ] `bun tsc --noEmit` passes
- [ ] `bun build` passes
- [ ] Dialog overlay renders correctly in dev/prod build

---

## Known issues / pitfalls

### `dataset.seed*` camelCase mismatch

This is the #1 silent failure. The attribute is `data-ride-color-mode`, but in JS you read it as `dataset.rideColorMode`. If you have one `dataset.seedColorMode` left, color mode toggling stops working with no error in the console.

**Mitigation:** `rg "dataset\.seed" src/` must return zero results before deploying.

### Tailwind plugin / theme

If you depend on `@ride-developer/tailwind3-plugin` or `@ride-developer/tailwind4-theme`, the `prefix` option in `tailwind.config.js` may also need updating depending on how it interacts with the Ride prefix.

### Stackflow integration

`@ride-developer/stackflow@2.0.0` peerDependencies are now `@ride-developer/css` and `@ride-developer/react`. If you pin specific Stackflow plugin versions, double-check compatibility.

### CSS layer order

If you used `@layer seed-base, seed-components, app;` in your global CSS, replace with `@layer ride-base, ride-components, app;`. Failure to do so causes specificity issues where your app styles get clobbered by component recipes.

### codemod tool (advanced)

The internal `@ride-developer/codemod` package still contains transforms that match `--seed-*` patterns as INPUT — that is intentional. Those transforms are designed to upgrade legacy `--seed-*` code to the latest patterns within the seed naming. They are not the right tool for this rename. Use the sed scripts above instead.

---

## Rollback procedure

If something goes wrong and you need to revert:

```bash
git checkout backup/before-ride-migration
bun install
bun build  # confirm it works
```

You can stay on the old `@seed-design/*@1.x.x` line indefinitely while debugging, but be aware that no further updates will land in those packages from this fork.

---

## Questions?

Ask in the team chat, or refer to the rename plan at `/Users/stormy/.claude/plans/piped-bubbling-moler.md` for the original phase-by-phase implementation notes.
