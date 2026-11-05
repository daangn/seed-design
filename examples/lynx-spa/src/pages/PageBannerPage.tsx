import IconExclamationmarkCircleFill from "@karrotmarket/lynx-monochrome-icon/IconExclamationmarkCircleFill";
import { pageBannerVariantMap } from "@seed-design/lynx-css/recipes/page-banner";
import { useState } from "@lynx-js/react";

import { CatalogExamples, CatalogSectionHeader } from "../components/catalog-examples.jsx";
import {
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";
import {
  ActionablePageBanner,
  DismissiblePageBanner,
  PageBanner,
  PageBannerButton,
} from "../seed-design/ui/page-banner";

const variants = defineVariantAxes([
  {
    key: "tone",
    options: pageBannerVariantMap.tone,
    defaultValue: "neutral",
  },
  {
    key: "variant",
    options: pageBannerVariantMap.variant,
    defaultValue: "weak",
  },
]);

type PageBannerValues = VariantCatalogValues<typeof variants>;

function renderPageBanner(values: PageBannerValues) {
  if (values.tone === "magic" && values.variant === "solid") {
    return <text className="t4-regular text-fg-neutral-subtle">지원하지 않는 조합입니다.</text>;
  }

  return (
    <PageBanner
      tone={values.tone}
      variant={values.variant}
      prefixIcon={<IconExclamationmarkCircleFill />}
      title="Page Banner"
      description="페이지의 중요한 상태를 전달합니다."
      suffix={<PageBannerButton>확인</PageBannerButton>}
    />
  );
}

function PageBannerExamples() {
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
    <CatalogExamples title="Page Banner">
      <CatalogSectionHeader>Text only</CatalogSectionHeader>
      <PageBanner description="중요한 정보를 간결하게 전달합니다." />

      <CatalogSectionHeader>With button</CatalogSectionHeader>
      <PageBanner
        tone="informative"
        title="안내"
        description="새로운 기능이 추가되었어요."
        suffix={<PageBannerButton bindtap={handleTap}>자세히 보기</PageBannerButton>}
      />

      <CatalogSectionHeader>{`Actionable (${JSON.stringify(tapCount)})`}</CatalogSectionHeader>
      <ActionablePageBanner
        tone="warning"
        title="확인 필요"
        description="탭해서 상세 내용을 확인하세요."
        bindtap={handleTap}
        accessibility-label="상세 내용 확인"
      />

      <CatalogSectionHeader>Dismissible</CatalogSectionHeader>
      <DismissiblePageBanner
        open={open}
        tone="positive"
        title="완료"
        description="설정이 저장되었어요."
        onDismiss={handleDismiss}
      />
    </CatalogExamples>
  );
}

export function PageBannerPage() {
  return (
    <VariantCatalog variants={variants} examples={<PageBannerExamples />}>
      {(values) => renderPageBanner(values)}
    </VariantCatalog>
  );
}
