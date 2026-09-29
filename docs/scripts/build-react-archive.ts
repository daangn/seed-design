import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertReactArchiveSource, createArchivePaths } from "../lib/docs-archive";
import { exportReactArchive } from "./export-react-archive";

const docsDirectory = fileURLToPath(new URL("..", import.meta.url));
const version = process.argv[2];
if (!version)
  throw new Error("Specify the archive channel explicitly, for example build:archive:react 2.0");
createArchivePaths(version);
const reactPackage = JSON.parse(
  await readFile(path.join(docsDirectory, "../packages/react/package.json"), "utf8"),
);
assertReactArchiveSource(version, reactPackage.version);
const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], { cwd: docsDirectory });
if (revision.exitCode !== 0) throw new Error("Cannot identify archive source commit");
const sourceSha = revision.stdout.toString().trim();
const status = Bun.spawnSync(["git", "status", "--porcelain", "--untracked-files=normal"], {
  cwd: docsDirectory,
});
if (status.exitCode !== 0) throw new Error("Cannot identify archive source state");
const sourceDirty = status.stdout.toString().trim().length > 0;
const build = Bun.spawn(["bun", "run", "build"], {
  cwd: docsDirectory,
  env: {
    ...process.env,
    NEXT_PUBLIC_REACT_ARCHIVE_VERSION: version,
    SEED_DOCS_SOURCE_REF: sourceSha,
  },
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
if ((await build.exited) !== 0)
  throw new Error("Archive build failed; existing archive output was not replaced");
console.log(await exportReactArchive({ docsDirectory, version, sourceSha, sourceDirty }));
