# @seed-design/rsbuild-plugin

## Installation

```sh
yarn add @seed-design/rsbuild-plugin
```

## Usage

```ts
// rsbuild.config.ts
import { seedDesignPlugin } from '@seed-design/rsbuild-plugin';
import { defineConfig, type RsbuildConfig } from '@rsbuild/core';

export default defineConfig((): RsbuildConfig => {
  return {
    // your configs...
    plugins: [
      // ...plugins
      seedDesignPlugin(),
    ],
  };
}
```
