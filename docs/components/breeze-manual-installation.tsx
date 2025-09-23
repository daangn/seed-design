import type { GeneratedRegistryItem } from "@/registry/schema";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Heading } from "fumadocs-ui/components/heading";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import ErrorBoundary from "./error-boundary";

interface BreezeManualInstallationProps {
  name: string;
}

/**
 * Breeze용 Manual Installation 컴포넌트
 * CSS Modules와 Vanilla Extract 두 가지 스타일 옵션 제공
 */
export async function BreezeManualInstallation(props: BreezeManualInstallationProps) {
  const { name } = props;

  let json: GeneratedRegistryItem | null = null;

  try {
    json = (await import(`@/public/__registry__/breeze/${name}.json`).then((module) => {
      return module.default;
    })) as GeneratedRegistryItem;
  } catch (error) {
    console.error(`Failed to load breeze registry for ${name}:`, error);
    return (
      <ErrorBoundary>
        <div>Breeze 레지스트리를 불러올 수 없습니다. `bun generate:all`을 실행해주세요.</div>
      </ErrorBoundary>
    );
  }

  const packageManagers = ["npm", "yarn", "pnpm", "bun"];

  // 파일 분리
  const componentSnippets = json?.snippets?.filter((r) => r.path.endsWith(".tsx")) || [];
  const styleSnippets = json?.snippets?.filter((r) => r.path.endsWith(".module.css")) || [];

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
              <Heading as="h3">컴포넌트 코드 복사</Heading>
              {componentSnippets.map(({ path, content }) => {
                return <DynamicCodeBlock key={path} lang="tsx" code={content} />;
              })}
            </Step>

            <Step>
              <Heading as="h3">스타일 복사</Heading>
              {styleSnippets.map(({ path, content }) => (
                <DynamicCodeBlock key={path} lang="css" code={content} />
              ))}
            </Step>
          </Steps>
        </Accordion>
      </Accordions>
    </ErrorBoundary>
  );
}
