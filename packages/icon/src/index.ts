#!/usr/bin/env node
import findup from "findup-sync";
import kleur from "kleur";
import { Command } from "commander";
import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import pkg from "../package.json" assert { type: "json" };

import generateConfig from "./templates/config";
import generateComponent from "./templates/component";
import generateSprite from "./templates/sprite";
import { IconConfig } from "./types";
import { validateIcons } from "./validates/icons";

const program = new Command();
const projectPath = path.resolve(
  path.dirname(findup("package.json")!),
  "icon.config.yml",
);
const configPath = findup("icon.config.yml")!;
const version = pkg.version;

const initCommand = new Command("init")
  .alias("-i")
  .description("Initialize icon.config.yml")
  .action(() => {
    try {
      const config = generateConfig();
      fs.writeFileSync(projectPath, config);
      console.log(kleur.green().underline("icon.config.yml generated!"));
    } catch (e) {
      console.error(e);
    }
  });

const generateCommand = new Command("generate")
  .alias("gen")
  .description("Generate SVG sprite and SeedIcon component")
  .action(() => {
    try {
      const fileContents = yaml.load(
        fs.readFileSync(configPath, "utf8"),
      ) as IconConfig;

      const icons = fileContents.icons;

      const spritePath = fileContents.spritePath || "src/assets/sprite.svg";
      const spriteFileName = path.basename(spritePath, ".svg");
      const spriteDir = path.dirname(spritePath);

      const componentPath =
        fileContents.componentPath || "src/components/SeedIcon.tsx";
      const componentFileName = path.basename(componentPath, ".tsx");
      const componentDir = path.dirname(componentPath);

      validateIcons(icons);

      const seedIconComponent = generateComponent({
        componentFileName,
        componentOutputPath: componentDir,
        spriteFileName,
        spriteOutputPath: spriteDir,
        version,
        icons,
      });
      const spriteSvg = generateSprite({ icons });

      const spriteOutputDir = path.resolve(spriteDir);
      const iconComponentOutputDir = path.resolve(componentDir);

      if (!fs.existsSync(spriteOutputDir)) {
        fs.mkdirSync(spriteOutputDir, { recursive: true });
      }

      if (!fs.existsSync(iconComponentOutputDir)) {
        fs.mkdirSync(iconComponentOutputDir, { recursive: true });
      }

      fs.writeFileSync(
        path.resolve(spriteDir, `${spriteFileName}.svg`),
        spriteSvg,
      );
      fs.writeFileSync(
        path.resolve(componentDir, `${componentFileName}.tsx`),
        seedIconComponent,
      );

      console.log(
        kleur
          .green()
          .underline(`SVG sprite generate complete at ${spritePath}!`),
      );
      console.log(
        kleur
          .green()
          .underline(
            `SeedIcon component generate complete at ${componentPath}!`,
          ),
      );
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
