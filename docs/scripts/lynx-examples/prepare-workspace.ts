import { DOCS_DIRECTORY, REPOSITORY_DIRECTORY } from "./constants.js";
import { verifyLynxWorkspace } from "./workspace.js";

const build = Bun.spawnSync(
  ["bun", "ultra", "-r", "--build", "--filter", "@seed-design/lynx-react", "build"],
  { cwd: REPOSITORY_DIRECTORY, stdout: "inherit", stderr: "inherit", env: process.env },
);
if (build.exitCode !== 0) process.exit(build.exitCode);
await verifyLynxWorkspace();
console.log(`Lynx workspace 준비를 확인했습니다: ${DOCS_DIRECTORY}`);
