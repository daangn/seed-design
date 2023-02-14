#!/usr/bin/env node
import findup from "findup-sync";
import kleur from "kleur";
import { Command, Option } from "commander";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import pkg from "../package.json" assert { type: "json" };

import { generateDynamicConfig, generateViteConfig } from "./templates/config";
import { generateDynamicImportComponent } from "./templates/component";
import generateSprite from "./templates/sprite";
import { IconConfig } from "./types";
import { validateIcons } from "./validates/icons";

const ICON_CONFIG_FILE_NAME = "icon.config.yml";

const program = new Command();
const projectPath = path.resolve(
  path.dirname(findup("package.json")!),
  ICON_CONFIG_FILE_NAME,
);
const configPath = findup(ICON_CONFIG_FILE_NAME)!;
const version = pkg.version;

type InitTemplate = "dynamic" | "vite";

const initCommand = new Command("init")
  .description("Initialize icon.config.yml")
  .addOption(
    new Option("-t, --template <template>", "choose template")
      .choices(["dynamic", "vite"])
      .default("dynamic"),
  )
  .action((options) => {
    try {
      console.log("");
      const template = options.template as InitTemplate;

      if (template === "dynamic") {
        const config = generateDynamicConfig();
        fs.writeFileSync(projectPath, config);
        console.log(
          kleur.green().underline(`⭐ ${ICON_CONFIG_FILE_NAME}`) +
            kleur.green(" is created in project root!"),
        );
      }

      if (template === "vite") {
        const config = generateViteConfig();
        fs.writeFileSync(projectPath, config);
        console.log(
          kleur.green().underline(`⭐ ${ICON_CONFIG_FILE_NAME}`) +
            kleur.green(" is created in project root!"),
        );

        console.log(
          kleur.yellow("Please add ") +
            kleur
              .yellow()
              .bold()
              .underline(
                `<link rel="preload" as="image" type="image/svg+xml" href="your sprite href">`,
              ) +
            kleur.yellow(" to your index.html if you want preload sprite.svg"),
        );
      }

      console.log("");
    } catch (e) {
      console.error(e);
    }
  });

const generateCommand = new Command("generate")
  .alias("gen")
  .description("Generate SVG sprite and SeedIcon component")
  .action(() => {
    try {
      console.log("");
      const fileContents = yaml.load(
        fs.readFileSync(configPath, "utf8"),
      ) as IconConfig;

      const icons = fileContents.icons;
      validateIcons(icons);

      const spritePath = fileContents.spritePath || "src/assets/sprite.svg";
      const spriteFileName = path.basename(spritePath, ".svg");
      const spriteDir = path.dirname(spritePath);

      const componentPath =
        fileContents.componentPath || "src/components/SeedIcon.tsx";
      const componentFileName = path.basename(componentPath, ".tsx");
      const componentDir = path.dirname(componentPath);

      const seedIconComponent = generateDynamicImportComponent({
        componentFileName,
        componentDir,
        spriteFileName,
        spriteDir,
        version,
        icons,
      });

      const spriteSvg = generateSprite({ icons });

      const spriteOutputDir = path.resolve(spriteDir);
      const iconComponentOutputDir = path.resolve(componentDir);

      // create directories
      if (!fs.existsSync(spriteOutputDir)) {
        fs.mkdirSync(spriteOutputDir, { recursive: true });
      }

      if (!fs.existsSync(iconComponentOutputDir)) {
        fs.mkdirSync(iconComponentOutputDir, { recursive: true });
      }

      // write files
      fs.writeFileSync(
        path.resolve(spriteDir, `${spriteFileName}.svg`),
        spriteSvg,
      );
      fs.writeFileSync(
        path.resolve(componentDir, `${componentFileName}.tsx`),
        seedIconComponent,
      );

      // log
      console.log(
        kleur.green("⭐ SVG sprite generate complete at ") +
          kleur.green().bold().underline(spritePath),
      );
      console.log(
        kleur.green("⭐ SeedIcon component generate complete at ") +
          kleur.green().bold().underline(`${componentPath}`),
      );
      console.log("");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message) {
          console.error(error.message);
        }
      }
      process.exit(1);
    }
  });

program
  .version(version, "-v, --version")
  .description("Generate SVG sprite and SeedIcon component")
  .addCommand(initCommand)
  .addCommand(generateCommand)
  .parse(process.argv);
