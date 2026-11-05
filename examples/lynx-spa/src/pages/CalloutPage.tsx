import { calloutVariantMap } from "@seed-design/lynx-css/recipes/callout";
import { useState } from "@lynx-js/react";

import { CatalogExamples, CatalogSectionHeader } from "../components/catalog-examples.jsx";
import {
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";
import { ActionableCallout, Callout, DismissibleCallout } from "../seed-design/ui/callout";

const variants = defineVariantAxes([
  {
    key: "tone",
    options: calloutVariantMap.tone,
    defaultValue: "neutral",
  },
]);

type CalloutValues = VariantCatalogValues<typeof variants>;

function renderCallout(values: CalloutValues) {
  return (
    <Callout
      tone={values.tone}
      title="Callout"
      description="중요한 정보나 팁을 강조해서 전달합니다."
    />
  );
}

function CalloutExamples() {
  const [open, setOpen] = useState(true);
  const [tapCount, setTapCount] = useState(0);

  function handleTap() {
    "background only";
    setTapCount((count) => count + 1);
  }

  function handleDismiss() {
    "background only";
    setOpen(false);
  }

  return (
    <CatalogExamples title="Callout">
      <CatalogSectionHeader>Text only</CatalogSectionHeader>
      <Callout description="중요한 정보를 간결하게 전달합니다." />

      <CatalogSectionHeader>Title and link</CatalogSectionHeader>
      <Callout
        tone="informative"
        title="알림"
        description="새로운 기능이 추가되었어요."
        linkProps={{ children: "자세히 보기", bindtap: handleTap }}
      />

      <CatalogSectionHeader>{`Actionable (${JSON.stringify(tapCount)})`}</CatalogSectionHeader>
      <ActionableCallout
        tone="warning"
        title="확인 필요"
        description="탭해서 상세 내용을 확인하세요."
        bindtap={handleTap}
        accessibility-label="상세 내용 확인"
      />

      <CatalogSectionHeader>Dismissible</CatalogSectionHeader>
      <DismissibleCallout
        open={open}
        tone="positive"
        title="완료"
        description="설정이 저장되었어요."
        onDismiss={handleDismiss}
      />
    </CatalogExamples>
  );
}

export function CalloutPage() {
  return (
    <VariantCatalog variants={variants} examples={<CalloutExamples />}>
      {(values) => renderCallout(values)}
    </VariantCatalog>
  );
}
