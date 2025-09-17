import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import color from "picocolors";
import { z } from "zod";

import type { Config } from "@/src/utils/get-config";

import type { CAC } from "cac";

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean().optional(),
});

export const initCommand = (cli: CAC) => {
  cli
    .command("init", "seed-design.json 파일 생성")
    .option("-c, --cwd <cwd>", "작업 디렉토리. 기본값은 현재 디렉토리.", {
      default: process.cwd(),
    })
    .option("-y, --yes", "모든 질문에 대해 기본값으로 답변합니다.")
    .action(async (opts) => {
      const highlight = (text: string) => color.cyan(text);
      p.intro(color.bgCyan("seed-design.json 파일 생성"));

      const options = initOptionsSchema.parse(opts);
      const isYesOption = options.yes;
      let config: Config = {
        rsc: false,
        tsx: true,
        path: "./seed-design",
      };

      if (!isYesOption) {
        const group = await p.group(
          {
            tsx: () =>
              p.confirm({
                message: `${highlight("TypeScript")}를 사용중이신가요?`,
                initialValue: true,
              }),
            rsc: () =>
              p.confirm({
                message: `${highlight("React Server Components")}를 사용중이신가요?`,
                initialValue: false,
              }),
            path: () =>
              p.text({
                message: `${highlight("seed-design 폴더")} 경로를 입력해주세요. (기본값은 프로젝트 루트에 생성됩니다.)`,
                initialValue: "./seed-design",
                defaultValue: "./seed-design",
                placeholder: "./seed-design",
              }),
          },
          {
            onCancel: () => {
              p.cancel("작업이 취소됐어요.");
              process.exit(0);
            },
          },
        );

        config = {
          ...group,
        };
      }

      try {
        const { start, stop } = p.spinner();
        start("seed-design.json 파일 생성중...");
        const targetPath = path.resolve(options.cwd, "seed-design.json");
        await fs.writeFile(targetPath, `${JSON.stringify(config, null, 2)}\n`, "utf-8");
        const relativePath = path.relative(process.cwd(), targetPath);
        stop(`seed-design.json 파일이 ${highlight(relativePath)}에 생성됐어요.`);
        p.log.info(color.gray("seed-design add {component} 명령어로 컴포넌트를 추가해보세요!"));
        p.log.info(
          color.gray("seed-design add 명령어로 추가할 수 있는 모든 컴포넌트를 확인해보세요."),
        );
        p.outro("작업이 완료됐어요.");
      } catch (error) {
        p.log.error(`seed-design.json 파일 생성에 실패했어요. ${error}`);
        p.outro(color.bgRed("작업이 취소됐어요."));
        process.exit(1);
      }
    });
};
