import { fetchComponentMetadatas, getMetadataIndex } from "@/src/utils/get-metadata";
import * as p from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { getConfig } from "@/src/utils/get-config";
import { getPackageManager } from "@/src/utils/get-package-manager";
import { transform } from "@/src/utils/transformers";
import { z } from "zod";

import type { CAC } from "cac";

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  // yes: z.boolean(),
  // overwrite: z.boolean(),
  cwd: z.string(),
  all: z.boolean(),
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
    .action(async (components, opts) => {
      const options = addOptionsSchema.parse({
        components,
        ...opts,
      });

      p.intro("Add a component to your project");

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

        selectedComponents = selects as string[];
      }

      if (!selectedComponents?.length) {
        p.log.error("No components found.");
        process.exit(0);
      }

      const is = await p.confirm({
        message: "Do you want to add this component to your project?",
        initialValue: true,
      });

      if (!is) {
        return;
      }

      const config = await getConfig(cwd);
      const metadatas = await fetchComponentMetadatas(selectedComponents);

      for (const metadata of metadatas) {
        for (const registry of metadata.registries) {
          const componentPath = config.resolvedPaths.components;

          if (!fs.existsSync(componentPath)) {
            await fs.mkdir(componentPath, { recursive: true });
          }

          // TODO: 다른 폴더도 지원, 현재는 components만 지원
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
        }

        const packageManager = await getPackageManager(cwd);

        const { start, stop } = p.spinner();

        // Install dependencies.
        if (metadata.dependencies?.length) {
          start("Installing dependencies...");

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
          start("Installing devDependencies...");

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
    });
};
