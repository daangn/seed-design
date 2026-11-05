import { type ReactNode, useState } from "@lynx-js/react";
import { TabsList, TabsRoot, TabsTrigger } from "@/components/ui/tabs";
import {
  getPreviewStateDefaultValues,
  type PreviewState,
  type SetVariantValue,
  type VariantAxis,
  type VariantCatalogValues,
  VariantPlayground,
  type VariantPlaygroundProps,
  type VariantValues,
} from "./variant-playground.jsx";
import { VariantTable } from "./variant-table.jsx";

export type {
  PreviewState,
  PrimitiveValue,
  SetVariantValue,
  VariantAxis,
  VariantCatalogValues,
  VariantValues,
} from "./variant-playground.jsx";
export {
  definePreviewStates,
  defineVariantAxes,
} from "./variant-playground.jsx";

type Mode = "playground" | "table" | "examples";

export interface VariantCatalogProps<
  Variants extends readonly VariantAxis[] = readonly VariantAxis[],
  PreviewStates extends readonly PreviewState[] = readonly PreviewState[],
> extends VariantPlaygroundProps<Variants, PreviewStates> {
  examples?: ReactNode;
}

/**
 * 컴포넌트 카탈로그 페이지의 뷰를 탭으로 전환한다.
 *
 * - Playground: 변수 하나하나를 선택하며 단일 미리보기 (디테일 검사)
 * - Table: variant 축 하나씩 펼쳐 빠르게 비교 (나머지는 default 고정)
 * - Examples: 사용 시나리오 중심 수동 예시
 *
 * 두 모드 모두 같은 `children` render function 을 공유한다.
 */
export function VariantCatalog<
  const Variants extends readonly VariantAxis[],
  const PreviewStates extends readonly PreviewState[] = readonly [],
>(props: VariantCatalogProps<Variants, PreviewStates>) {
  const { children, variants, previewStates, examples } = props;
  const [mode, setMode] = useState<Mode>("playground");

  return (
    <view className="flex flex-col flex-1 min-h-0">
      <TabsRoot
        value={mode}
        triggerLayout="fill"
        onValueChange={(value) => {
          if (value === "playground" || value === "table" || value === "examples") {
            setMode(value);
          }
        }}
      >
        <TabsList>
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          {examples == null ? null : <TabsTrigger value="examples">Examples</TabsTrigger>}
        </TabsList>
      </TabsRoot>
      {mode === "playground" ? (
        <VariantPlayground<Variants, PreviewStates>
          variants={variants}
          previewStates={previewStates}
        >
          {children}
        </VariantPlayground>
      ) : mode === "table" ? (
        <VariantTable<Variants> variants={variants}>
          {(values) => renderForTable(children, values, previewStates)}
        </VariantTable>
      ) : (
        <view className="flex flex-col flex-1 min-h-0">{examples}</view>
      )}
    </view>
  );
}

const noopSetValue: SetVariantValue = () => {};
function renderForTable<
  Variants extends readonly VariantAxis[],
  PreviewStates extends readonly PreviewState[],
>(
  children: VariantPlaygroundProps<Variants, PreviewStates>["children"],
  values: VariantValues,
  previewStates: VariantPlaygroundProps<Variants, PreviewStates>["previewStates"],
): ReactNode {
  return children(
    {
      ...getPreviewStateDefaultValues(previewStates),
      ...values,
    } as VariantCatalogValues<Variants, PreviewStates>,
    noopSetValue as SetVariantValue<VariantCatalogValues<Variants, PreviewStates>>,
  );
}
