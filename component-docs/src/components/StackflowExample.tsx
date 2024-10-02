import { Tabs } from "nextra/components";
import * as React from "react";
import * as changeCase from "change-case";

import { Stackflow } from "./Stackflow";

import type { ActivityComponentType } from "@stackflow/react/future";
import ErrorBoundary from "./ErrorBoundary";

interface StackflowExampleProps {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  activity: ActivityComponentType<any>;
}

/**
 * @description
 * ComponentExample과 구조가 다른 이유는
 * stackflow의 acitivity를 dynamic import를 했을 때
 * stackflow init이 정상적으로 동작하지 않는 이슈가 있어서 activity를 주입 받아서 사용합니다.
 *
 * @example
   // in MDX
 * <StackflowExample activity={ChipTabsBasicActivity} />
 */
export function StackflowExample(props: StackflowExampleProps) {
  const { activity } = props;

  const displayName = activity.displayName;

  if (!displayName) {
    return <div>Activity의 displayName을 넣어주세요</div>;
  }

  const kebabName = changeCase.kebabCase(displayName);

  const Code = React.useMemo(() => {
    const MDX = React.lazy(() => import(`@/public/mdx/stackflow/${kebabName}.mdx`));

    if (!MDX) {
      return <div>MDX 파일이 존재하지 않습니다.</div>;
    }

    return <MDX />;
  }, [kebabName]);

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Tabs items={["미리보기", "코드"]}>
          <Tabs.Tab>
            <Stackflow Activity={activity} />
          </Tabs.Tab>
          <Tabs.Tab>
            <React.Suspense fallback={null}>{Code}</React.Suspense>
          </Tabs.Tab>
        </Tabs>
      </React.Suspense>
    </ErrorBoundary>
  );
}
