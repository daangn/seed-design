import findup from "findup-sync";
import { Command, Option } from "commander";
import { generateDefaultConfig } from "../templates/config-default";
import { generateViteConfig } from "../templates/config-vite";
import fs from "fs";
import path from "path";
import kleur from "kleur";

interface InitOptions {
  template: "dynamic" | "vite";
}

const ICON_CONFIG_FILE_NAME = "icon.config.yml";

const projectPath = path.resolve(
  path.dirname(findup("package.json")!),
  ICON_CONFIG_FILE_NAME,
);

export const init = new Command("init")
  .description("Initialize icon.config.yml")
  .addOption(
    new Option("-t, --template <template>", "choose template")
      .choices(["dynamic", "vite"])
      .default("dynamic"),
  )
  .action((options: InitOptions) => {
    try {
      console.log("");
      const template = options.template;

      if (template === "dynamic") {
        const config = generateDefaultConfig();
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
          kleur.yellow("If you want preload, Please add ") +
            kleur
              .yellow()
              .bold()
              .underline(
                `<link rel="preload" as="image" type="image/svg+xml" href="your sprite href">`,
              ) +
            kleur.yellow(" to your index.html"),
        );
      }

      console.log("");
    } catch (e) {
      console.error(e);
    }
  });
