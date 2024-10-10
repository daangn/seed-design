import { Code, Pre, Steps, Tabs } from "nextra/components";

import type { ComponentRegistrySchema } from "@/schemas/component";
import * as React from "react";
import ErrorBoundary from "./ErrorBoundary";

interface InstallationProps {
  name: string;
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
export function Installation(props: InstallationProps) {
  const { name } = props;
  const [json, setJson] = React.useState<ComponentRegistrySchema>(null);

  React.useEffect(() => {
    if (!name) return;

    import(`@/public/__registry__/component/${name}.json`)
      .then((module) => {
        setJson(module.default);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [name]);

  const getComponentMDX = React.useCallback((name: string) => {
    const MDX = React.lazy(() => import(`@/public/__mdx__/component/${name}.mdx`));

    if (!MDX) {
      return <div>MDX 파일이 존재하지 않습니다.</div>;
    }

    return <MDX />;
  }, []);

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Tabs items={["CLI", "Manual"]}>
          <Tabs.Tab>
            <Pre hasCopyCode data-language="sh" data-theme="default">
              <Code lang="sh" data-language="sh" data-theme="default">
                <span className="line">
                  <span style={{ color: "var(--shiki-token-function)" }}>npx </span>
                  <span style={{ color: "var(--shiki-token-string)" }}>
                    @seed-design/cli@latest{" "}
                  </span>
                  <span style={{ color: "var(--shiki-token-string)" }}>add </span>
                  <span style={{ color: "var(--shiki-token-string)" }}>{json?.name}</span>
                </span>
              </Code>
            </Pre>
          </Tabs.Tab>
          <Tabs.Tab>
            <Steps>
              {json?.dependencies && (
                <>
                  <Heading3>의존성 설치</Heading3>
                  <Pre hasCopyCode lang="sh" data-language="sh" data-theme="default">
                    <Code lang="sh" data-language="sh" data-theme="default">
                      <span className="line">
                        <span style={{ color: "var(--shiki-token-function)" }}>npm </span>
                        <span style={{ color: "var(--shiki-token-string)" }}>install </span>
                        <span style={{ color: "var(--shiki-token-string)" }}>
                          {json?.dependencies.join(" ")}
                        </span>
                      </span>
                    </Code>
                  </Pre>
                </>
              )}

              <Heading3>아래 코드를 복사 후 붙여넣고 사용하세요</Heading3>
              <React.Suspense fallback={<div>Loading...</div>}>
                {json?.registries.map((registry) => {
                  const MDX = getComponentMDX(registry.name.split(".")[0]);
                  return <div key={registry.name}>{MDX}</div>;
                })}
              </React.Suspense>
            </Steps>
          </Tabs.Tab>
        </Tabs>
      </React.Suspense>
    </ErrorBoundary>
  );
}
