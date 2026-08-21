# @seed-design/rsbuild-plugin-lynx-icon

Rsbuild plugin that converts Lynx icon SVG assets into WebP data-URL modules.

Lynx 3.5 does not support SVG natively. This plugin uses [sharp](https://sharp.pixelplumbing.com/) to resize and convert `.svg` files from Lynx icon packages into base64-encoded WebP data URLs at build time.

## Installation

```bash
bun add -D @seed-design/rsbuild-plugin-lynx-icon
```

## Usage

```ts
// rsbuild.config.ts
import { pluginLynxIcon } from "@seed-design/rsbuild-plugin-lynx-icon";

export default defineConfig({
  plugins: [
    pluginLynxIcon({
      include:
        /node_modules\/@karrotmarket\/assets-(monochrome|multicolor)\/svg\//,
    }),
  ],
});
```

### Options

| Option    | Type     | Default  | Description                      |
| --------- | -------- | -------- | -------------------------------- |
| `include` | `RegExp` | required | Regex to match Lynx icon SVG files |
| `maxSize` | `number` | `72`     | Maximum output width in pixels   |
| `quality` | `number` | `90`     | WebP encoding quality (0–100)    |
