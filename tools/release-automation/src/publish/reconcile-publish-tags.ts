import {
  assertExactRegistryDistTags,
  assertExactRegistryIntegrities,
  commitsFromLsRemote,
  fetchRegistryDocuments,
  inspectRegistryGitHeads,
  packageTag,
  parsePublishDistTag,
  parsePublishPackages,
  planTagReconciliation,
  type RegistryPackageDocument,
} from "./publish-state";

const repositoryPath = process.env.PUBLISH_REPOSITORY_PATH ?? process.cwd();

async function run(
  command: string[],
  allowMissing = false,
  authenticate = false,
): Promise<string | null> {
  const token = authenticate ? process.env.GH_TOKEN : undefined;
  const authenticatedEnvironment = token
    ? {
        ...process.env,
        GIT_CONFIG_COUNT: "1",
        GIT_CONFIG_KEY_0: "http.https://github.com/.extraheader",
        GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString("base64")}`,
      }
    : process.env;
  const child = Bun.spawn(command, {
    cwd: repositoryPath,
    env: authenticatedEnvironment,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  if (exitCode === 0) return stdout.trim();
  if (allowMissing && exitCode === 1) return null;
  throw new Error(`${command.join(" ")} 실패:\n${stderr}`);
}

const mode = Bun.argv[2];
if (mode !== "check" && mode !== "verify" && mode !== "write") {
  throw new Error("tag reconciliation mode는 check, verify 또는 write여야 합니다.");
}

const mergeSha = process.env.PUBLISH_MERGE_SHA ?? "";
const packageJson = process.env.PUBLISH_PACKAGES ?? "";
const packages = parsePublishPackages(packageJson);
const distTag = parsePublishDistTag(process.env.PUBLISH_DIST_TAG ?? "");
if (packages.some((item) => item.integrity === undefined)) {
  throw new Error("tag reconciliation에는 모든 package의 승인 npm integrity가 필요합니다.");
}
const mergeCommit = await run(["git", "rev-parse", "--verify", `${mergeSha}^{commit}`]);
if (mergeCommit !== mergeSha) throw new Error("승인 merge commit object를 찾지 못했습니다.");

const registryUrl = process.env.NPM_REGISTRY_URL ?? "https://registry.npmjs.org";
const registryFixture = process.env.NPM_REGISTRY_FIXTURE_JSON;
if (registryFixture && process.env.NODE_ENV !== "test") {
  throw new Error("registry fixture는 test 환경에서만 사용할 수 있습니다.");
}
const retryDelays = [0, 1_000, 2_000, 4_000, 8_000];
for (const [attempt, delay] of retryDelays.entries()) {
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  const documents = registryFixture
    ? new Map<string, RegistryPackageDocument | null>(
        Object.entries(
          JSON.parse(registryFixture) as Record<string, RegistryPackageDocument | null>,
        ),
      )
    : await fetchRegistryDocuments(packages, { registryUrl });
  const { missing, distTagMismatches, integrityMismatches } = inspectRegistryGitHeads(
    packages,
    documents,
    mergeSha,
    distTag,
  );
  if (mode === "check") {
    assertExactRegistryDistTags(distTagMismatches);
    assertExactRegistryIntegrities(integrityMismatches);
    break;
  }
  if (missing.length === 0 && distTagMismatches.length === 0 && integrityMismatches.length === 0) {
    break;
  }
  if (attempt === retryDelays.length - 1) {
    const pending = [
      ...missing.map((item) => `${item.name}@${item.version} version`),
      ...distTagMismatches.map(
        ({ package: item, tag }) => `${item.name}@${item.version} dist-tag '${tag}'`,
      ),
      ...integrityMismatches.map(
        ({ package: item }) => `${item.name}@${item.version} npm integrity`,
      ),
    ];
    throw new Error(`게시 후 npm registry 계약이 확인되지 않았습니다: ${pending.join(", ")}`);
  }
  const pending = [
    ...missing.map((item) => `${item.name}@${item.version} version`),
    ...distTagMismatches.map(
      ({ package: item, tag }) => `${item.name}@${item.version} dist-tag '${tag}'`,
    ),
    ...integrityMismatches.map(({ package: item }) => `${item.name}@${item.version} npm integrity`),
  ];
  console.log(
    `npm registry 반영을 기다립니다 (${attempt + 1}/${retryDelays.length - 1}): ${pending.join(", ")}`,
  );
}

const tags = packages.map(packageTag);
for (const tag of tags) {
  await run(["git", "check-ref-format", `refs/tags/${tag}`]);
}
const patterns = tags.flatMap((tag) => [`refs/tags/${tag}`, `refs/tags/${tag}^{}`]);
const remoteOutput = patterns.length
  ? ((await run(["git", "ls-remote", "--tags", "origin", ...patterns], false, true)) ?? "")
  : "";
const remoteCommits = commitsFromLsRemote(remoteOutput, tags);

const refsToPush: string[] = [];
for (const tag of tags) {
  const ref = `refs/tags/${tag}`;
  const remoteCommit = remoteCommits.get(tag) ?? null;
  const localCommit = await run(
    ["git", "rev-parse", "--verify", "--quiet", `${ref}^{commit}`],
    true,
  );
  const action = planTagReconciliation(mergeSha, localCommit, remoteCommit);

  if (mode === "check" || mode === "verify" || action === "already-pushed") {
    console.log(`${tag}: ${action}`);
    continue;
  }
  if (action === "create-and-push") {
    await run(["git", "tag", tag, mergeSha]);
  }
  refsToPush.push(ref);
}

if (mode === "write" && refsToPush.length > 0) {
  await run(["git", "push", "--atomic", "origin", ...refsToPush], false, true);
  console.log(`${refsToPush.length}개 package tag를 승인 merge SHA로 게시했습니다.`);
} else if (mode === "write") {
  console.log("모든 package tag가 이미 승인 merge SHA를 가리킵니다.");
}
