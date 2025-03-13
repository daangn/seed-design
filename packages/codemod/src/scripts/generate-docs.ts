import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

interface CodemodExample {
  name: string;
  input: string;
  output: string;
}

interface TransformDoc {
  name: string;
  path: string;
  example: CodemodExample | null;
}

const TRANSFORMS_DIR = join(__dirname, "../transforms");

async function findBasicExample(transformPath: string): Promise<CodemodExample | null> {
  const fixturesPath = join(transformPath, "__testfixtures__");

  try {
    const input = await readFile(join(fixturesPath, "basic.input.tsx"), "utf-8");
    const output = await readFile(join(fixturesPath, "basic.output.tsx"), "utf-8");

    return {
      name: "basic",
      input: input.trim(),
      output: output.trim(),
    };
  } catch {
    console.warn(`No basic test fixture found for ${transformPath}`);
    return null;
  }
}

async function generateTransformDocs(): Promise<TransformDoc[]> {
  const transforms = await readdir(TRANSFORMS_DIR);
  const docs: TransformDoc[] = [];

  for (const transform of transforms) {
    const transformPath = join(TRANSFORMS_DIR, transform);
    const example = await findBasicExample(transformPath);

    docs.push({
      name: transform,
      path: `${transform}`,
      example,
    });
  }

  return docs;
}

function generateMarkdown(docs: TransformDoc[]): string {
  let markdown = `# Seed Design Codemod

이 문서는 자동으로 생성되었습니다.

## 사용 가능한 Transforms

`;

  for (const doc of docs) {
    markdown += `### ${doc.name}\n\n`;
    markdown += `실행 방법:\n`;
    markdown += "```bash\n";
    markdown += `npx @seed-design/codemod ${doc.path} <target_path>\n`;
    markdown += "```\n\n";

    if (doc.example) {
      markdown += "<details>\n";
      markdown += "<summary>변경 예시</summary>\n\n";
      markdown += "<table>\n<tr><th>변경 전</th><th>변경 후</th></tr>\n<tr><td>\n\n";
      markdown += "```tsx\n";
      markdown += doc.example.input;
      markdown += "\n```\n\n";
      markdown += "</td><td>\n\n";
      markdown += "```tsx\n";
      markdown += doc.example.output;
      markdown += "\n```\n\n";
      markdown += "</td></tr></table>\n\n";
      markdown += "</details>\n\n";
    }
  }

  return markdown;
}

async function main() {
  const docs = await generateTransformDocs();
  const markdown = generateMarkdown(docs);
  await writeFile(join(__dirname, "../../TRANSFORMS.md"), markdown);
}

main().catch(console.error);
