import { join } from "node:path";
import {
  applyCapturedChangesetsVersionPolicy,
  captureChangesetsVersionPolicy,
} from "./trusted-changesets-version";

async function run(command: string[]): Promise<void> {
  console.log(`$ ${command.join(" ")}`);
  const child = Bun.spawn(command, { stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`${command.join(" ")} 명령이 ${exitCode}로 실패했습니다.`);
}

const repositoryPath = process.cwd();
const changesetsCliPath = join(repositoryPath, "node_modules", "@changesets", "cli", "bin.js");
const policy = await captureChangesetsVersionPolicy(repositoryPath, changesetsCliPath, "HEAD");
await run(["bun", "version"]);
await applyCapturedChangesetsVersionPolicy(repositoryPath, policy);
await run(["bun", "rootage:build"]);
await run(["bun", "install"]);
await run(["bun", "rootage:generate"]);
