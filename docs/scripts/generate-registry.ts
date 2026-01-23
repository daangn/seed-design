import chalk from "chalk";
import { existsSync, promises as fs, readFileSync } from "fs";
import path from "node:path";
import { RegistryGenerator } from "./registry-generator.js";
import { registryBreeze } from "../registry/registry-breeze.js";
import { registryLib } from "../registry/registry-lib.js";
import { registryUI } from "../registry/registry-ui.js";
import { convertToShadcnItem, convertToShadcnRegistry } from "./shadcn-converter.js";
import type { GeneratedRegistryItem } from "../registry/schema.js";

const REGISTRY_PATH = path.join(process.cwd(), "registry");
const GENERATED_REGISTRY_PATH = path.join(process.cwd(), "public", "__registry__");
const SHADCN_REGISTRY_PATH = path.join(process.cwd(), "public", "r");

// shadcn registry 설정
const SHADCN_BASE_URL = "https://seed-design.io";
const SHADCN_REGISTRY_NAME = "seed-design";
const SHADCN_HOMEPAGE = "https://seed-design.io";

// remove leading & trailing newline and add a new ending newline
const cleanFile = (filePath: string) => `${filePath.replace(/^\n+|\n+$/g, "")}\n`;

async function main() {
  console.log(chalk.gray("Generating Component Registry..."));

  const generator = new RegistryGenerator({
    importAlias: "seed-design",
    registries: [registryUI, registryLib, registryBreeze],
    innateDeps: new Set(["react", "react-dom"]),
    getFileContent: (filePath) => readFileSync(path.join(REGISTRY_PATH, filePath), "utf8"),
    transformSnippetContent: (content, { itemId, registryId, snippetMetadata }) => {
      const extension = path.extname(snippetMetadata.path);

      if (
        extension !== ".ts" &&
        extension !== ".tsx" &&
        extension !== ".js" &&
        extension !== ".jsx"
      )
        return cleanFile(content);

      const dependencies = snippetMetadata.dependencies
        ? Object.entries(snippetMetadata.dependencies)
            .map(([pkg, version]) => ` * @requires ${pkg}@${version}`)
            .join("\n")
        : "";

      return cleanFile(`/**
 * @file ${registryId}:${itemId}${dependencies ? `\n${dependencies}` : ""}
 **/

${content}
/**
 * This file is a snippet from SEED Design, helping you get started quickly with @seed-design/* packages.
 * You can extend this snippet however you want.
 */
`);
    },
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

  console.log(chalk.green("SEED Registries Generated!"));

  // shadcn 호환 형식 생성
  console.log(chalk.gray("Generating shadcn-compatible registry..."));

  // /r/ 디렉토리 생성
  if (!existsSync(SHADCN_REGISTRY_PATH)) {
    await fs.mkdir(SHADCN_REGISTRY_PATH, { recursive: true });
  }

  // 모든 아이템을 수집하여 플랫 구조로 저장
  const allShadcnItems: Map<string, GeneratedRegistryItem> = new Map();
  const registryIdMap: Map<string, string> = new Map(); // itemId -> registryId

  for (const { index, items } of registries) {
    for (const item of items) {
      allShadcnItems.set(item.id, item);
      registryIdMap.set(item.id, index.id);
    }
  }

  // 개별 아이템 JSON 생성 (플랫 구조: /r/action-button.json)
  for (const [itemId, item] of allShadcnItems) {
    const registryId = registryIdMap.get(itemId)!;
    const shadcnItem = convertToShadcnItem(item, {
      registryId,
      baseUrl: SHADCN_BASE_URL,
    });

    const itemPath = path.join(SHADCN_REGISTRY_PATH, `${itemId}.json`);

    await fs.writeFile(itemPath, JSON.stringify(shadcnItem, null, 2), "utf8");
  }

  // registry.json (전체 목록) 생성
  const shadcnRegistry = convertToShadcnRegistry(
    registries.map(({ index }) => index),
    {
      name: SHADCN_REGISTRY_NAME,
      homepage: SHADCN_HOMEPAGE,
      baseUrl: SHADCN_BASE_URL,
    },
  );

  const shadcnRegistryPath = path.join(SHADCN_REGISTRY_PATH, "registry.json");
  await fs.writeFile(shadcnRegistryPath, JSON.stringify(shadcnRegistry, null, 2), "utf8");

  console.log(chalk.green("shadcn-compatible Registry Generated!"));
  console.log(chalk.gray(`  - Registry index: ${shadcnRegistryPath}`));
  console.log(chalk.gray(`  - Total items: ${allShadcnItems.size}`));
}

main().catch((error) => {
  console.error(chalk.red("Failed to generate registries:"), error);
  process.exit(1);
});
