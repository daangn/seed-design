import type { CAC } from "cac";

import { getConfig } from "@/src/utils/get-config";
import { getPackageManager } from "@/src/utils/get-package-manager";
import path from "path";

export const initCommand = (cli: CAC) => {
  cli.command("init", "initialize seed-design").action(async () => {
    console.log("init");
    const cwd = path.resolve(process.cwd());
    const pm = await getPackageManager(process.cwd());
    console.log("pm", pm);
    const config = await getConfig(cwd);
    console.log("config", config);
  });
};
