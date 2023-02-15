# @seed-design/icon

## Install

The `@seed-design/icon` is a command-line tool for generating seed icons.

```bash
npm install --dev @seed-design/icon

# or

yarn add -D @seed-design/icon
```

## How to use

You can create a seed icon with just two commands.

### `init`

The `init` command creates the default folder structure for seed icon creation.
The `icon.config.yml` configuration file is created when you enter that command.

```bash
# npm
npm run seed-icon init

# yarn
yarn seed-icon init
```

### `generate`

The `generate` command generates the files required for the generated `icon.config.yml` configuration file icon.
The files generated are an **icon component** and a **sprite svg file**.

```bash
# npm
npm run seed-icon generate
npm run seed-icon gen

# yarn
yarn seed-icon generate
yarn seed-icon gen
```

### etc

- help
- version

## config options

The `icon.config.yml` configuration file has the following options

| Option          | Description                                                                     | Default                                                               |
| --------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `componentPath` | The path where the icon component will be stored. Relative to the project root. | src/components/SeedIcon.tsx                                           |
| `spritePath`    | The path where the svg file will be saved. Relative to the project root.Image   | src/assets/sprite.svg                                                 |
| `icons`         | Please add the icon names used in the above pygma file.                         | [icon_add_circle_fill, icon_add_circle_regular, icon_add_circle_thin] |

## preload sprite.svg

### Vite

> vite provides an svg loader by default.
> So you don't need to configure anything, just preload `sprite.svg` in `index.html` like below.

```html
<link
  rel="preload"
  as="image"
  type="image/svg+xml"
  href="your-sprite-svg-path"
/>.
```

You can generate a config by typing `vite` with `-t` or `--template` option for `init`.

```bash
# npm
npm run seed-icon init -t vite
npm run seed-icon init --template vite

# yarn
yarn seed-icon init -t vite
yarn seed-icon init --template vite
```

This will create an `icon.config.yml` configuration file for the `vite` project.

Translated with www.DeepL.com/Translator (free version)

### Next.js (Webpack)

> CRA, Next.js does not provide an svg loader by default.

CRA needs to set the svg loader via eject or override.

Next.js needs to set the svg loader in `next.config.js`.

```bash
# npm
npm install --dev file-loader

# or

yarn add -D file-loader
```

And in `next.config.js`, set the svg loader like below.

```js
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(svg)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "sprite-[contenthash].svg", // -> ex) sprite-1a2b3c4d5e6f7g8h9i0j.svg
            outputPath: "static/",
          },
        },
      ],
    });

    return config;
  },
};

module.exports = nextConfig;
```

You can use `file-loader` to save `sprite.svg` to the `static` folder, and then preload it inside the `<Head>` tag on the page where it needs to be preloaded.

```jsx
import Head from "next/head";
import sprite from "@/assets/sprite.svg";

export default function Home() {
  return (
    <>
      <Head>
        <link rel="preload" as="image" type="image/svg+xml" href={sprite} />
        {/**/}
      </Head>
      <main className={styles.main}>{/**/}</main>
    </>
  );
}
```

### CRA (Webpack)

> CRA does not provide an svg loader by default.

CRA requires you to set up the svg loader via eject or override.
After that, you just need to preload `sprite.svg` the same as Next.js.
