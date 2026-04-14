import pc from "picocolors";
import type { CheckResult, DepResult, LintResult } from "@kontext/core";

export function renderDepsTree(filePath: string, deps: DepResult[]): string {
  const lines: string[] = [];
  lines.push(pc.bold(filePath));

  for (let i = 0; i < deps.length; i++) {
    const dep = deps[i]!;
    const isLast = i === deps.length - 1;
    const prefix = isLast ? "└─" : "├─";
    const existsIcon = dep.exists ? pc.green("●") : pc.red("○");

    let label = "";
    if (dep.generated) {
      label = `${pc.cyan("[auto]")} ${dep.path}`;
      if (dep.command) {
        label += ` ${pc.dim(`→ ${dep.command}`)}`;
      }
    } else {
      label = dep.path;
      if (dep.reason) {
        label += ` ${pc.dim(`— ${dep.reason}`)}`;
      }
    }

    lines.push(`${prefix} ${existsIcon} ${label}`);
  }

  return lines.join("\n");
}

export function renderCheckResults(results: CheckResult[]): string {
  const lines: string[] = [];

  // definedBy별로 그룹핑
  const bySource = new Map<string, CheckResult[]>();
  for (const result of results) {
    const key = result.definedBy;
    const list = bySource.get(key) ?? [];
    list.push(result);
    bySource.set(key, list);
  }

  for (const [definedBy, group] of bySource) {
    lines.push(pc.dim(`── ${definedBy} ──`));

    for (const result of group) {
      if (result.missing.length === 0) {
        lines.push(`${pc.green("✅")} ${result.source}: ${result.existing}/${result.total}`);
      } else {
        lines.push(
          `${pc.yellow("⚠️")}  ${result.source}: ${result.existing}/${result.total} — missing:`,
        );
        for (const m of result.missing) {
          lines.push(`   ${pc.dim("└─")} ${pc.red(m)}`);
        }
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

export function renderDepsJson(deps: DepResult[]): string {
  return JSON.stringify(deps, null, 2);
}

const LAYER_LABELS: Record<string, string> = {
  naming: "naming",
  import: "import",
  "co-change": "co-change",
};

export function renderLintResults(result: LintResult): string {
  const lines: string[] = [];

  if (result.suggestions.length > 0) {
    lines.push(pc.bold("Discovered relationships:"));
    lines.push("");

    // 레이어별 그룹핑
    for (const layer of ["naming", "import", "co-change"] as const) {
      const items = result.suggestions.filter((s) => s.layer === layer);
      if (items.length === 0) continue;

      lines.push(pc.cyan(`  [${LAYER_LABELS[layer]}] ${items.length} suggestions`));
      for (const item of items.slice(0, 10)) {
        const conf = `${(item.confidence * 100).toFixed(0)}%`;
        lines.push(`  ${pc.dim("├─")} ${item.source} ${pc.dim("↔")} ${item.target}`);
        lines.push(`  ${pc.dim("│")}  ${pc.dim(item.detail)} ${pc.dim(`(${conf})`)}`);
      }
      if (items.length > 10) {
        lines.push(`  ${pc.dim(`└─ ... and ${items.length - 10} more`)}`);
      }
      lines.push("");
    }
  } else {
    lines.push(pc.green("No undeclared relationships found."));
  }

  if (result.staleWarnings.length > 0) {
    lines.push(pc.bold("Stale relationships:"));
    lines.push("");
    for (const warn of result.staleWarnings.slice(0, 10)) {
      lines.push(`  ${pc.yellow("⚠")} ${warn.source} ${pc.dim("→")} ${warn.target}`);
      lines.push(`    ${pc.dim(warn.reason)}`);
    }
    if (result.staleWarnings.length > 10) {
      lines.push(`  ${pc.dim(`... and ${result.staleWarnings.length - 10} more`)}`);
    }
  }

  return lines.join("\n");
}
