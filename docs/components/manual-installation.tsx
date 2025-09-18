import type { GeneratedRegistryItem } from "@/registry/schema";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Heading } from "fumadocs-ui/components/heading";
import type * as React from "react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import ErrorBoundary from "./error-boundary";

interface ManualInstallationProps {
  name: string;
}

/**
 * @see https://github.com/shuding/nextra/blob/main/packages/nextra/src/components/pre.tsx
 * @type {React.FC<ManualInstallationProps>}
 */
export async function ManualInstallation(props: ManualInstallationProps) {
  const { name } = props;

  const json = (await import(`@/public/__registry__/ui/${name}.json`).then((module) => {
    return module.default;
  })) as GeneratedRegistryItem;

  const packageManagers = ["npm", "yarn", "pnpm", "bun"];

  return (
    <ErrorBoundary>
      <Accordions type="single">
        <Accordion title="Manual Installation" id="manual-install">
          <Steps>
            {json?.dependencies && (
              <Step>
                <Heading as="h3">의존성 설치</Heading>
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
              <Heading as="h3">아래 코드를 복사 후 붙여넣고 사용하세요</Heading>
              {json?.snippets.map(({ path, content }) => {
                return <DynamicCodeBlock key={path} lang="tsx" code={content} />;
              })}
            </Step>
          </Steps>
        </Accordion>
      </Accordions>
    </ErrorBoundary>
  );
}
