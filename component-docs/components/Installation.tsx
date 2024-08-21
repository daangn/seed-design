import type * as React from "react";
import type { ComponentRegistry } from "@/schemas/registry";
import { Code, Pre, Tabs, Steps } from "nextra/components";

interface InstallationProps {
  registry: ComponentRegistry;
}

const Heading3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl">
    {children}
  </h3>
);

/**
 * @see https://github.com/shuding/nextra/blob/main/packages/nextra/src/components/pre.tsx
 * @type {React.FC<InstallationProps>}
 */
export function Installation({ registry }: InstallationProps) {
  return (
    <Tabs items={["CLI", "Manual"]}>
      <Tabs.Tab>
        <Pre hasCopyCode data-language="sh" data-theme="default">
          <Code lang="sh" data-language="sh" data-theme="default">
            <span className="line">
              <span style={{ color: "var(--shiki-token-function)" }}>npx </span>
              <span style={{ color: "var(--shiki-token-string)" }}>@seed-design/cli@latest </span>
              <span style={{ color: "var(--shiki-token-string)" }}>add </span>
              <span style={{ color: "var(--shiki-token-string)" }}>{registry.name}</span>
            </span>
          </Code>
        </Pre>
      </Tabs.Tab>
      <Tabs.Tab>
        <Steps>
          {registry.dependencies && (
            <>
              <Heading3>의존성 설치</Heading3>
              <Pre hasCopyCode lang="sh" data-language="sh" data-theme="default">
                <Code lang="sh" data-language="sh" data-theme="default">
                  <span className="line">
                    <span style={{ color: "var(--shiki-token-function)" }}>npm </span>
                    <span style={{ color: "var(--shiki-token-string)" }}>install </span>
                    <span style={{ color: "var(--shiki-token-string)" }}>
                      {registry.dependencies.join(" ")}
                    </span>
                  </span>
                </Code>
              </Pre>
            </>
          )}

          <Heading3>아래 코드를 복사 후 붙여넣고 사용하세요</Heading3>
          {registry.registries.map((registry) => (
            <Pre hasCopyCode filename={registry.name} key={registry.name}>
              <Code>{registry.content}</Code>
            </Pre>
          ))}
        </Steps>
      </Tabs.Tab>
    </Tabs>
  );
}
