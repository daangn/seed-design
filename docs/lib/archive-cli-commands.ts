import { createArchivePaths } from "./docs-archive";

// Only CLI commands that read a registry need an archive source. Preserve explicit custom sources.
export function archiveCliCommands(code: string, version: string): string {
  if (!version) return code;
  const baseUrl = `https://seed-design.io${createArchivePaths(version).prefix}`;
  return code
    .split("\n")
    .map((line) => {
      if (
        !/(?:npx|pnpm dlx|yarn dlx|bunx|bun x)\s+@seed-design\/cli(?:@\S+)?\s+(?:add-all|add|compat|docs)\b/.test(
          line,
        )
      )
        return line;
      line = line.replace(
        /https:\/\/(?:v?1-([012]))\.seed-design\.(?:io|pages\.dev)(?=[\s/]|$)/g,
        (_, minor: string) => `https://seed-design.io/react/v1.${minor}`,
      );
      if (
        /(?:--baseUrl(?:[=\s]|$)|(?:^|\s)-u(?:[=\s]|$)|--seed-react-version(?:[=\s]|$))/.test(line)
      )
        return line;
      return line.replace(
        /(@seed-design\/cli(?:@\S+)?\s+(?:add-all|add|compat|docs))\b/,
        `$1 --baseUrl ${baseUrl}`,
      );
    })
    .join("\n");
}
