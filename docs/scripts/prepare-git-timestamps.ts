import path from "node:path";
import { prepareMarkdownGitTimestampsManifest } from "@/lib/git-timestamps";

const docsDirectory = path.resolve(import.meta.dir, "..");
const startedAt = performance.now();
const count = await prepareMarkdownGitTimestampsManifest(
  path.join(docsDirectory, "content"),
  path.join(docsDirectory, ".cache/git-timestamps.json"),
);

console.log(
  `Git 타임스탬프 매니페스트 생성 완료 (${Math.round(performance.now() - startedAt)}ms): ${count}개`,
);
