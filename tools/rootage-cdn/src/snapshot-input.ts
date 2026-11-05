import { appendFile } from "node:fs/promises";
import {
  createRootageSnapshotVersion,
  hasRootageChanges,
  writeRootageSnapshotVersion,
} from "./snapshot";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

async function git(args: string[]): Promise<string> {
  const process = Bun.spawn({ cmd: ["git", ...args], stdout: "pipe", stderr: "inherit" });
  const output = await new Response(process.stdout).text();
  if ((await process.exited) !== 0) throw new Error(`git ${args.join(" ")} 실행에 실패했습니다.`);
  return output;
}

async function output(values: Record<string, string>): Promise<void> {
  const lines = Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `${lines}\n`);
  console.log(lines);
}

const command = Bun.argv[2];
const sourceSha = required("ROOTAGE_SOURCE_SHA");

if (command === "detect") {
  const baseSha = required("ROOTAGE_BASE_SHA");
  const changedFiles = (
    await git(["diff", "--name-only", "-z", "--no-renames", `${baseSha}...${sourceSha}`])
  )
    .split("\0")
    .filter(Boolean);
  await output({ changed: String(hasRootageChanges(changedFiles)) });
} else if (command === "prepare") {
  if ((await git(["rev-parse", "HEAD"])).trim() !== sourceSha) {
    throw new Error("checkout HEAD가 승인된 Rootage snapshot source SHA와 다릅니다.");
  }
  const version = createRootageSnapshotVersion(required("ROOTAGE_PR_NUMBER"), sourceSha);
  await writeRootageSnapshotVersion("packages/rootage/package.json", version);
  await output({ version });
} else {
  throw new Error(`지원하지 않는 Rootage snapshot 입력 명령입니다: ${command ?? ""}`);
}
