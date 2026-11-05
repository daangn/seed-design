export function isAllowedVersionChange(filePath: string): boolean {
  if (filePath.includes("\\")) return false;
  const normalizedPath = filePath;

  if (normalizedPath === "bun.lock" || normalizedPath.startsWith(".changeset/")) {
    return true;
  }

  if (normalizedPath.endsWith("/package.json") || normalizedPath.endsWith("/CHANGELOG.md")) {
    return true;
  }

  return normalizedPath.startsWith("packages/rootage/__generated__/");
}

export function findUnexpectedVersionChanges(filePaths: Iterable<string>): string[] {
  return [...new Set(filePaths)].filter((filePath) => !isAllowedVersionChange(filePath)).sort();
}

async function readGitPaths(args: string[]): Promise<string[]> {
  const process = Bun.spawn({
    cmd: ["git", ...args],
    stdout: "pipe",
    stderr: "inherit",
  });
  const output = Buffer.from(await new Response(process.stdout).arrayBuffer()).toString("utf8");
  const exitCode = await process.exited;

  if (exitCode !== 0) {
    throw new Error(`git ${args.join(" ")} failed with exit code ${exitCode}`);
  }

  return output.split("\0").filter(Boolean);
}

async function main(): Promise<void> {
  const changedFiles = [
    ...(await readGitPaths(["diff", "--name-only", "--no-renames", "-z", "HEAD"])),
    ...(await readGitPaths(["ls-files", "--others", "--exclude-standard", "-z"])),
  ];
  const unexpectedChanges = findUnexpectedVersionChanges(changedFiles);

  if (unexpectedChanges.length > 0) {
    throw new Error(
      [
        "Version command produced changes outside approved package metadata and Rootage version artifacts:",
        ...unexpectedChanges.map((filePath) => `- ${filePath}`),
      ].join("\n"),
    );
  }
}

if (import.meta.main) {
  await main();
}
