import type { CAC } from "cac";

export const iconShiftCommand = (cli: CAC) => {
  cli
    .command("add [...components]", "V2 아이콘을 V3 아이콘으로 변환하는 명령어")
    .option("-a, --all", "Add all components", {
      default: false,
    })
    .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .example("seed-design add box-button")
    .example("seed-design add alert-dialog")
    .action(async (components, opts) => {});
};
