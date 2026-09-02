/**
 * Resolves a chromatic.com URL into the build behind it, the tests that changed,
 * and the published Storybook of both sides of the comparison.
 *
 * Prints a summary and, with --out, writes the same data as context.json.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pool, query, tokenExpiry } from "./api";

interface BuildSummary {
  id: string;
  number: number;
  branch: string;
  commit: string;
  createdAt: string;
  status: string;
  result?: string;
  webUrl?: string;
  storybookUrl?: string;
}

interface TestSummary {
  id: string;
  status: string;
  result: string | null;
  webUrl: string;
  story: {
    storyId: string;
    name: string;
    storybookUrl: string | null;
    component: { name: string } | null;
  } | null;
  mode: { name: string } | null;
  parameters: { viewport: { name: string; width: number } } | null;
  baseline: { id: string; story: { storybookUrl: string | null } | null } | null;
}

const BUILD_FIELDS = `
  id number branch commit createdAt status
  ... on PublishedBuild { storybookUrl }
  ... on StartedBuild { webUrl storybookUrl }
  ... on CompletedBuild { result webUrl storybookUrl }
`;

const TEST_FIELDS = `
  id status result webUrl
  story { storyId name storybookUrl component { name } }
  mode { name }
  parameters { viewport { name width } }
  baseline { id story { storybookUrl } }
`;

/**
 * `lastBuild` returns only the newest build matching its filters, so a status
 * filter is the one lever that reaches a build a newer one has superseded.
 */
const BUILD_STATUSES = ["ACCEPTED", "BROKEN", "CANCELLED", "DENIED", "FAILED", "PASSED", "PENDING"];

function parseTarget(input: string) {
  const url = new URL(input);
  const appId = url.searchParams.get("appId");
  if (!appId) throw new Error(`No appId in URL: ${input}`);

  const number = url.searchParams.get("number");
  if (number) return { appId, buildNumber: Number(number), testId: undefined };

  const testId = url.searchParams.get("id");
  if (testId) return { appId, buildNumber: undefined, testId };

  throw new Error(
    `URL carries neither a build number nor a test id — expected a chromatic.com /build or /test link: ${input}`,
  );
}

const lastBuild = (appId: string, filter: string) =>
  query<{ project: { lastBuild: BuildSummary | null } | null }>(
    `query($p: ID!) { project(id: $p) { lastBuild${filter ? `(${filter})` : ""} { ${BUILD_FIELDS} } } }`,
    { p: appId },
  ).then((data) => data.project?.lastBuild ?? null);

const fetchTests = (buildId: string, filter: string, fields = TEST_FIELDS) =>
  query<{ build: { tests?: { nodes: TestSummary[] } } | null }>(
    `query($id: ID!) {
      build(id: $id) {
        ... on StartedBuild { tests(${filter}) { nodes { ${fields} } } }
        ... on CompletedBuild { tests(${filter}) { nodes { ${fields} } } }
      }
    }`,
    { id: buildId },
  ).then((data) => data.build?.tests?.nodes ?? []);

/**
 * Walks the builds reachable through `lastBuild`, widening in three steps and
 * handing every batch to `probe` so the search stops at the cheapest level that
 * answers. Most lookups are about a build someone is looking at right now,
 * which the first level already covers.
 */
async function searchBuilds<T>(
  appId: string,
  probe: (candidates: BuildSummary[]) => Promise<T | undefined>,
) {
  const found = new Map<string, BuildSummary>();

  const widen = async (builds: (BuildSummary | null)[]) => {
    for (const build of builds) if (build) found.set(build.id, build);

    return probe([...found.values()]);
  };

  const latest = await widen([await lastBuild(appId, "")]);
  if (latest !== undefined) return latest;

  const { project } = await query<{ project: { branchNames: string[] } | null }>(
    "query($p: ID!) { project(id: $p) { branchNames(limit: 50) } }",
    { p: appId },
  );
  const branches = project?.branchNames ?? [];

  const byBranch = await widen(
    await pool(branches, (branch) => lastBuild(appId, `branches: [${JSON.stringify(branch)}]`)),
  );
  if (byBranch !== undefined) return byBranch;

  return widen(
    await pool(
      branches.flatMap((branch) => BUILD_STATUSES.map((status) => ({ branch, status }))),
      ({ branch, status }) =>
        lastBuild(appId, `branches: [${JSON.stringify(branch)}], statuses: [${status}]`),
    ),
  );
}

/**
 * Probe that finds the build holding a given test.
 *
 * There is no root query for a test, so the only route is to walk builds and
 * look inside. Chromatic ids are Mongo ObjectIds whose leading four bytes are a
 * creation timestamp, and a test is created moments after its build, so trying
 * candidates in order of how close their creation time sits to the test's
 * usually lands the answer on the first probe.
 */
