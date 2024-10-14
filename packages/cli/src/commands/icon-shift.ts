import * as p from "@clack/prompts";
import { z } from "zod";
import type { CAC } from "cac";
import ts from "typescript";
import path from "path";
import color from "picocolors";

const iconShiftOptionsSchema = z.object({
  path: z.string().optional(),
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

export const iconShiftCommand = (cli: CAC) => {
  cli
    .command("icon-shift", "V2 아이콘을 V3 아이콘으로 변환하는 명령어")
    .option("--path <path>", "마이그레이션할 소스 코드가 있는 경로 (선택)")
    .example("seed-design icon-shift")
    .action(async (opts) => {
      const options = iconShiftOptionsSchema.parse({ ...opts });

      const tsconfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists);
      const tsconfigFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
      const { fileNames } = ts.parseJsonConfigFileContent(
        tsconfigFile.config,
        ts.sys,
        path.dirname(tsconfigPath)
      );

      const isTsconfigAvailable =
        tsconfigPath && tsconfigFile && fileNames.length > 0;

      const pathAvailableTargetPrompt = {
        target: () =>
          p.select({
            message: `선택한 경로: ${options.path} 맞나요?`,
            options: [{ label: "네", value: "path" }],
          }),
      };

      const pathUnavailableTsconfigOption = {
        label: "현재 폴더에서 사용되는 tsconfig가 포함하는 파일",
        value: "tsconfig",
        hint: `총 ${fileNames.length}개 파일: ${fileNames[0]} 외 ${
          fileNames.length - 1
        }개`,
      };

      const pathUnavailableTargetPrompt = {
        target: () =>
          p.select({
            message: "어떤 파일을 대상으로 마이그레이션을 진행할까요?",
            options: [
              ...(isTsconfigAvailable && [pathUnavailableTsconfigOption]),
              {
                // FIXME: 확장자
                label: "현재 폴더에서 발견된 모든 .js, .jsx, .ts, .tsx",
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
      });

      console.log(group);
    });
};
