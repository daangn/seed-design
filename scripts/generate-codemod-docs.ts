import { readdir, readFile, writeFile } from "fs/promises";
import { join, extname } from "path";
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
  example: CodemodExample | null;
}

const TRANSFORMS_DIR = join(process.cwd(), "packages/codemod/src/transforms");
const DOCS_OUTPUT_PATH = join(process.cwd(), "docs/content/react/get-started/codemod.mdx");

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

function generateMdx(docs: TransformDoc[]): string {
  let mdx = `---
title: Codemod
description: Seed Design V2에서 V3로 마이그레이션하기 위한 코드 변환 도구
---

\`@seed-design/codemod\`는 Seed Design V2에서 V3로 마이그레이션하기 위한 코드 변환 도구예요.

## 사용 방법

\`\`\`package-install
npx @seed-design/codemod <transform> <target_path> <옵션>
\`\`\`

사용 가능한 transform 목록을 확인하려면 다음 명령어를 실행해요.

\`\`\`package-install
npx @seed-design/codemod --list
\`\`\`

## 옵션

- \`--list\`
  - 사용 가능한 transform 목록을 보여줘요.
- \`--log\`
  - 로그를 파일로 저장해요.
  - \`./\`에 \`combined.log\`와 \`warnings.log\` 파일이 생성돼요.
- \`--parser\`
  - jscodeshift가 사용할 파서를 지정해요
  - \`babel\` | \`babylon\` | \`flow\` | \`ts\` | \`tsx\`
  - 기본값: \`tsx\`
  - 예시: \`--parser=babel\`
- \`--extensions\`
  - 변환할 파일 확장자를 지정해요.
  - 지정하지 않으면 \`<경로>\` 안의 \`js,jsx,ts,tsx\` 파일을 변환해요. (\`d.ts\`는 제외)
  - 예시: \`--extensions="ts,tsx"\`
- \`--ignore-config\`
  - 변환하지 않을 파일 패턴이 정의된 파일을 지정해요.
  - 예시: \`--ignore-config=".gitignore"\`

## 사용 가능한 Transforms

`;

  for (const doc of docs) {
    mdx += `### ${doc.name}\n\n`;

    // 각 transform에 대한 설명 추가
    switch (doc.name) {
      case "replace-color-prop":
        mdx += "색상 prop을 V3 형식으로 변환해요.\n\n";
        break;
      case "replace-tailwind-typography":
        mdx += "Tailwind 타이포그래피 클래스를 V3 형식으로 변환해요.\n\n";
        break;
      case "replace-typography-design-token":
        mdx += "타이포그래피 디자인 토큰을 V3 형식으로 변환해요.\n\n";
        break;
      case "replace-text-component":
        mdx += "Text 컴포넌트를 V3 형식으로 변환해요.\n\n";
        break;
      case "migrate-icons":
        mdx +=
          "아이콘을 V3 형식으로 변환해요. 자세한 내용은 [아이콘 Codemod](/react/iconography/codemod) 문서를 참고해주세요.\n\n";
        break;
      case "replace-css-typography-variable":
        mdx += "CSS 타이포그래피 변수를 V3 형식으로 변환해요.\n\n";
        break;
      case "replace-color-design-token":
        mdx += "색상 디자인 토큰을 V3 형식으로 변환해요.\n\n";
        break;
      case "replace-css-color-variable":
        mdx += "CSS 색상 변수를 V3 형식으로 변환해요.\n\n";
        break;
      case "replace-tailwind-color":
        mdx += "Tailwind 색상 클래스를 V3 형식으로 변환해요.\n\n";
        break;
      default:
        break;
    }

    mdx += `\`\`\`package-install
npx @seed-design/codemod ${doc.path} <target_path>
\`\`\`\n\n`;

    if (doc.example) {
      mdx += `<Accordions>\n<Accordion title="변경 예시">\n\n`;

      // 입력 코드 블록 (파일명 포함)
      mdx += `\`\`\`${doc.example.fileExt} title="basic.input.${doc.example.fileExt}"\n`;
      mdx += `${doc.example.input}\n`;
      mdx += `\`\`\`\n\n`;

      // 출력 코드 블록 (파일명 포함)
      mdx += `\`\`\`${doc.example.fileExt} title="basic.output.${doc.example.fileExt}"\n`;
      mdx += `${doc.example.output}\n`;
      mdx += `\`\`\`\n\n`;

      mdx += `</Accordion>\n</Accordions>\n\n`;
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
