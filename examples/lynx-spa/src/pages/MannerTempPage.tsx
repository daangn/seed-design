import { mannerTempVariantMap } from "@seed-design/lynx-css/recipes/manner-temp";
import { MannerTemp, MannerTempBadge, MannerTempEmote, VStack } from "@seed-design/lynx-react";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";

const variants = defineVariantAxes([
  {
    key: "level",
    options: mannerTempVariantMap.level,
    defaultValue: "l1",
  },
]);

type MannerTempValues = VariantCatalogValues<typeof variants>;

function renderMannerTemp(values: MannerTempValues) {
  return (
    <VStack gap="x2" align="center">
      <MannerTemp level={values.level}>
        36.5°C
        <MannerTempEmote />
      </MannerTemp>
      <MannerTempBadge level={values.level}>36.5°C</MannerTempBadge>
    </VStack>
  );
}

function MannerTempExamples() {
  return (
    <CatalogExamples title="Manner Temp" gap="12px">
      <CatalogSectionTitle>Levels</CatalogSectionTitle>
      <view className="flex flex-row flex-wrap gap-x3 items-center">
        {mannerTempVariantMap.level.map((level) => (
          <VStack key={level} gap="x1" align="center">
            <MannerTemp level={level}>
              36.5°C
              <MannerTempEmote />
            </MannerTemp>
            <MannerTempBadge level={level}>36.5°C</MannerTempBadge>
          </VStack>
        ))}
      </view>
    </CatalogExamples>
  );
}

export function MannerTempPage() {
  return (
    <VariantCatalog variants={variants} examples={<MannerTempExamples />}>
      {(values) => renderMannerTemp(values)}
    </VariantCatalog>
  );
}
