import { useEffect, useState } from "@lynx-js/react";
import { progressCircleVariantMap } from "@seed-design/lynx-css/recipes/progress-circle";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  definePreviewStates,
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";
import { ProgressCircle } from "../seed-design/ui/progress-circle";

type ProgressState = "indeterminate" | "25%" | "50%" | "75%" | "100%";

const progressValueMap: Record<Exclude<ProgressState, "indeterminate">, number> = {
  "25%": 0.25,
  "50%": 0.5,
  "75%": 0.75,
  "100%": 1,
};

const variants = defineVariantAxes([
  {
    key: "tone",
    options: progressCircleVariantMap.tone,
    defaultValue: "neutral",
  },
  {
    key: "size",
    options: progressCircleVariantMap.size,
    defaultValue: "40",
  },
  {
    key: "progressState",
    label: "progress",
    options: ["indeterminate", "25%", "50%", "75%", "100%"],
    defaultValue: "indeterminate",
  },
]);

const previewStates = definePreviewStates([
  { key: "progressState", label: "value", defaultValue: "indeterminate" },
]);

type ProgressCircleValues = VariantCatalogValues<typeof variants, typeof previewStates>;

function renderProgressCircle(values: ProgressCircleValues) {
  const { tone, size } = values;
  const progressState: ProgressState = values.progressState;
  const progressValue =
    progressState === "indeterminate" ? undefined : progressValueMap[progressState];

  const circle =
    progressValue == null ? (
      <ProgressCircle tone={tone} size={size} />
    ) : (
      <ProgressCircle tone={tone} size={size} minValue={0} maxValue={1} value={progressValue} />
    );

  return (
    <view className="flex flex-row gap-x3 items-center">
      {tone === "staticWhite" ? (
        <view className="bg-bg-neutral-solid rounded-r2 p-x2">{circle}</view>
      ) : (
        circle
      )}
      <text className="t3-regular">{progressState}</text>
    </view>
  );
}

function AutoProgressTest() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((v) => (v >= 1 ? 0 : Math.min(1, v + 0.1)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <view className="flex flex-row gap-x4 items-center">
      <ProgressCircle tone="brand" size="40" minValue={0} maxValue={1} value={value} />
      <text className="t4-regular">{`${Math.round(value * 100)}%`}</text>
    </view>
  );
}

function ProgressCircleExamples() {
  const [progress, setProgress] = useState(0.3);

  return (
    <CatalogExamples title="ProgressCircle" gap="12px">
      <CatalogSectionTitle>Indeterminate</CatalogSectionTitle>
      <view className="flex flex-row gap-x4 items-center">
        <ProgressCircle tone="neutral" size="40" />
        <ProgressCircle tone="brand" size="40" />
        <view className="bg-bg-neutral-solid rounded-r2 p-x2">
          <ProgressCircle tone="staticWhite" size="40" />
        </view>
      </view>

      <CatalogSectionTitle>Sizes</CatalogSectionTitle>
      <view className="flex flex-row gap-x4 items-center">
        <ProgressCircle tone="brand" size="24" />
        <ProgressCircle tone="brand" size="40" />
      </view>

      <CatalogSectionTitle>Determinate</CatalogSectionTitle>
      <view className="flex flex-row gap-x4 items-center">
        <ProgressCircle tone="neutral" size="40" minValue={0} maxValue={1} value={0.25} />
        <ProgressCircle tone="brand" size="40" minValue={0} maxValue={1} value={0.5} />
        <ProgressCircle tone="brand" size="40" minValue={0} maxValue={1} value={0.75} />
        <ProgressCircle tone="brand" size="40" minValue={0} maxValue={1} value={1} />
      </view>

      <CatalogSectionTitle>Interactive</CatalogSectionTitle>
      <view className="flex flex-row gap-x4 items-center">
        <ProgressCircle tone="brand" size="40" minValue={0} maxValue={1} value={progress} />
        <text className="t4-regular">{`${Math.round(progress * 100)}%`}</text>
      </view>
      <view className="flex flex-row gap-x2">
        <view
          bindtap={() => setProgress((p) => Math.max(0, p - 0.1))}
          className="py-x2 px-x4 bg-bg-neutral-weak rounded-r1_5"
        >
          <text className="t4-regular">- 10%</text>
        </view>
        <view
          bindtap={() => setProgress((p) => Math.min(1, p + 0.1))}
          className="py-x2 px-x4 bg-bg-neutral-weak rounded-r1_5"
        >
          <text className="t4-regular">+ 10%</text>
        </view>
      </view>

      <CatalogSectionTitle>Transition Test (auto +10% every 1s)</CatalogSectionTitle>
      <AutoProgressTest />
    </CatalogExamples>
  );
}

export function ProgressCirclePage() {
  return (
    <VariantCatalog
      variants={variants}
      previewStates={previewStates}
      examples={<ProgressCircleExamples />}
    >
      {(values) => renderProgressCircle(values)}
    </VariantCatalog>
  );
}
