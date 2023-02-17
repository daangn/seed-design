import { Command } from "commander";
import findup from "findup-sync";
import fs from "fs";
import yaml from "js-yaml";
import kleur from "kleur";
import path from "path";
import pkg from "../../package.json" assert { type: "json" };

import { generateIconComponent } from "../templates/component";
import { generateContext } from "../templates/context";
import generateSprite from "../templates/sprite";
import { IconConfig } from "../types";
import { validateIcons } from "../validates/icons";

const ICON_CONFIG_FILE_NAME = "icon.config.yml";

const version = pkg.version;
const configPath = findup(ICON_CONFIG_FILE_NAME)!;

export const generate = new Command("generate")
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

      const contextPath =
        fileContents.contextPath || "src/context/SeedIconContext.tsx";
      const contextFileName = path.basename(contextPath, ".tsx");
      const contextDir = path.dirname(contextPath);

      const seedIconComponent = generateIconComponent({
        componentFileName,
        componentDir,
        contextDir,
        contextFileName,
        version,
        icons,
      });

      const spriteSvg = generateSprite({ icons });
      const contextComponent = generateContext({
        contextDir,
        spriteDir,
        spriteFileName,
      });

      const contextOutputDir = path.resolve(contextDir);
      const spriteOutputDir = path.resolve(spriteDir);
      const iconComponentOutputDir = path.resolve(componentDir);

      // create directories
      if (!fs.existsSync(contextOutputDir)) {
        fs.mkdirSync(contextOutputDir, { recursive: true });
      }

      if (!fs.existsSync(spriteOutputDir)) {
        fs.mkdirSync(spriteOutputDir, { recursive: true });
      }

      if (!fs.existsSync(iconComponentOutputDir)) {
        fs.mkdirSync(iconComponentOutputDir, { recursive: true });
      }

      // write files
      fs.writeFileSync(
        path.resolve(contextDir, `${contextFileName}.tsx`),
        contextComponent,
      );
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
        kleur.green("⭐ SeedIcon context generate complete at ") +
          kleur.green().bold().underline(`${contextPath}`),
      );
      console.log(
        kleur.green("⭐ SeedIcon component generate complete at ") +
          kleur.green().bold().underline(`${componentPath}`),
      );
      console.log(
        kleur.green("⭐ SVG sprite generate complete at ") +
          kleur.green().bold().underline(spritePath),
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
