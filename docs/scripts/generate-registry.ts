import chalk from "chalk";
import { existsSync, promises as fs, readFileSync } from "fs";
import path from "node:path";
import { RegistryGenerator } from "./registry-generator.js";
import { registryBreeze as reactRegistryBreeze } from "../registry/react/registry-breeze.js";
import { registryLib as reactRegistryLib } from "../registry/react/registry-lib.js";
import { registryUI as reactRegistryUI } from "../registry/react/registry-ui.js";
import { registryBlock as reactRegistryBlock } from "../registry/react/registry-block.js";
import { registryUI as lynxRegistryUI } from "../registry/lynx/registry-ui.js";

// remove leading & trailing newline and add a new ending newline
const cleanFile = (filePath: string) => `${filePath.replace(/^\n+|\n+$/g, "")}\n`;

const transformSnippetContent = (
  content: string,
  {
    itemId,
    registryId,
    snippetMetadata,
  }: {
    registryId: string;
    itemId: string;
    snippetMetadata: { path: string; dependencies?: Record<string, string> };
  },
) => {
  const extension = path.extname(snippetMetadata.path);

  if (extension !== ".ts" && extension !== ".tsx" && extension !== ".js" && extension !== ".jsx")
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
};

const frameworks = [
  {
    name: "react",
    registryPath: path.join(process.cwd(), "registry", "react"),
    outputPath: path.join(process.cwd(), "public", "__registry__", "react"),
    registries: [reactRegistryUI, reactRegistryLib, reactRegistryBreeze, reactRegistryBlock],
    innateDeps: new Set(["react", "react-dom"]),
  },
  {
    name: "lynx",
    registryPath: path.join(process.cwd(), "registry", "lynx"),
    outputPath: path.join(process.cwd(), "public", "__registry__", "lynx"),
    registries: [lynxRegistryUI],
    innateDeps: new Set(["@lynx-js/react", "react", "react-dom"]),
  },
];

async function main() {
  console.log(chalk.gray("Generating Component Registry..."));

  for (const framework of frameworks) {
    console.log(chalk.gray(`\nGenerating ${framework.name} registry...`));

    const generator = new RegistryGenerator({
      importAlias: "seed-design",
      registries: framework.registries,
      innateDeps: framework.innateDeps,
      getFileContent: (filePath) =>
        readFileSync(path.join(framework.registryPath, filePath), "utf8"),
      transformSnippetContent,
    });

    const { registries, availableRegistries } = generator.generate();

    await Promise.all(
      registries.map(async ({ index, items }) => {
        const outPath = path.join(framework.outputPath, index.id);

        if (!existsSync(outPath)) {
          await fs.mkdir(outPath, { recursive: true });
        }

        for (const item of items) {
          const itemPath = path.join(outPath, `${item.id}.json`);
          await fs.writeFile(itemPath, JSON.stringify(item, null, 2), "utf8");
        }

        const indexPath = path.join(outPath, "index.json");
        await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf8");

        console.log(chalk.gray(`  Generated ${index.id} registry...`));
      }),
    );

    const availableRegistriesPath = path.join(framework.outputPath, "index.json");
    await fs.writeFile(
      availableRegistriesPath,
      JSON.stringify(availableRegistries, null, 2),
      "utf8",
    );
  }

  console.log(chalk.green("\nAll Registries Generated !"));
}

main().catch((error) => {
  console.error(chalk.red("Failed to generate registries:"), error);
  process.exit(1);
});
