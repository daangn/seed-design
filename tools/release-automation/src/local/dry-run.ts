import { appendFile, mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { sha256 } from "../sync/sync";

async function run(command: string[], cwd = process.cwd()): Promise<void> {
  console.log(`$ ${command.join(" ")}`);
  const child = Bun.spawn(command, { cwd, stdout: "inherit", stderr: "inherit" });
  const exitCode = await child.exited;
  if (exitCode !== 0) throw new Error(`${command.join(" ")} 명령이 ${exitCode}로 실패했습니다.`);
}

const temporaryDirectory = await mkdtemp(join(tmpdir(), "seed-release-dry-run-"));
try {
  await run(["bun", "packages:build"]);
  await run(["bun", "rootage:build"]);
  await run(["bun", "rootage:generate"]);
  await run(["bun", "pm", "pack", "--destination", temporaryDirectory], "packages/rootage");

  const archives = (await readdir(temporaryDirectory)).sort();
  if (archives.length !== 1)
    throw new Error(`Rootage archive가 1개여야 합니다: ${archives.join(", ")}`);
  const archive = Bun.file(join(temporaryDirectory, archives[0]));
  const checksum = sha256(new Uint8Array(await archive.arrayBuffer()));
  const result = { archive: archives[0], bytes: archive.size, sha256: checksum };
  console.log(JSON.stringify(result, null, 2));

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    await appendFile(
      summaryPath,
      `## Rootage dry-run\n\n- archive: \`${result.archive}\`\n- bytes: ${result.bytes}\n- sha256: \`${checksum}\`\n`,
    );
  }
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
