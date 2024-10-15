import * as p from "@clack/prompts";
import { z } from "zod";
import type { CAC } from "cac";
import {
  filterGitIgnoredFiles,
  getAllFileNamesWithMatchingExtension,
  getAllTypeScriptCompiledFileNames,
} from "@/src/utils/files";
import { simpleGit } from "simple-git";
import fs from "fs";
import jscodeshift from "jscodeshift";

const iconShiftOptionsSchema = z.object({
  path: z.string().optional(),
  includeIgnored: z.boolean().optional(),
});

// 1. 루트에서 `yarn seed-design icon-shift` 명령어를 입력한다. [x]
// 2. 명시된 타겟 경로를 읽는다. [x]
// 2-1. 타겟 경로 default = process.cwd() [x]
// 2-2. tsconfig include 경로 [x]
// 2-3. 유저가 입력한 경로  [x]
// 3. 로그 파일
// 3-1. 변경된 파일, (라인)
// 3-2. 에러났을 때 에러 메세지도 같이 들어있고, 어디서 문제 생겼는지도 나와야 한다.
// 3-2. 그 안에서의 아이콘 AS-IS, TO-BE
// 4. 마이그레이션 끝났습니다. 로그 파일은 어디 생성됐고, 총 몇개의 아이콘 변경됐습니다.

const EXTENSIONS_TO_FIND = [".js", ".jsx", ".ts", ".tsx"];
const EXTENSIONS_TO_EXCLUDE = [".d.ts"];

export const iconShiftCommand = (cli: CAC) => {
  cli
    .command("icon-shift", "V2 아이콘을 V3 아이콘으로 변환하는 명령어")
    .option("--path <path>", "마이그레이션할 소스 코드가 있는 경로 (선택)")
    .option("--include-ignored", ".gitignore를 통해 트래킹되지 않는 파일도 포함할지 여부 (선택)")
    .example("seed-design icon-shift")
    .action(async (opts) => {
      const options = iconShiftOptionsSchema.parse({ ...opts });

      const pathAvailableTargetPrompt = {
        target: () =>
          p.select({
            message: `입력한 경로: ${options.path} 맞나요?`,
            options: [{ label: "네", value: "path" }],
          }),
      };

      const pathUnavailableTargetPrompt = {
        target: () =>
          p.select({
            message: "어떤 파일을 대상으로 마이그레이션을 진행할까요?",
            options: [
              {
                label: "현재 디렉토리에서 사용되는 tsconfig가 컴파일하는 파일",
                value: "tsconfig",
              },
              {
                // FIXME: 확장자
                label: "현재 디렉토리 안의 .js, .jsx, .ts, .tsx (excluding d.ts)",
                value: "cwd",
              },
            ],
            initialValue: "tsconfig.json",
          }),
      };

      const group = await p.group({
        ...(options.path ? pathAvailableTargetPrompt : pathUnavailableTargetPrompt),
        ...(options.includeIgnored && {
          includeIgnored: () =>
            p.confirm({
              message: "git에 트래킹되지 않는 파일도 포함할까요?",
              initialValue: true,
            }),
        }),
      });

      const filesFound = (() => {
        switch (group.target) {
          case "tsconfig":
            return getAllTypeScriptCompiledFileNames({
              dirToFindTsconfig: process.cwd(),
              excludeDTs: true,
            });
          case "cwd":
            return getAllFileNamesWithMatchingExtension({
              dir: process.cwd(),
              extensionsToFind: EXTENSIONS_TO_FIND,
              extensionsToExclude: EXTENSIONS_TO_EXCLUDE,
            });
          case "path":
            return getAllFileNamesWithMatchingExtension({
              dir: options.path,
              extensionsToFind: EXTENSIONS_TO_FIND,
              extensionsToExclude: EXTENSIONS_TO_EXCLUDE,
            });
        }
      })();

      const filesTracked = options.includeIgnored
        ? filesFound
        : await filterGitIgnoredFiles({
            git: simpleGit(),
            filePaths: filesFound,
          });

      console.log(`총 ${filesTracked.length}개의 파일을 찾았습니다.`);
      const j = jscodeshift.withParser("tsx");

      for (const filePath of filesTracked) {
        migrateFile({ jscodeshift: j, filePath, source: "react" });
      }
    });
};

function migrateFile({
  jscodeshift,
  filePath,
  source,
}: {
  jscodeshift: jscodeshift.JSCodeshift;
  filePath: string;
  source: string;
}) {
  const file = fs.readFileSync(filePath, "utf-8");

  const matchedImportDeclarations = jscodeshift(file).find(
    jscodeshift.ImportDeclaration,
    {
      source: { value: source },
    }
  );

  matchedImportDeclarations.forEach(({ node }) => {
    node.specifiers.forEach(({ local: { name } }) => console.log(name));
    console.log("ㄴ", node.source.value);
  });
}
