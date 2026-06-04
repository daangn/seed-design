import type { GeneratedRegistryItem } from "@/registry/schema";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Heading } from "fumadocs-ui/components/heading";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import ErrorBoundary from "./error-boundary";

interface LynxManualInstallationProps {
  name: string;
}

/**
 * Lynx용 Manual Installation 컴포넌트
 * @/public/__registry__/lynx/ui/{name}.json을 읽어 의존성 설치 명령과 snippet 본문을 렌더한다.
 */
export async function LynxManualInstallation(props: LynxManualInstallationProps) {
  const { name } = props;

  let json: GeneratedRegistryItem | null = null;

  try {
    json = (await import(`@/public/__registry__/lynx/ui/${name}.json`).then((module) => {
      return module.default;
    })) as GeneratedRegistryItem;
  } catch (error) {
    console.error(`Failed to load lynx registry for ${name}:`, error);
    return (
      <ErrorBoundary>
        <div>Lynx 레지스트리를 불러올 수 없습니다. `bun generate:all`을 실행해주세요.</div>
      </ErrorBoundary>
    );
  }

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
