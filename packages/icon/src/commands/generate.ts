import { Command } from "commander";
import findup from "findup-sync";
import fs from "fs";
import yaml from "js-yaml";
import kleur from "kleur";
import path from "path";
import pkg from "../../package.json" assert { type: "json" };

import { generateComponent } from "../templates/component";
import type { IconConfig } from "../types";
import { validateIcons } from "../validates/icons";
import { getTsconfig } from "get-tsconfig";
import { validateTsconfigJSX } from "../validates/tsconfig";
import { generateIconData } from "../templates/icon-data";

const ICON_CONFIG_FILE_NAME = "icon.config.yml";

const version = pkg.version;
const configPath = findup(ICON_CONFIG_FILE_NAME)!;

export const generate = new Command("generate")
  .alias("gen")
  .description("Generate SVG sprite and SeedIcon component")
  .action(() => {
    try {
      console.log("");
      const fileContents = yaml.load(fs.readFileSync(configPath, "utf8")) as IconConfig;

      const icons = fileContents.icons;
      validateIcons(icons);

      const componentPath = fileContents.componentPath || "src/components/SeedIcon.tsx";
      const componentFileName = path.basename(componentPath, ".tsx");
      const componentDir = path.dirname(componentPath);

      validateTsconfigJSX(getTsconfig());

      const seedIconComponent = generateComponent({
        componentFileName,
        version,
        icons,
      });

      const iconData = generateIconData({ icons });
      const iconComponentOutputDir = path.resolve(componentDir);

      // create directories
      if (!fs.existsSync(iconComponentOutputDir)) {
        fs.mkdirSync(iconComponentOutputDir, { recursive: true });
      }

      // write files
      fs.writeFileSync(path.resolve(componentDir, `${componentFileName}.tsx`), seedIconComponent);
      fs.writeFileSync(path.resolve(componentDir, "IconData.tsx"), iconData);

      // log
      console.log(
        kleur.green("⭐ SeedIcon component generate complete at ") +
          kleur.green().bold().underline(`${componentPath}`),
      );
      console.log(
        kleur.green("⭐ IconData created to the path where the SeedIcon component was created"),
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
