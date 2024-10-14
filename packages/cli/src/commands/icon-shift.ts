import { z } from "zod";

import type { CAC } from "cac";

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
    .option("--path <path>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .example("seed-design icon-shift")
    .action((opts) => {
      const options = iconShiftOptionsSchema.parse({ ...opts });

      console.log("options.path", options.path);

      console.log("iconShiftCommand");
    });
};
