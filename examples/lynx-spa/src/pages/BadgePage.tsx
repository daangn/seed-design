import { badgeVariantMap } from "@seed-design/lynx-css/recipes/badge";
import { Badge } from "@seed-design/lynx-react";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";

const variants = defineVariantAxes([
  {
    key: "tone",
    options: badgeVariantMap.tone,
    defaultValue: "neutral",
  },
  {
    key: "variant",
    options: badgeVariantMap.variant,
    defaultValue: "solid",
  },
  {
    key: "size",
    options: badgeVariantMap.size,
    defaultValue: "medium",
  },
]);

type BadgeValues = VariantCatalogValues<typeof variants>;

function renderBadge(values: BadgeValues) {
  return (
    <Badge.Root tone={values.tone} variant={values.variant} size={values.size}>
      <Badge.Label>Badge</Badge.Label>
    </Badge.Root>
  );
}

function BadgeExamples() {
  return (
    <CatalogExamples title="Badge" gap="12px">
      <CatalogSectionTitle>Tones</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge.Root tone="neutral">
          <Badge.Label>Neutral</Badge.Label>
        </Badge.Root>
        <Badge.Root tone="brand">
          <Badge.Label>Brand</Badge.Label>
        </Badge.Root>
        <Badge.Root tone="informative">
          <Badge.Label>Info</Badge.Label>
        </Badge.Root>
        <Badge.Root tone="positive">
          <Badge.Label>Positive</Badge.Label>
        </Badge.Root>
        <Badge.Root tone="warning">
          <Badge.Label>Warning</Badge.Label>
        </Badge.Root>
        <Badge.Root tone="critical">
          <Badge.Label>Critical</Badge.Label>
        </Badge.Root>
      </view>

      <CatalogSectionTitle>Variants</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge.Root variant="weak" tone="brand">
          <Badge.Label>Weak</Badge.Label>
        </Badge.Root>
        <Badge.Root variant="solid" tone="brand">
          <Badge.Label>Solid</Badge.Label>
        </Badge.Root>
        <Badge.Root variant="outline" tone="brand">
          <Badge.Label>Outline</Badge.Label>
        </Badge.Root>
      </view>

      <CatalogSectionTitle>Sizes</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge.Root size="medium" tone="positive">
          <Badge.Label>Medium</Badge.Label>
        </Badge.Root>
        <Badge.Root size="large" tone="positive">
          <Badge.Label>Large</Badge.Label>
        </Badge.Root>
      </view>

      <CatalogSectionTitle>Long Label</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge.Root tone="neutral" variant="weak">
          <Badge.Label>거래 가능 지역이 긴 배지</Badge.Label>
        </Badge.Root>
        <Badge.Root tone="informative" variant="outline" size="large">
          <Badge.Label>Informative outline badge with long label</Badge.Label>
        </Badge.Root>
      </view>
    </CatalogExamples>
  );
}

export function BadgePage() {
  return (
    <VariantCatalog variants={variants} examples={<BadgeExamples />}>
      {(values) => renderBadge(values)}
    </VariantCatalog>
  );
}
