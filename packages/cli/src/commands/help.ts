import type { CAC } from "cac";

export const helpCommand = (cli: CAC) => {
  cli.command("help", "display help").action(() => {
    console.log("help");
  });
};
