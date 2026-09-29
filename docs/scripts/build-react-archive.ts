import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createArchivePaths } from "../lib/docs-archive";
import { exportReactArchive } from "./export-react-archive";

const docsDirectory = fileURLToPath(new URL("..", import.meta.url));
const version = process.argv[2] ?? "v2";
createArchivePaths(version);
const reactPackage = JSON.parse(
  await readFile(path.join(docsDirectory, "../packages/react/package.json"), "utf8"),
);
if (`v${reactPackage.version.split(".")[0]}` !== version) {
  throw new Error(
    `Build ${version} from its own release branch, not React ${reactPackage.version}`,
  );
}
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
