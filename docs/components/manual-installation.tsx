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

async function getRegistryItem(registryId: string, itemId: string) {
  return import(`@/public/__registry__/${registryId}/${itemId}.json`).then((module) => {
    return module.default as GeneratedRegistryItem;
  });
}

async function getRegistryItems(
  registryId: string,
  itemId: string,
  seen = new Set<string>(),
): Promise<GeneratedRegistryItem[]> {
  const key = `${registryId}:${itemId}`;
  if (seen.has(key)) return [];

  seen.add(key);

  const item = await getRegistryItem(registryId, itemId);
  const items = [item];

  for (const dependency of item.innerDependencies ?? []) {
    for (const dependencyItemId of dependency.itemIds) {
      items.push(...(await getRegistryItems(dependency.registryId, dependencyItemId, seen)));
    }
  }

  return items;
}

/**
 * @see https://github.com/shuding/nextra/blob/main/packages/nextra/src/components/pre.tsx
 * @type {React.FC<ManualInstallationProps>}
 */
export async function ManualInstallation(props: ManualInstallationProps) {
  const { name } = props;

  const registryItems = await getRegistryItems("ui", name);
  const dependencies = Array.from(
    new Set(registryItems.flatMap((item) => item.dependencies ?? [])),
  ).sort();
  const snippets = registryItems.flatMap((item) => item.snippets);
  const packageManagers = ["npm", "yarn", "pnpm", "bun"];

  return (
    <ErrorBoundary>
      <Accordions type="single">
        <Accordion title="Manual Installation" id="manual-install">
          <Steps>
            {dependencies.length > 0 && (
              <Step>
                <Heading as="h3">의존성 설치</Heading>
                <Tabs items={packageManagers} groupId="package-manager" persist>
                  <Tab value="npm">
                    <DynamicCodeBlock
                      lang="bash"
                      code={`npm install ${dependencies.join(" ")}`}
                    />
                  </Tab>
                  <Tab value="yarn">
                    <DynamicCodeBlock lang="bash" code={`yarn add ${dependencies.join(" ")}`} />
                  </Tab>
                  <Tab value="pnpm">
                    <DynamicCodeBlock lang="bash" code={`pnpm add ${dependencies.join(" ")}`} />
                  </Tab>
                  <Tab value="bun">
                    <DynamicCodeBlock lang="bash" code={`bun add ${dependencies.join(" ")}`} />
                  </Tab>
                </Tabs>
              </Step>
            )}

            <Step>
              <Heading as="h3">아래 코드를 복사 후 붙여넣고 사용하세요</Heading>
              {snippets.length === 1 ? (
                <DynamicCodeBlock lang="tsx" code={snippets[0].content} />
              ) : (
                <Tabs items={snippets.map(({ path }) => path)}>
                  {snippets.map(({ path, content }) => (
                    <Tab key={path} value={path}>
                      <DynamicCodeBlock lang="tsx" code={content} />
                    </Tab>
                  ))}
                </Tabs>
              )}
            </Step>
          </Steps>
        </Accordion>
      </Accordions>
    </ErrorBoundary>
  );
}
