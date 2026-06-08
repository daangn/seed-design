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
    <Badge tone={values.tone} variant={values.variant} size={values.size}>
      Badge
    </Badge>
  );
}

function BadgeExamples() {
  return (
    <CatalogExamples title="Badge" gap="12px">
      <CatalogSectionTitle>Tones</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge tone="neutral">Neutral</Badge>
        <Badge tone="brand">Brand</Badge>
        <Badge tone="informative">Info</Badge>
        <Badge tone="positive">Positive</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="critical">Critical</Badge>
      </view>

      <CatalogSectionTitle>Variants</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge variant="weak" tone="brand">
          Weak
        </Badge>
        <Badge variant="solid" tone="brand">
          Solid
        </Badge>
        <Badge variant="outline" tone="brand">
          Outline
        </Badge>
      </view>

      <CatalogSectionTitle>Sizes</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge size="medium" tone="positive">
          Medium
        </Badge>
        <Badge size="large" tone="positive">
          Large
        </Badge>
      </view>

      <CatalogSectionTitle>Long Label</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x2 items-center">
        <Badge tone="neutral" variant="weak">
          거래 가능 지역이 긴 배지
        </Badge>
        <Badge tone="informative" variant="outline" size="large">
          Informative outline badge with long label
        </Badge>
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
