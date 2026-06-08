import { AspectRatio } from "@seed-design/lynx-react";

import { CatalogExamples, CatalogSectionTitle } from "../components/catalog-examples.jsx";
import {
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from "../components/variant-catalog.jsx";

/** ratio prop은 number이지만, 카탈로그에서 토글하기 쉽도록 사람이 읽는 프리셋으로 노출한다. */
const RATIO_PRESETS: Record<string, number> = {
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
  "16:9": 16 / 9,
  "3:4": 3 / 4,
  "9:16": 9 / 16,
};

/** picsum.photos는 seed별로 고정된 임의 사진을 돌려준다. (네트워크 필요) */
function placeholderSrc(seed: string) {
  return `https://picsum.photos/seed/${seed}/1200/900`;
}

const variants = defineVariantAxes([
  {
    key: "ratio",
    options: ["1:1", "4:3", "3:2", "16:9", "3:4", "9:16"],
    defaultValue: "4:3",
  },
]);

type AspectRatioValues = VariantCatalogValues<typeof variants>;

function renderAspectRatio(values: AspectRatioValues) {
  return (
    <view className="w-full">
      <AspectRatio ratio={RATIO_PRESETS[values.ratio]} width="full">
        <image
          src={placeholderSrc("seed-design")}
          mode="aspectFill"
          className="w-full h-full rounded-r2"
        />
      </AspectRatio>
    </view>
  );
}

function ImageRatioCard({ ratio, label, seed }: { ratio: number; label: string; seed: string }) {
  return (
    <view className="mb-x2">
      <text className="t6-regular text-fg-neutral-subtle mb-x1">{label}</text>
      <AspectRatio ratio={ratio} width="full">
        <image src={placeholderSrc(seed)} mode="aspectFill" className="w-full h-full rounded-r2" />
      </AspectRatio>
    </view>
  );
}

function SolidRatioBox({ ratio, label }: { ratio: number; label: string }) {
  return (
    <view className="mb-x2">
      <text className="t6-regular text-fg-neutral-subtle mb-x1">{label}</text>
      <AspectRatio ratio={ratio} width="full">
        <view className="w-full h-full flex flex-col items-center justify-center bg-bg-brand-solid rounded-r2">
          <text className="t4-bold text-fg-static-white">{label}</text>
        </view>
      </AspectRatio>
    </view>
  );
}

function AspectRatioExamples() {
  return (
    <CatalogExamples title="AspectRatio" gap="16px">
      <CatalogSectionTitle>Placeholder image (mode="aspectFill")</CatalogSectionTitle>
      <ImageRatioCard ratio={16 / 9} label="16 / 9" seed="landscape" />
      <ImageRatioCard ratio={1} label="1 / 1" seed="square" />
      <ImageRatioCard ratio={3 / 4} label="3 / 4" seed="portrait" />

      <CatalogSectionTitle>Solid fill (자식이 비율 박스를 채우는지)</CatalogSectionTitle>
      <SolidRatioBox ratio={4 / 3} label="4 / 3" />
    </CatalogExamples>
  );
}

export function AspectRatioPage() {
  return (
    <VariantCatalog variants={variants} examples={<AspectRatioExamples />}>
      {(values) => renderAspectRatio(values)}
    </VariantCatalog>
  );
}
