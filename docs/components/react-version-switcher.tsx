"use client";

import { IconCheckmarkLine, IconChevronDownLine } from "@karrotmarket/react-monochrome-icon";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "fumadocs-ui/components/ui/popover";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { cva } from "class-variance-authority";

const VERSIONS = [
  { label: "alpha", url: "https://alpha.seed-design.pages.dev/react" },
  { label: "v2.0 (latest)", url: "https://seed-design.io/react" },
  { label: "v1.2", url: "https://v1-2.seed-design.io/react" },
  { label: "v1.1", url: "https://v1-1.seed-design.io/react" },
  { label: "v1.0", url: "https://v1-0.seed-design.io/react" },
] as const satisfies ReadonlyArray<{ label: string; url: string }>;

// NOTE: update CURRENT_VERSION when releasing a new version & keep in release branch
const CURRENT_VERSION: (typeof VERSIONS)[number]["label"] = "v2.0 (latest)";

const itemVariants = cva(
  "text-sm p-2 rounded-lg inline-flex items-center gap-2 hover:text-fd-accent-foreground hover:bg-fd-accent [&_svg]:size-4",
);

// "v2.0 (latest)" → "2.0", "v1.1" → "1.1", "alpha" → undefined
const lineOf = (label: string) => label.match(/(\d+\.\d+)/)?.[1];

// 같은 라인(x.y) 내 버전끼리 패치 오름차순 비교
const cmpPatch = (a: string, b: string) =>
  a.split(".").reduce((acc, n, i) => acc || Number(n) - Number(b.split(".")[i]), 0);

const latestForLine = (data: { versions: Record<string, unknown> }, line: string) =>
  Object.keys(data.versions)
    .filter((v) => v.startsWith(`${line}.`) && !v.includes("-")) // prerelease 제외
    .sort(cmpPatch)
    .at(-1);

type PackageVersions = Record<string, { react?: string; css?: string }>;

export function ReactVersionSwitcher() {
  const [open, setOpen] = useState(false);
  const [pkgVersions, setPkgVersions] = useState<PackageVersions>({});

  const current = VERSIONS.find((v) => v.label === CURRENT_VERSION) ?? VERSIONS[0];

  // 드롭다운을 처음 열 때 npm registry에서 각 라인의 최신 안정 패치를 1회 조회
  useEffect(() => {
    if (!open || Object.keys(pkgVersions).length) return;
    const headers = { Accept: "application/vnd.npm.install-v1+json" }; // 축약 메타데이터
    Promise.all([
      fetch("https://registry.npmjs.org/@seed-design/react", { headers }).then((r) => r.json()),
      fetch("https://registry.npmjs.org/@seed-design/css", { headers }).then((r) => r.json()),
    ])
      .then(([react, css]) => {
        const map: PackageVersions = {};
        for (const { label } of VERSIONS) {
          const line = lineOf(label);
          if (!line) continue; // alpha 등 라인 매칭 안 되는 항목은 스킵
          map[label] = { react: latestForLine(react, line), css: latestForLine(css, line) };
        }
        setPkgVersions(map);
      })
      .catch(() => {}); // 조회 실패 시 버전 숫자만 생략, 셀렉터는 정상 동작
  }, [open, pkgVersions]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={buttonVariants({
          color: "secondary",
          size: "sm",
          className: "gap-1.5 text-xs",
        })}
      >
        <div className="flex grow justify-between items-center">
          {current?.label}
          <IconChevronDownLine className="size-3.5 text-fd-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col overflow-auto">
        {VERSIONS.map((version) => {
          const pkg = pkgVersions[version.label];
          const isCurrent = version === current;
          const content = (
            <>
              <span className="flex flex-col text-start">
                {version.label}
                {pkg && (pkg.react || pkg.css) && (
                  <span className="text-fd-muted-foreground text-xs">
                    react {pkg.react ?? "—"} · css {pkg.css ?? "—"}
                  </span>
                )}
              </span>
              {isCurrent && <IconCheckmarkLine />}
            </>
          );

          return isCurrent ? (
            <div
              aria-current
              key={version.label}
              className={itemVariants({
                className: "text-fd-primary pointer-events-none justify-between",
              })}
            >
              {content}
            </div>
          ) : (
            <a
              target="_blank"
              rel="noreferrer"
              key={version.label}
              href={version.url}
              className={itemVariants({ className: "justify-between" })}
              onClick={() => setOpen(false)}
            >
              {content}
            </a>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
