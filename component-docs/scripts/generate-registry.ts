import chalk from "chalk";
import { existsSync, promises as fs, readFileSync } from "fs";
import path, { basename } from "node:path";

import { match } from "ts-pattern";

// ts-node로 실행할 때 extension을 명시해주지 않으면 모듈을 찾지 못함.
import { componentMetadatas } from "../metadatas/component.js";

import { componentRegistrySchema, type ComponentMetadataSchema } from "../schemas/component.js";
import { generateMDXTemplate } from "./utils/generate-mdx-template.js";

const REGISTRY_PATH = path.join(process.cwd(), "public", "__registry__");
const PUBLIC_PATH = path.join(process.cwd(), "public");
const SNIPPETS_PATH = path.join(process.cwd(), "snippets");

type RegistryType = "component";

interface GenerateRegistryIndexProps {
  metadatas: ComponentMetadataSchema[];
  type: RegistryType;
}
async function generateRegistryIndex({ metadatas, type }: GenerateRegistryIndexProps) {
  const metadatasJson = JSON.stringify(metadatas, null, 2);
  const targetFolder = path.join(REGISTRY_PATH, type);
  const targetPath = path.join(targetFolder, "index.json");

  if (!existsSync(targetFolder)) {
    await fs.mkdir(targetFolder, { recursive: true });
  }

  await fs.writeFile(targetPath, metadatasJson, "utf8");
}

interface GenerateRegistryProps {
  metadatas: ComponentMetadataSchema[];
  type: RegistryType;
}

async function generateRegistry({ metadatas, type }: GenerateRegistryProps) {
  const targetPath = path.join(REGISTRY_PATH, type);
  const mdxTargetPath = path.join(PUBLIC_PATH, "__mdx__", type);

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

        const template = generateMDXTemplate({
          language: "tsx",
          template: content,
          copy: true,
          filename: `${metadata.name}.tsx`,
        });

        // Write MDX file
        fs.writeFile(path.join(mdxTargetPath, `${metadata.name}.mdx`), template, "utf8");

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
  generateRegistry({ metadatas: componentMetadatas, type: "component" });

  console.log(chalk.green("Component Registry Generated !"));
}

main();
