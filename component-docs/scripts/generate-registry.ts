import { existsSync, promises as fs, readFileSync } from "fs";
import path, { basename } from "node:path";
import chalk from "chalk";

import { match } from "ts-pattern";

// ts-node로 실행할 때 extension을 명시해주지 않으면 모듈을 찾지 못함.
import { componentMetadatas } from "../metadatas/component.js";
import { exampleMetadatas } from "../metadatas/example.js";

import { type ComponentMetadataSchema, componentRegistrySchema } from "../schemas/component.js";
import { type ExampleMetadataSchema, exampleRegistrySchema } from "../schemas/example.js";

const REGISTRY_PATH = path.join(process.cwd(), "public/registry");
const SNIPPETS_PATH = path.join(process.cwd(), "snippets");

type RegistryType = "component" | "example";

interface GenerateRegistryIndexProps {
  metadatas: ComponentMetadataSchema[] | ExampleMetadataSchema[];
  type: RegistryType;
}
async function generateRegistryIndex({ metadatas, type }: GenerateRegistryIndexProps) {
  const metadatasJson = JSON.stringify(metadatas, null, 2);

  await fs.writeFile(path.join(REGISTRY_PATH, `${type}/index.json`), metadatasJson, "utf8");
}

interface GenerateRegistryProps {
  metadatas: ComponentMetadataSchema[] | ExampleMetadataSchema[];
  type: RegistryType;
}

async function generateRegistry({ metadatas, type }: GenerateRegistryProps) {
  const targetPath = path.join(REGISTRY_PATH, type);

  if (!existsSync(targetPath)) {
    await fs.mkdir(targetPath, { recursive: true });
  }

  for (const metadata of metadatas) {
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

    const parsedPayload = match(type)
      .with("component", () => componentRegistrySchema.parse(payload))
      .with("example", () => exampleRegistrySchema.parse(payload))
      .exhaustive();

    await fs.writeFile(
      path.join(targetPath, `${metadata.name}.json`),
      JSON.stringify(parsedPayload, null, 2),
      "utf8",
    );
  }
}

function main() {
  console.log(chalk.gray("Generate Component Registry..."));

  generateRegistryIndex({ metadatas: componentMetadatas, type: "component" });
  generateRegistryIndex({ metadatas: exampleMetadatas, type: "example" });

  generateRegistry({ metadatas: componentMetadatas, type: "component" });
  generateRegistry({ metadatas: exampleMetadatas, type: "example" });

  console.log(chalk.green("Component Registry Generated !"));
}

main();
