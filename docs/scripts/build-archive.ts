import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ARCHIVE_SOURCE_PACKAGES,
  assertArchiveSource,
  parseArchiveChannel,
} from "../lib/docs-archive";
import { exportArchive } from "./export-archive";

const docsDirectory = fileURLToPath(new URL("..", import.meta.url));
const [platform, version] = process.argv.slice(2);
if (!platform || !version)
  throw new Error("Specify the archive channel explicitly, for example build:archive:react v2");
const channel = `${platform}/${version}`;
const sourcePackage = JSON.parse(
  await readFile(
    path.join(docsDirectory, "..", ARCHIVE_SOURCE_PACKAGES[parseArchiveChannel(channel).platform]),
    "utf8",
  ),
);
assertArchiveSource(channel, sourcePackage.version);
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
    NEXT_PUBLIC_DOCS_ARCHIVE_CHANNEL: channel,
    SEED_DOCS_SOURCE_REF: sourceSha,
  },
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});
if ((await build.exited) !== 0)
  throw new Error("Archive build failed; existing archive output was not replaced");
console.log(await exportArchive({ docsDirectory, channel, sourceSha, sourceDirty }));
