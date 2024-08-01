import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import color from "picocolors";
import { z } from "zod";

import type { RawConfig } from "@/src/utils/get-config";

import type { CAC } from "cac";

const initOptionsSchema = z.object({
  cwd: z.string(),
});

export const initCommand = (cli: CAC) => {
  cli
    .command("init", "initialize seed-design.json")
    .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .action(async (opts) => {
      const options = initOptionsSchema.parse({ ...opts });
      const highlight = (text: string) => color.cyan(text);

      const group = await p.group(
        {
          tsx: () =>
            p.confirm({
              message: `Would you like to use ${highlight("TypeScript")} (recommended)?`,
              initialValue: true,
            }),
          rsc: () =>
            p.confirm({
              message: `Are you using ${highlight("React Server Components")}?`,
              initialValue: false,
            }),
          components: () =>
            p.text({
              message: `Enter the path to your ${highlight("components directory")}`,
              initialValue: "@/src/components",
              defaultValue: "@/src/components",
              placeholder: "@/src/components",
            }),
        },
        {
          onCancel: () => {
            p.cancel("Operation cancelled.");
            process.exit(0);
          },
        },
      );

      const config: RawConfig = {
        rsc: group.rsc,
        tsx: group.tsx,
        aliases: {
          components: group.components,
        },
      };

      const { start, stop } = p.spinner();
      start("Writing seed-design.json...");
      const targetPath = path.resolve(options.cwd, "seed-design.json");
      await fs.writeFile(targetPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
      const relativePath = path.relative(process.cwd(), targetPath);
      stop(`seed-design.json written to ${highlight(relativePath)}`);
    });
};