function testProbe(testId: string) {
  const testTime = Number.parseInt(testId.slice(0, 8), 16) * 1000;
  const probed = new Set<string>();

  return async (candidates: BuildSummary[]) => {
    const fresh = candidates
      .filter((build) => !probed.has(build.id))
      .sort(
        (a, b) =>
          Math.abs(Date.parse(a.createdAt) - testTime) -
          Math.abs(Date.parse(b.createdAt) - testTime),
      );

    for (const build of fresh) {
      probed.add(build.id);

      // A build carries hundreds of tests, and only the one build that matches
      // is worth pulling in full.
      const ids = await fetchTests(build.id, "first: 1000", "id");
      if (!ids.some((test) => test.id.endsWith(testId))) continue;

      const test = (await fetchTests(build.id, "first: 1000")).find((item) =>
        item.id.endsWith(testId),
      );

      return { build, test: test ?? null };
    }

    return undefined;
  };
}

async function resolveComparison(appId: string, against: string | undefined) {
  if (!against) return null;

  if (against.startsWith("http")) {
    const { buildNumber } = parseTarget(against);

    return searchBuilds(appId, async (candidates) =>
      candidates.find((item) => item.number === buildNumber),
    );
  }

  if (/^\d+$/.test(against)) {
    return searchBuilds(appId, async (candidates) =>
      candidates.find((item) => item.number === Number(against)),
    );
  }

  const id = against.replace(/^Build:/i, "");
  if (/^[0-9a-f]{24}$/i.test(id)) {
    return searchBuilds(appId, async (candidates) =>
      candidates.find((item) => item.id.endsWith(id)),
    );
  }

  return lastBuild(appId, `branches: [${JSON.stringify(against)}]`);
}

const storybookHost = (url: string | null | undefined) => (url ? new URL(url).host : null);

function describeTest(test: TestSummary) {
  const component = test.story?.component?.name ?? "?";
  const mode = test.mode?.name ?? test.parameters?.viewport.name ?? "";

  return `${component} / ${test.story?.name ?? "?"}${mode ? ` [${mode}]` : ""}`;
}

async function main() {
  const [target, ...rest] = process.argv.slice(2);
  if (!target) {
    throw new Error(
      "Usage: bun resolve.ts <chromatic-url> [--against <branch|number|url>] [--out <dir>]",
    );
  }

  const flag = (name: string) => {
    const index = rest.indexOf(name);
    return index === -1 ? undefined : rest[index + 1];
  };

  const expiry = tokenExpiry();
  if (expiry && expiry.getTime() < Date.now()) {
    throw new Error(
      `CHROMATIC_TOKEN expired on ${expiry.toISOString()}. See references/token.md to refresh it.`,
    );
  }

  const { appId, buildNumber, testId } = parseTarget(target);

  const resolved = testId
    ? await searchBuilds(appId, testProbe(testId))
    : await searchBuilds(appId, async (candidates) => {
        const build = candidates.find((item) => item.number === buildNumber);

        return build ? { build, test: null } : undefined;
      });

  if (!resolved) {
    throw new Error(
      "That build is not reachable through lastBuild, which only returns the newest build per branch and status. It has most likely been superseded — ask which branch or PR it came from, or pass a reachable build with --against.",
    );
  }

  const { build } = resolved;
  const changed = await fetchTests(build.id, "statuses: [PENDING], first: 200");
  const focus = resolved.test ?? changed[0] ?? null;

  const comparison = await resolveComparison(appId, flag("--against"));

  const baselineStorybook = focus?.baseline?.story?.storybookUrl ?? null;
  const context = {
    build,
    changedCount: changed.length,
    changed: changed.map((test) => ({ ...test, label: describeTest(test) })),
    focus: focus && { ...focus, label: describeTest(focus) },
    compare: {
      head: {
        storybookUrl: build.storybookUrl ?? null,
        host: storybookHost(build.storybookUrl),
      },
      base: comparison
        ? {
            storybookUrl: comparison.storybookUrl ?? null,
            host: storybookHost(comparison.storybookUrl),
            source: `build ${comparison.number} (${comparison.branch})`,
          }
        : {
            storybookUrl: baselineStorybook,
            host: storybookHost(baselineStorybook),
            source: "Test.baseline",
          },
    },
  };

  console.log(
    [
      `build ${build.number}  ${build.status}${build.result ? `/${build.result}` : ""}`,
      `branch ${build.branch}  commit ${build.commit.slice(0, 9)}`,
      `changed tests: ${changed.length}`,
      ...changed.slice(0, 20).map((test) => `  - ${describeTest(test)}`),
      changed.length > 20 ? `  … ${changed.length - 20} more` : "",
      "",
      `head storybook: ${context.compare.head.host ?? "(none)"}`,
      `base storybook: ${context.compare.base.host ?? "(none)"}  [${context.compare.base.source}]`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  const out = flag("--out");
  if (!out) return;

  await mkdir(out, { recursive: true });
  await writeFile(join(out, "context.json"), `${JSON.stringify(context, null, 2)}\n`);
  console.log(`\nwrote ${join(out, "context.json")}`);
}

await main();
