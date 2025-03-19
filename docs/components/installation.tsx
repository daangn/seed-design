import type { RegistryUIItemMachineGenerated } from "@/registry/schema";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import type * as React from "react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
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

  const json = (await import(`@/public/__registry__/ui/${name}.json`).then((module) => {
    return module.default;
  })) as RegistryUIItemMachineGenerated;

  const packageManagers = ["npm", "yarn", "pnpm", "bun"];

  return (
    <ErrorBoundary>
      <Tabs items={packageManagers} groupId="package-manager" persist>
        <Tab value="npm">
          <DynamicCodeBlock lang="bash" code={`npx @seed-design/cli@latest add ${json?.name}`} />
        </Tab>
        <Tab value="yarn">
          <DynamicCodeBlock
            lang="bash"
            code={`yarn dlx @seed-design/cli@latest add ${json?.name}`}
          />
        </Tab>
        <Tab value="pnpm">
          <DynamicCodeBlock
            lang="bash"
            code={`pnpm dlx @seed-design/cli@latest add ${json?.name}`}
          />
        </Tab>
        <Tab value="bun">
          <DynamicCodeBlock lang="bash" code={`bunx @seed-design/cli@latest add ${json?.name}`} />
        </Tab>
      </Tabs>

      <Accordions type="single">
        <Accordion title="Manual Installation" id="manual-install">
          <Steps>
            {json?.dependencies && (
              <Step>
                <Heading3>의존성 설치</Heading3>
                <Tabs items={packageManagers} groupId="package-manager" persist>
                  <Tab value="npm">
                    <DynamicCodeBlock
                      lang="bash"
                      code={`npm install ${json?.dependencies.join(" ")}`}
                    />
                  </Tab>
                  <Tab value="yarn">
                    <DynamicCodeBlock
                      lang="bash"
                      code={`yarn add ${json?.dependencies.join(" ")}`}
                    />
                  </Tab>
                  <Tab value="pnpm">
                    <DynamicCodeBlock
                      lang="bash"
                      code={`pnpm add ${json?.dependencies.join(" ")}`}
                    />
                  </Tab>
                  <Tab value="bun">
                    <DynamicCodeBlock
                      lang="bash"
                      code={`bun add ${json?.dependencies.join(" ")}`}
                    />
                  </Tab>
                </Tabs>
              </Step>
            )}

            <Step>
              <Heading3>아래 코드를 복사 후 붙여넣고 사용하세요</Heading3>
              {json?.registries.map((registry) => {
                return <DynamicCodeBlock key={registry.name} lang="tsx" code={registry.content} />;
              })}
            </Step>
          </Steps>
        </Accordion>
      </Accordions>
    </ErrorBoundary>
  );
}
