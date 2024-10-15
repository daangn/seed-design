import type { RegistryComponentItemMachineGenerated } from "@/registry/schema";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type * as React from "react";
import { CodeBlock } from "./code-block";
import ErrorBoundary from "./error-boundary";

interface InstallationProps {
  name: string;
}

const Heading3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-8 text-2xl">
    {children}
  </h3>
);

/**
 * @see https://github.com/shuding/nextra/blob/main/packages/nextra/src/components/pre.tsx
 * @type {React.FC<InstallationProps>}
 */
export async function Installation(props: InstallationProps) {
  const { name } = props;

  const json = (await import(
    `@/public/__registry__/component/${name}.json`
  ).then((module) => {
    return module.default;
  })) as RegistryComponentItemMachineGenerated;

  return (
    <ErrorBoundary>
      <Tabs items={["CLI", "Manual"]}>
        <Tab value="CLI">
          <CodeBlock
            lang="bash"
            wrapper={{ allowCopy: true }}
            code={`npx @seed-design/cli@latest add ${json?.name}`}
          />
        </Tab>
        <Tab value="Manual">
          <Steps>
            {json?.dependencies && (
              <Step>
                <Heading3>의존성 설치</Heading3>
                <CodeBlock
                  lang="bash"
                  wrapper={{ allowCopy: true }}
                  code={`npm install ${json?.dependencies.join(" ")}`}
                />
              </Step>
            )}

            <Step>
              <Heading3>아래 코드를 복사 후 붙여넣고 사용하세요</Heading3>
              {json?.registries.map((registry) => {
                return (
                  <CodeBlock
                    key={registry.name}
                    lang="tsx"
                    wrapper={{ allowCopy: true }}
                    code={registry.content}
                  />
                );
              })}
            </Step>
          </Steps>
        </Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
