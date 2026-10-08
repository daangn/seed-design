import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { baseUrl } from "@/app/metadata";
import { getChangelogLlmData } from "@/lib/changelog-llms";
import { buildChangelogLlmOutputFiles } from "@/lib/changelog-llms-output";
import { CHANGELOG_PLATFORMS } from "@/lib/changelog-platform";

const MAX_WRITE_CONCURRENCY = 32;

async function writeOutputFiles(
  outputDir: string,
  files: ReturnType<typeof buildChangelogLlmOutputFiles>,
): Promise<void> {
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < files.length) {
      const file = files[nextIndex++];
      if (!file) return;

      const targetPath = path.join(outputDir, file.path);
      await mkdir(path.dirname(targetPath), { recursive: true });
      await writeFile(targetPath, file.content, "utf-8");
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(MAX_WRITE_CONCURRENCY, files.length) }, () => worker()),
  );
}

async function main() {
  const startedAt = performance.now();
  const outputDir = path.resolve(process.cwd(), "out");
  await Promise.all(
    CHANGELOG_PLATFORMS.flatMap((platform) => [
      rm(path.join(outputDir, `llms/${platform}/updates/changelog`), {
        recursive: true,
        force: true,
      }),
      rm(path.join(outputDir, `llms/${platform}/updates/changelog.txt`), { force: true }),
    ]),
  );

  const platformFiles = await Promise.all(
    CHANGELOG_PLATFORMS.map(async (platform) => {
      const data = await getChangelogLlmData(platform);
      return buildChangelogLlmOutputFiles(data, baseUrl);
    }),
  );
  const files = platformFiles.flat();
  await writeOutputFiles(outputDir, files);

  console.log(
    `[changelog-llms] Generated ${files.length} file(s) in ${Math.round(performance.now() - startedAt)}ms`,
  );
}

await main();
