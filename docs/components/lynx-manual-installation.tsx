import type { GeneratedRegistryItem } from "@/registry/schema";
import { Accordion, Accordions } from "@/components/accordion";
import { Heading } from "fumadocs-ui/components/heading";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { SeedCodeTabs, SeedDynamicCodeBlock, packageManagerTabItems } from "@/components/codeblock";
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
