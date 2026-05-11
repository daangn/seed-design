import { tagGroupVariantMap } from '@seed-design/lynx-css/recipes/tag-group';
import { tagGroupItemVariantMap } from '@seed-design/lynx-css/recipes/tag-group-item';

import {
  CatalogExamples,
  CatalogSectionHeader,
} from '../components/catalog-examples.jsx';
import {
  VariantCatalog,
  type VariantAxis,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import {
  TagGroupItem,
  TagGroupRoot,
  type TagGroupRootProps,
} from '../seed-design/ui/tag-group';

type TagGroupSize = NonNullable<TagGroupRootProps['size']>;
type TagGroupWeight = NonNullable<TagGroupRootProps['weight']>;
type TagGroupTone = NonNullable<TagGroupRootProps['tone']>;

const variants: readonly VariantAxis[] = [
  {
    key: 'size',
    options: tagGroupVariantMap.size,
    defaultValue: 't2',
  },
  {
    key: 'weight',
    options: tagGroupItemVariantMap.weight,
    defaultValue: 'regular',
  },
  {
    key: 'tone',
    options: tagGroupItemVariantMap.tone,
    defaultValue: 'neutralSubtle',
  },
];

function renderTagGroup(values: VariantValues) {
  return (
    <TagGroupRoot
      size={values.size as TagGroupSize}
      weight={values.weight as TagGroupWeight}
      tone={values.tone as TagGroupTone}
    >
      <TagGroupItem label="동네 인증" />
      <TagGroupItem label="매너 온도 42.0°C" />
      <TagGroupItem label="재거래 희망률 89%" />
    </TagGroupRoot>
  );
}

function TagGroupExamples() {
  return (
    <CatalogExamples title="TagGroup">
      <CatalogSectionHeader>
        Default (neutralSubtle · regular)
      </CatalogSectionHeader>
      <TagGroupRoot size="t2">
        <TagGroupItem label="동네 인증" />
        <TagGroupItem label="매너 온도 42.0°C" />
        <TagGroupItem label="재거래 희망률 89%" />
      </TagGroupRoot>

      <CatalogSectionHeader>Weight: bold</CatalogSectionHeader>
      <TagGroupRoot size="t2" weight="bold">
        <TagGroupItem label="전체" />
        <TagGroupItem label="인기" />
        <TagGroupItem label="최신" />
      </TagGroupRoot>

      <CatalogSectionHeader>Tone: neutral</CatalogSectionHeader>
      <TagGroupRoot size="t2" tone="neutral">
        <TagGroupItem label="새 상품" />
        <TagGroupItem label="배송비 포함" />
      </TagGroupRoot>

      <CatalogSectionHeader>Tone: brand</CatalogSectionHeader>
      <TagGroupRoot size="t2" tone="brand" weight="bold">
        <TagGroupItem label="추천" />
        <TagGroupItem label="방금 등록" />
      </TagGroupRoot>

      <CatalogSectionHeader>Per-item override</CatalogSectionHeader>
      <TagGroupRoot size="t2">
        <TagGroupItem tone="brand" weight="bold" label="NEW" />
        <TagGroupItem label="무료 나눔" />
        <TagGroupItem tone="neutral" label="직거래 선호" />
      </TagGroupRoot>

      <CatalogSectionHeader>Wrap behaviour</CatalogSectionHeader>
      <TagGroupRoot size="t2">
        <TagGroupItem label="관악구 봉천동" />
        <TagGroupItem label="재거래 희망 89%" />
        <TagGroupItem label="매너 온도 42.0°C" />
        <TagGroupItem label="평균 응답 12분" />
        <TagGroupItem label="판매자 인증 완료" />
      </TagGroupRoot>

      <CatalogSectionHeader>Custom separator</CatalogSectionHeader>
      <TagGroupRoot size="t2" separator=" / ">
        <TagGroupItem label="서울" />
        <TagGroupItem label="관악구" />
        <TagGroupItem label="봉천동" />
      </TagGroupRoot>
    </CatalogExamples>
  );
}

export function TagGroupPage() {
  return (
    <VariantCatalog variants={variants} examples={<TagGroupExamples />}>
      {(values) => renderTagGroup(values)}
    </VariantCatalog>
  );
}
