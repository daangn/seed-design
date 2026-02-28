"use client";

import { ComponentPreview } from "@/components/component-preview";
import Link from "next/link";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { ProgressCircle } from "seed-design/ui/progress-circle";

interface ToolResultRendererProps {
  toolName: string;
  input: Record<string, unknown>;
  state: string;
  output?: unknown;
}

interface RelatedLink {
  title: string;
  url: string;
  href: string;
}

const INSTALL_COMMANDS = [
  { manager: "npm", commandPrefix: "npx" },
  { manager: "yarn", commandPrefix: "yarn dlx" },
  { manager: "pnpm", commandPrefix: "pnpm dlx" },
  { manager: "bun", commandPrefix: "bunx" },
] as const;

function ToolLoading({ label }: { label: string }) {
  return (
    <div className="my-1 flex items-center gap-2 text-xs text-fd-muted-foreground">
      <ProgressCircle size="24" value={undefined} />
      {label}
    </div>
  );
}

function getRelatedLinks(output: unknown): RelatedLink[] {
  if (!output || typeof output !== "object") return [];

  const links = (output as { links?: unknown }).links;
  if (!Array.isArray(links)) return [];

  return links
    .map((link) => {
      if (!link || typeof link !== "object") return null;
      const title = (link as { title?: unknown }).title;
      const url = (link as { url?: unknown }).url;
      if (typeof title !== "string" || typeof url !== "string") return null;
      try {
        const parsed = new URL(url);
        const isSeedDomain =
          parsed.hostname === "seed-design.io" || parsed.hostname === "www.seed-design.io";

        if (!isSeedDomain) {
          return null;
        }

        return {
          title,
          url,
          href: `${parsed.pathname}${parsed.search}${parsed.hash}`,
        };
      } catch {
        return null;
      }
    })
    .filter((link): link is RelatedLink => link !== null);
}

function getToolOutputCode(output: unknown): { code: string; language: string } | null {
  if (!output || typeof output !== "object") return null;

  const code = (output as { code?: unknown }).code;
  if (typeof code !== "string") return null;

  const language = (output as { language?: unknown }).language;
  return {
    code,
    language: typeof language === "string" ? language : "tsx",
  };
}

export function ToolResultRenderer({ toolName, input, state, output }: ToolResultRendererProps) {
  // 아직 입력이 완전하지 않으면 로딩 표시
  if (state === "input-streaming") {
    return <ToolLoading label="처리 중..." />;
  }

  switch (toolName) {
    case "showComponentExample": {
      if (typeof input.name !== "string") {
        return (
          <div className="my-1 text-xs text-fd-muted-foreground">잘못된 미리보기 입력입니다.</div>
        );
      }

      const outputCode = getToolOutputCode(output);
      const inlineCode = typeof input.code === "string" ? input.code : null;
      const code = outputCode?.code ?? inlineCode;
      const language = outputCode?.language ?? "tsx";
      const isCodeLoading = state === "input-available" && !code;

      return (
        <div className="my-2">
          <Tabs items={["미리보기", "코드"]}>
            <Tab value="미리보기">
              <div className="flex min-h-80">
                <ComponentPreview name={input.name} />
              </div>
            </Tab>
            <Tab value="코드">
              {code && <DynamicCodeBlock lang={language} code={code} />}
              {isCodeLoading && <ToolLoading label="예시 코드를 불러오는 중..." />}
              {!code && !isCodeLoading && (
                <div className="text-xs text-fd-muted-foreground">예시 코드를 찾지 못했어요.</div>
              )}
            </Tab>
          </Tabs>
        </div>
      );
    }

    case "showInstallation": {
      if (typeof input.name !== "string") {
        return <div className="my-1 text-xs text-fd-muted-foreground">잘못된 설치 입력입니다.</div>;
      }
      const componentName = input.name;

      return (
        <div className="my-2">
          <Tabs items={INSTALL_COMMANDS.map(({ manager }) => manager)}>
            {INSTALL_COMMANDS.map(({ manager, commandPrefix }) => (
              <Tab key={manager} value={manager}>
                <DynamicCodeBlock
                  lang="bash"
                  code={`${commandPrefix} @seed-design/cli@latest add ${componentName}`}
                />
              </Tab>
            ))}
          </Tabs>
        </div>
      );
    }

    case "showCodeBlock":
      if (typeof input.code !== "string") {
        return (
          <div className="my-1 text-xs text-fd-muted-foreground">
            코드 블록 입력이 올바르지 않습니다.
          </div>
        );
      }
      return (
        <div className="my-2">
          {typeof input.title === "string" && (
            <div className="text-xs font-medium text-fd-muted-foreground mb-1">{input.title}</div>
          )}
          <DynamicCodeBlock
            lang={typeof input.language === "string" ? input.language : "tsx"}
            code={input.code}
          />
        </div>
      );

    case "findRelatedLinks": {
      if (state === "input-available") {
        return <ToolLoading label="관련 링크 찾는 중..." />;
      }

      const links = getRelatedLinks(output);
      if (links.length === 0) {
        return null;
      }

      return (
        <ul className="my-2 list-disc pl-5 text-sm space-y-2">
          {links.map((link) => (
            <li key={link.url}>
              <div className="space-y-0.5">
                <Link href={link.href} className="text-fd-primary hover:underline break-all">
                  {link.title}
                </Link>
                <div className="text-xs text-fd-muted-foreground break-all">{link.url}</div>
              </div>
            </li>
          ))}
        </ul>
      );
    }

    default:
      // MCP 서버사이드 도구: 실행 중이면 로딩 표시
      if (state === "input-available") {
        return <ToolLoading label="문서 검색 중..." />;
      }
      return null;
  }
}
