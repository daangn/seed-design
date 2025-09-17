import chalk from "chalk";
import { existsSync, promises as fs, readFileSync } from "fs";
import path from "node:path";
import { RegistryGenerator } from "./registry-generator.js";
import { registryBreeze } from "../registry/registry-breeze.js";
import { registryLib } from "../registry/registry-lib.js";
import { registryUI } from "../registry/registry-ui.js";

const REGISTRY_PATH = path.join(process.cwd(), "registry/src");
const GENERATED_REGISTRY_PATH = path.join(process.cwd(), "public", "__registry__");

async function main() {
  console.log(chalk.gray("Generating Component Registry..."));

  const generator = new RegistryGenerator({
    importAlias: "seed-design",
    registries: [registryUI, registryLib, registryBreeze],
    innateDeps: new Set(["react", "react-dom"]),
    getFileContent: (filePath) => readFileSync(path.join(REGISTRY_PATH, filePath), "utf8"),
  });

  const { registries, availableRegistries } = generator.generate();

  await Promise.all(
    registries.map(async ({ index, items }) => {
      const outPath = path.join(GENERATED_REGISTRY_PATH, index.id);

      if (!existsSync(outPath)) {
        await fs.mkdir(outPath, { recursive: true });
      }

      for (const item of items) {
        const itemPath = path.join(outPath, `${item.id}.json`);
        await fs.writeFile(itemPath, JSON.stringify(item, null, 2), "utf8");
      }

      const indexPath = path.join(outPath, "index.json");
      await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf8");

      console.log(chalk.gray(`Generated ${index.id} registry...`));
    }),
  );

  const availableRegistriesPath = path.join(GENERATED_REGISTRY_PATH, "index.json");
  await fs.writeFile(availableRegistriesPath, JSON.stringify(availableRegistries, null, 2), "utf8");

  console.log(chalk.green("All Registries Generated !"));
}

main().catch((error) => {
  console.error(chalk.red("Failed to generate registries:"), error);
  process.exit(1);
});
