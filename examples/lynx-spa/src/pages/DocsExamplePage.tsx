import { lazy, Suspense, useMemo } from "@lynx-js/react";
import { Text, VStack } from "@seed-design/lynx-react";
import { getExampleLayout } from "../../../../docs/playground/lynx/layout";
import type { LynxPlaygroundExample } from "../../../../docs/playground/lynx/types";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { LynxExampleBoundary } from "../components/lynx-example-boundary.jsx";

interface DocsExamplePageProps {
  example: LynxPlaygroundExample;
  onBack: () => void;
}

export function DocsExamplePage({ example, onBack }: DocsExamplePageProps) {
  const LazyExample = useMemo(() => lazy(example.load), [example.id, example.load]);
  const layout = getExampleLayout(example.component);
  const sourcePath = `docs/examples/lynx/${example.component}/${example.scenario}.tsx`;
  const content = (
    <LynxExampleBoundary exampleId={example.id} load={example.load} onBack={onBack}>
      <Suspense
        fallback={
          <VStack className="flex-1" align="center" justify="center" gap="x3" px="x4">
            <ProgressCircle />
            <Text textStyle="t4Regular" color="fg.neutralSubtle">
              예제를 불러오는 중
            </Text>
          </VStack>
        }
      >
        <LazyExample />
      </Suspense>
    </LynxExampleBoundary>
  );

  return (
    <view className="flex flex-col flex-1 min-h-0 bg-bg-layer-default">
      <view className="shrink-0 px-x4 py-x2">
        <Text textStyle="t2Regular" color="fg.neutralSubtle">
          {sourcePath}
        </Text>
      </view>
      {layout === "fill" ? (
        <view className="flex flex-col flex-1 min-h-0">{content}</view>
      ) : (
        <scroll-view scroll-orientation="vertical" className="flex-1 min-h-0">
          <view className="min-h-full">{content}</view>
        </scroll-view>
      )}
    </view>
  );
}
