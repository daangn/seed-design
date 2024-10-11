import chalk from "chalk";
import { existsSync, promises as fs, readFileSync } from "fs";
import path, { basename } from "node:path";

import { match } from "ts-pattern";

import { registryComponent } from "../registry/registry-component.js";
import {
  RegistryComponent,
  registryComponentItemMachineGeneratedSchema,
} from "../registry/schema.js";
import { generateMDXTemplate } from "./utils/generate-mdx-template.js";

const GENERATED_REGISTRY_PATH = path.join(process.cwd(), "public", "__registry__");
const REGISTRY_PATH = path.join(process.cwd(), "registry");
const PUBLIC_PATH = path.join(process.cwd(), "public");

type RegistryType = "component";

interface GenerateRegistryIndexProps {
  registry: RegistryComponent;
  type: RegistryType;
}
async function generateRegistryIndex({ registry, type }: GenerateRegistryIndexProps) {
  const metadatasJson = JSON.stringify(registry, null, 2);
  const targetFolder = path.join(GENERATED_REGISTRY_PATH, type);
  const targetPath = path.join(targetFolder, "index.json");

  if (!existsSync(targetFolder)) {
    await fs.mkdir(targetFolder, { recursive: true });
  }

  await fs.writeFile(targetPath, metadatasJson, "utf8");
}

interface GenerateRegistryProps {
  registry: RegistryComponent;
  type: RegistryType;
}
async function generateRegistry({ registry, type }: GenerateRegistryProps) {
  const targetPath = path.join(GENERATED_REGISTRY_PATH, type);
  const mdxTargetPath = path.join(PUBLIC_PATH, "__mdx__", type);

  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  if (!existsSync(mdxTargetPath)) {
    await fs.mkdir(mdxTargetPath, { recursive: true });
  }

  for (const item of registry) {
    const registries = item.files
      ?.map((file) => {
        const filePath = path.join(REGISTRY_PATH, file);

        if (!existsSync(filePath)) {
          console.log(
            chalk.red(`[Generate Registry] ${chalk.bgRed(item.name)} file file does not exist!`),
          );
          return null;
        }

        const content = readFileSync(filePath, "utf8");

        const template = generateMDXTemplate({
          language: "tsx",
          template: content,
          copy: true,
          filename: `${item.name}.tsx`,
        });

        // Write MDX file
        fs.writeFile(path.join(mdxTargetPath, `${item.name}.mdx`), template, "utf8");

        return {
          name: basename(file),
          content,
        };
      })
      .filter(Boolean);

    const removeFiles = {
      ...item,
      files: undefined,
    };

    const payload = {
      ...removeFiles,
      registries,
    };

    const parsedPayload = match(type)
      .with("component", () => registryComponentItemMachineGeneratedSchema.parse(payload))
      .exhaustive();

    await fs.writeFile(
      path.join(targetPath, `${item.name}.json`),
      JSON.stringify(parsedPayload, null, 2),
      "utf8",
    );
  }
}

function main() {
  console.log(chalk.gray("Generate Component Registry..."));

  generateRegistryIndex({ registry: registryComponent, type: "component" });
  generateRegistry({ registry: registryComponent, type: "component" });

  console.log(chalk.green("Component Registry Generated !"));
}

main();
