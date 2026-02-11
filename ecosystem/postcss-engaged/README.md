# @seed-design/postcss-engaged

A PostCSS plugin that expands the custom `:--engaged` pseudo-class into device-adaptive interaction styles.

## What it does

```css
/* Input */
.btn:--engaged { background: red; }

/* Output */
@media (hover: hover) { .btn:hover { background: red; } }
@media (hover: none) { .btn:is(:active, [data-active]) { background: red; } }
```

- **Desktop** (`@media (hover: hover)`): uses `:hover`
- **Touch** (`@media (hover: none)`): uses `:is(:active, [data-active])`

## Install

```bash
bun add @seed-design/postcss-engaged
```

## Usage

```js
import postcssEngaged from "@seed-design/postcss-engaged";

// PostCSS config
export default {
  plugins: [postcssEngaged()],
};
```

## Options

### `selector`

Custom pseudo-class selector to match. Defaults to `":--engaged"`.

```js
postcssEngaged({ selector: ":--interact" });
```
