import { getConfig } from "@/src/utils/get-config";
import { fetchComponentMetadatas, getMetadataIndex } from "@/src/utils/get-metadata";
import { getPackageManager } from "@/src/utils/get-package-manager";
import { transform } from "@/src/utils/transformers";
import * as p from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import color from "picocolors";
import { z } from "zod";

import type { CAC } from "cac";
import { addRelativeComponents } from "../utils/add-relative-components";

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  cwd: z.string(),
  all: z.boolean(),
  // yes: z.boolean(),
  // overwrite: z.boolean(),
  // path: z.string().optional(),
});

export const addCommand = (cli: CAC) => {
  cli
    .command("add [...components]", "add component")
    .option("-a, --all", "Add all components", {
      default: false,
    })
    .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .example("seed-design add box-button")
    .example("seed-design add alert-dialog")
    .action(async (components, opts) => {
      const options = addOptionsSchema.parse({
        components,
        ...opts,
      });
      const highlight = (text: string) => color.cyan(text);
      const cwd = options.cwd;

      if (!fs.existsSync(cwd)) {
        p.log.error(`The path ${cwd} does not exist. Please try again.`);
        process.exit(1);
      }

      const metadataIndex = await getMetadataIndex();

      let selectedComponents: string[] = options.all
        ? metadataIndex.map((meatadata) => meatadata.name)
        : options.components;

      if (!options.components?.length && !options.all) {
        const selects = await p.multiselect<
          { label: string; value: string; hint: string }[],
          string
        >({
          message: "Select all components to add",
          options: metadataIndex.map((metadata) => {
            return {
              label: metadata.name,
              value: metadata.name,
              hint: metadata.description,
            };
          }),
        });

        if (p.isCancel(selects)) {
          p.log.error("Aborted.");
          process.exit(0);
        }

        selectedComponents = selects as string[];
      }

      if (!selectedComponents?.length) {
        p.log.error("No components found.");
        process.exit(0);
      }

      const allComponents = addRelativeComponents(selectedComponents, metadataIndex);
      const addedComponents = allComponents.filter((c) => !selectedComponents.includes(c));
      const config = await getConfig(cwd);
      const metadatas = await fetchComponentMetadatas(allComponents);

      p.log.message(
        `Selection: ${highlight(selectedComponents.join(", "))}
        \nInner Dependencies: ${highlight(addedComponents.join(", "))} will be also added.`,
      );

      for (const metadata of metadatas) {
        for (const registry of metadata.registries) {
          const componentPath = config.resolvedPaths;

          if (!fs.existsSync(componentPath)) {
            await fs.mkdir(componentPath, { recursive: true });
          }

          let filePath = path.resolve(componentPath, registry.name);

          const content = await transform({
            filename: registry.name,
            config,
            raw: registry.content,
          });

          if (!config.tsx) {
            filePath = filePath.replace(/\.tsx$/, ".jsx");
            filePath = filePath.replace(/\.ts$/, ".js");
          }

          await fs.writeFile(filePath, content);
          const relativePath = path.relative(cwd, filePath);
          p.log.info(`Added ${highlight(registry.name)} to ${highlight(relativePath)}`);
        }

        const packageManager = await getPackageManager(cwd);

        const { start, stop } = p.spinner();

        // Install dependencies.
        if (metadata.dependencies?.length) {
          start(color.gray("Installing dependencies"));

          const result = await execa(
            packageManager,
            [packageManager === "npm" ? "install" : "add", ...metadata.dependencies],
            {
              cwd,
            },
          );

          if (result.failed) {
            console.error(result.all);
            process.exit(1);
          } else {
            for (const deps of metadata.dependencies) {
              p.log.info(`- ${deps}`);
            }
            stop("Dependencies installed.");
          }
        }

        // Install devDependencies.
        if (metadata.devDependencies?.length) {
          start(color.gray("Installing devDependencies"));

          const result = await execa(
            packageManager,
            [packageManager === "npm" ? "install" : "add", "-D", ...metadata.devDependencies],
            {
              cwd,
            },
          );

          if (result.failed) {
            console.error(result.all);
            process.exit(1);
          } else {
            for (const deps of metadata.devDependencies) {
              p.log.info(`- ${deps}`);
            }
            stop("Dependencies installed.");
          }
        }
      }

      p.outro("Components added.");
    });
};
