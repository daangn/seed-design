import { existsSync, promises as fs, readFileSync } from "fs";
import path, { basename } from "node:path";
import chalk from "chalk";

// ts-node로 실행할 때 extension을 명시해주지 않으면 모듈을 찾지 못함.
import { componentMetadatas } from "../metadatas/component.js";

import type { ComponentMetadatas } from "../schemas/metadata.js";
import { componentRegistrySchema } from "../schemas/registry.js";

const REGISTRY_PATH = path.join(process.cwd(), "public/registry");
const SNIPPETS_PATH = path.join(process.cwd(), "snippets");

async function generateComponentRegistryIndex(metadatas: ComponentMetadatas) {
  const metadatasJson = JSON.stringify(metadatas, null, 2);

  await fs.writeFile(path.join(REGISTRY_PATH, "components/index.json"), metadatasJson, "utf8");
}

async function generateComponentRegistry(metadatas: ComponentMetadatas) {
  const targetPath = path.join(REGISTRY_PATH, "components");

  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  for (const metadata of metadatas) {
    if (metadata.type !== "component") {
      continue;
    }

    const registries = metadata.snippets
      ?.map((snippet) => {
        const snippetPath = path.join(SNIPPETS_PATH, snippet);
        if (!existsSync(snippetPath)) {
          console.log(
            chalk.red(
              `[Generate Registry] ${chalk.bgRed(metadata.name)} Snippet file does not exist!`,
            ),
          );
          return null;
        }

        const content = readFileSync(snippetPath, "utf8");

        return {
          name: basename(snippet),
          content,
        };
      })
      .filter(Boolean);

    const removeSnipepts = {
      ...metadata,
      snippets: undefined,
    };

    const payload = {
      ...removeSnipepts,
      registries,
    };

    const parsedPayload = componentRegistrySchema.parse(payload);

    await fs.writeFile(
      path.join(targetPath, `${metadata.name}.json`),
      JSON.stringify(parsedPayload, null, 2),
      "utf8",
    );
  }
}

function main() {
  console.log(chalk.gray("Generate Component Registry..."));

  generateComponentRegistryIndex(componentMetadatas);
  generateComponentRegistry(componentMetadatas);

  console.log(chalk.green("Component Registry Generated !"));
}

main();
