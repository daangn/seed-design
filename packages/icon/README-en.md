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

| Option                | Description                                                                             | Default                                                               |
| --------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `componentOutputPath` | The path where the icon component will be stored. This is relative to the project root. | src                                                                   |
| `componentFileName`   | The name of the icon component.                                                         | SeedIcon                                                              |
| `spriteOutputPath`    | The path where the svg file will be saved. Relative to the project root.Image           | assets                                                                |
| `spriteFileName`      | The name of the svg file.The name of the svg file.                                      | sprite                                                                |
| `icons`               | Please add the names of the icons used in the above Pygma file.                         | [icon_add_circle_fill, icon_add_circle_regular, icon_add_circle_thin] |
