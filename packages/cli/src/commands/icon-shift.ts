import * as p from "@clack/prompts";
import { z } from "zod";
import type { CAC } from "cac";
import { getAllFileNamesWithMatchingExtension, getAllTypeScriptCompiledFileNames } from "@/src/utils/get-filenames";

const iconShiftOptionsSchema = z.object({
  path: z.string().optional(),
  includeIgnored: z.boolean().optional(),
});

// 1. 루트에서 `yarn seed-design icon-shift` 명령어를 입력한다.
// 2. 명시된 타겟 경로를 읽는다.
// 2-1. 타겟 경로 default = process.cwd()
// 2-2. tsconfig include 경로
// 2-3. 유저가 입력한 경로
// 3. 로그 파일
// 3-1. 변경된 파일, (라인)
// 3-2. 에러났을 때 에러 메세지도 같이 들어있고, 어디서 문제 생겼는지도 나와야 한다.
// 3-2. 그 안에서의 아이콘 AS-IS, TO-BE
// 4. 마이그레이션 끝났습니다. 로그 파일은 어디 생성됐고, 총 몇개의 아이콘 변경됐습니다.

const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];

export const iconShiftCommand = (cli: CAC) => {
  cli
    .command("icon-shift", "V2 아이콘을 V3 아이콘으로 변환하는 명령어")
    .option("--path <path>", "마이그레이션할 소스 코드가 있는 경로 (선택)")
    .option("--include-ignored", "마이그레이션할 소스 코드가 있는 경로 (선택)")
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
                label: "현재 디렉토리 안의 .js, .jsx, .ts, .tsx",
                value: "cwd",
              },
            ],
            initialValue: "tsconfig.json",
          }),
      };

      const group = await p.group({
        ...(options.path
          ? pathAvailableTargetPrompt
          : pathUnavailableTargetPrompt),
        ...(options.includeIgnored && {
          includeIgnored: () =>
            p.confirm({
              message: ".gitignore을 통해 트래킹되지 않는 파일도 포함할까요?",
              initialValue: true,
            }),
        }),
      });

      const files = (() => {
        switch (group.target) {
          case "path": {
            return getAllFileNamesWithMatchingExtension({
              dir: options.path,
              ext: EXTENSIONS,
            });
          }
          case "cwd": {
            return getAllFileNamesWithMatchingExtension({
              dir: process.cwd(),
              ext: EXTENSIONS,
            });
          }
          case "tsconfig": {
            return getAllTypeScriptCompiledFileNames({
              dirToFindTsconfig: process.cwd(),
            });
          }
        }
      })();

      console.log(files);
    });
};
