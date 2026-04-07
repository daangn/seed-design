import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

interface CodemodExample {
  name: string;
  input: string;
  output: string;
  fileExt: string;
}

interface TransformDoc {
  name: string;
  path: string;
  readme: string;
  example: CodemodExample | null;
}

const TRANSFORMS_DIR = join(process.cwd(), "packages/codemod/src/transforms");
const DOCS_OUTPUT_PATH = join(
  process.cwd(),
  "docs/content/react/developer-tools/codemods/available-transforms.mdx",
);

async function findBasicExample(transformPath: string): Promise<CodemodExample | null> {
  const fixturesPath = join(transformPath, "__testfixtures__");

  // 지원하는 파일 확장자 목록
  const supportedExtensions = [".tsx", ".jsx", ".ts", ".js", ".css"];

  for (const ext of supportedExtensions) {
    const inputPath = join(fixturesPath, `basic.input${ext}`);
    const outputPath = join(fixturesPath, `basic.output${ext}`);

    // 해당 확장자의 파일이 존재하는지 확인
    if (existsSync(inputPath) && existsSync(outputPath)) {
      try {
        const input = await readFile(inputPath, "utf-8");
        const output = await readFile(outputPath, "utf-8");

        return {
          name: "basic",
          input: input.trim(),
          output: output.trim(),
          fileExt: ext.substring(1), // 앞의 점(.)을 제거
        };
      } catch (error) {
        console.error(`Error reading files: ${error}`);
        return null;
      }
    }
  }

  console.warn(`No basic test fixture found for ${transformPath}`);
  return null;
}

/**
 * transform 폴더에서 README.md 파일을 읽어 설명을 가져옵니다.
 */
async function getTransformReadme(transformPath: string, transformName: string): Promise<string> {
  const readmePath = join(transformPath, "README.md");

  // README.md 파일이 존재하면 해당 내용을 읽어 반환
  if (existsSync(readmePath)) {
    try {
      let content = await readFile(readmePath, "utf-8");

      // 헤딩 레벨 조정 (# -> ##, ## -> ###, ### -> ####)
      content = content.replace(/^(#{1,3}) (.+)$/gm, (_match, hashes, text) => {
        return `${hashes}#`.substring(0, 5) + " " + text;
      });

      return content.trim();
    } catch (error) {
      console.warn(`Error reading README.md for ${transformName}: ${error}`);
    }
  }

  // README.md 파일이 없거나 읽기 실패 시 기본 설명 반환
  return `### ${transformName}`;
}

async function generateTransformDocs(): Promise<TransformDoc[]> {
  const transforms = await readdir(TRANSFORMS_DIR);
  const docs: TransformDoc[] = [];

  for (const transform of transforms) {
    const transformPath = join(TRANSFORMS_DIR, transform);
    const example = await findBasicExample(transformPath);
    const readme = await getTransformReadme(transformPath, transform);

    docs.push({
      name: transform,
      path: `${transform}`,
      readme,
      example,
    });
  }

  return docs;
}

function generateMdx(docs: TransformDoc[]): string {
  let mdx = `---
title: Available Transforms
description: codemod를 통해 실행 가능한 변환 목록입니다.
---

{/* Auto-generated from \`scripts/generate-codemod-docs.ts\` */}

`;

  for (const doc of docs) {
    mdx += `${doc.readme}\n\n`;

    mdx += `\`\`\`package-install
npx @ride-developer/codemod@latest ${doc.path} <target_path>
\`\`\`\n\n`;

    if (doc.example) {
      mdx += `<Accordions>\n<Accordion title="변경 예시">\n\n`;

      // 입력 코드 블록 (파일명 포함)
      mdx += `\`\`\`${doc.example.fileExt} title="basic.input.${doc.example.fileExt}"\n`;
      mdx += `${doc.example.input}\n`;
      mdx += "\`\`\`\n\n";

      // 출력 코드 블록 (파일명 포함)
      mdx += `\`\`\`${doc.example.fileExt} title="basic.output.${doc.example.fileExt}"\n`;
      mdx += `${doc.example.output}\n`;
      mdx += "\`\`\`\n\n";

      mdx += "</Accordion>\n</Accordions>\n\n";
    }
  }

  return mdx;
}

async function main() {
  const docs = await generateTransformDocs();
  const mdx = generateMdx(docs);
  await writeFile(DOCS_OUTPUT_PATH, mdx);
  console.log(`Codemod docs generated at ${DOCS_OUTPUT_PATH}`);
}

main().catch(console.error);
