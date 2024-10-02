import chalk from "chalk";
import { existsSync, promises as fs, readFileSync } from "fs";
import path, { basename } from "node:path";

import { generateMDXTemplate } from "./utils/generate-mdx-template.js";

const PUBLIC_PATH = path.join(process.cwd(), "public");
const SNIPPETS_PATH = path.join(process.cwd(), "snippets");

interface GenerateMDXProps {
  target: string;
}

async function generateMDX(props: GenerateMDXProps) {
  const { target } = props;

  const targetMDXPath = path.join(PUBLIC_PATH, "mdx");
  const targetSnippetPath = path.join(SNIPPETS_PATH, "example", target);

  if (!existsSync(targetMDXPath)) {
    console.log(chalk.red(`[Generate Registry] ${chalk.bgRed(targetMDXPath)} dir does not exist!`));
    await fs.mkdir(targetMDXPath, { recursive: true });
  }

  if (!existsSync(targetSnippetPath)) {
    console.log(
      chalk.red(`[Generate Registry] ${chalk.bgRed(targetSnippetPath)} dir does not exist!`),
    );
    await fs.mkdir(targetSnippetPath, { recursive: true });
  }

  const snippets = await fs.readdir(targetSnippetPath);
  for (const snippet of snippets) {
    const snippetPath = path.join(targetSnippetPath, snippet);

    if (!existsSync(snippetPath)) {
      console.log(
        chalk.red(`[Generate Registry] ${chalk.bgRed(target)} Snippet file does not exist!`),
      );
      return null;
    }

    const content = readFileSync(snippetPath, "utf-8");
    const code = generateMDXTemplate({
      language: "tsx",
      template: content,
      copy: true,
    });
    const fileName = basename(snippet).split(".")[0];
    const writeDir = path.join(targetMDXPath, target);

    if (!existsSync(writeDir)) {
      await fs.mkdir(writeDir, { recursive: true });
    }

    await fs.writeFile(path.join(writeDir, `${fileName}.mdx`), code, "utf-8");
  }
}

function main() {
  console.log(chalk.gray("Generate MDX..."));

  generateMDX({ target: "react" });
  generateMDX({ target: "stackflow" });

  console.log(chalk.green("MDX Generated!"));
}

main();
