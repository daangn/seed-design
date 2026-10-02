import { spawn, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertReactArchiveSource, createArchivePaths } from "../lib/docs-archive";
import { exportReactArchive } from "./export-react-archive";

const docsDirectory = fileURLToPath(new URL("..", import.meta.url));
const version = process.argv[2];
if (!version) throw new Error("Specify the retained channel, for example build:archive:react v1.2");
createArchivePaths(version);
const reactPackage = JSON.parse(
  await readFile(path.join(docsDirectory, "../packages/react/package.json"), "utf8"),
);
assertReactArchiveSource(version, reactPackage.version);
const revision = spawnSync("git", ["rev-parse", "HEAD"], { cwd: docsDirectory });
if (revision.status !== 0) throw new Error("Cannot identify archive source commit");
const sourceSha = revision.stdout.toString().trim();
const status = spawnSync("git", ["status", "--porcelain", "--untracked-files=normal"], {
  cwd: docsDirectory,
});
if (status.status !== 0) throw new Error("Cannot identify archive source state");
const sourceDirty =
  status.stdout.toString().trim().length > 0 || process.env.SEED_DOCS_OFFLINE === "1";
const index = spawnSync("bun", ["scripts/generate-react-archive-index.ts"], {
  cwd: docsDirectory,
  stdio: "inherit",
});
if (index.status !== 0) throw new Error("Archive docs index generation failed");
const build = spawn("bun", ["run", "build"], {
  cwd: docsDirectory,
  env: {
    ...process.env,
    NEXT_PUBLIC_REACT_ARCHIVE_VERSION: version,
    SEED_DOCS_SOURCE_REF: sourceSha,
  },
  stdio: "inherit",
});
const exitCode = await new Promise<number | null>((resolve, reject) => {
  build.once("error", reject);
  build.once("exit", resolve);
});
if (exitCode !== 0)
  throw new Error("Archive build failed; existing archive output was not replaced");
console.log(await exportReactArchive({ docsDirectory, version, sourceSha, sourceDirty }));
