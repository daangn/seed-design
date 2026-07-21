import type { GeneratedRegistryItem } from "@/registry/schema";
import { Accordion, Accordions } from "@/components/accordion";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Heading } from "fumadocs-ui/components/heading";
import type * as React from "react";
import { SeedCodeTabs, SeedDynamicCodeBlock, packageManagerTabItems } from "@/components/codeblock";
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

  const json = (await import(`@/public/__registry__/react/ui/${name}.json`).then((module) => {
    return module.default;
  })) as GeneratedRegistryItem;

  return (
    <ErrorBoundary>
      <Accordions type="single">
        <Accordion title="Manual Installation" id="manual-install">
          <Steps>
            {json?.dependencies && (
              <Step>
                <Heading as="h3">의존성 설치</Heading>
                <SeedCodeTabs
                  groupId="package-manager"
                  items={packageManagerTabItems(json.dependencies)}
                />
              </Step>
            )}

            <Step>
              <Heading as="h3">아래 코드를 복사 후 붙여넣고 사용하세요</Heading>
              {json?.snippets.map(({ path, content }) => {
                return <SeedDynamicCodeBlock key={path} lang="tsx" code={content} />;
              })}
            </Step>
          </Steps>
        </Accordion>
      </Accordions>
    </ErrorBoundary>
  );
}
