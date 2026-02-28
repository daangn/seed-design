"use client";

import { ComponentPreview } from "@/components/component-preview";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Suspense } from "react";

interface ToolResultRendererProps {
  toolName: string;
  input: Record<string, unknown>;
  state: string;
}

export function ToolResultRenderer({ toolName, input, state }: ToolResultRendererProps) {
  // 아직 입력이 완전하지 않으면 로딩 표시
  if (state === "input-streaming") {
    return (
      <div className="my-1 flex items-center gap-2 text-xs text-fd-muted-foreground">
        <span className="inline-block size-3 rounded-full border-2 border-fd-muted-foreground border-t-transparent animate-spin" />
        처리 중...
      </div>
    );
  }

  switch (toolName) {
    case "showComponentExample":
      if (typeof input.name !== "string") {
        return <div className="my-1 text-xs text-fd-muted-foreground">잘못된 미리보기 입력입니다.</div>;
      }
      return (
        <div className="my-2 rounded-lg border border-fd-border overflow-hidden">
          <div className="px-3 py-1.5 bg-fd-muted text-xs font-medium text-fd-muted-foreground border-b border-fd-border">
            컴포넌트 미리보기
          </div>
          <Suspense
            fallback={
              <div className="flex items-center justify-center p-8 text-sm text-fd-muted-foreground">
                로딩 중...
              </div>
            }
          >
            <div className="min-h-32 p-4">
              <ComponentPreview name={input.name} />
            </div>
          </Suspense>
        </div>
      );

    case "showInstallation": {
      if (typeof input.name !== "string") {
        return <div className="my-1 text-xs text-fd-muted-foreground">잘못된 설치 입력입니다.</div>;
      }
      const componentName = input.name;
      return (
        <div className="my-2 rounded-lg border border-fd-border overflow-hidden">
          <div className="px-3 py-1.5 bg-fd-muted text-xs font-medium text-fd-muted-foreground border-b border-fd-border">
            설치 방법: {componentName}
          </div>
          <div className="p-3 text-sm">
            <DynamicCodeBlock
              lang="bash"
              code={`npx @seed-design/cli@latest add ${componentName}`}
            />
          </div>
        </div>
      );
    }

    case "showCodeBlock":
      if (typeof input.code !== "string") {
        return <div className="my-1 text-xs text-fd-muted-foreground">코드 블록 입력이 올바르지 않습니다.</div>;
      }
      return (
        <div className="my-2">
          {typeof input.title === "string" && (
            <div className="text-xs font-medium text-fd-muted-foreground mb-1">{input.title}</div>
          )}
          <DynamicCodeBlock lang={typeof input.language === "string" ? input.language : "tsx"} code={input.code} />
        </div>
      );

    default:
      // MCP 서버사이드 도구: 실행 중이면 로딩 표시
      if (state === "input-available") {
        return (
          <div className="my-1 flex items-center gap-2 text-xs text-fd-muted-foreground">
            <span className="inline-block size-3 rounded-full border-2 border-fd-muted-foreground border-t-transparent animate-spin" />
            문서 검색 중...
          </div>
        );
      }
      return null;
  }
}
