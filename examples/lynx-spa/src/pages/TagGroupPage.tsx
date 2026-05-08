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
  TagGroupItemLabel,
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
      <TagGroupItem>
        <TagGroupItemLabel>동네 인증</TagGroupItemLabel>
      </TagGroupItem>
      <TagGroupItem>
        <TagGroupItemLabel>매너 온도 42.0°C</TagGroupItemLabel>
      </TagGroupItem>
      <TagGroupItem>
        <TagGroupItemLabel>재거래 희망률 89%</TagGroupItemLabel>
      </TagGroupItem>
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
        <TagGroupItem>
          <TagGroupItemLabel>동네 인증</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>매너 온도 42.0°C</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>재거래 희망률 89%</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <CatalogSectionHeader>Weight: bold</CatalogSectionHeader>
      <TagGroupRoot size="t2" weight="bold">
        <TagGroupItem>
          <TagGroupItemLabel>전체</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>인기</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>최신</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <CatalogSectionHeader>Tone: neutral</CatalogSectionHeader>
      <TagGroupRoot size="t2" tone="neutral">
        <TagGroupItem>
          <TagGroupItemLabel>새 상품</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>배송비 포함</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <CatalogSectionHeader>Tone: brand</CatalogSectionHeader>
      <TagGroupRoot size="t2" tone="brand" weight="bold">
        <TagGroupItem>
          <TagGroupItemLabel>추천</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>방금 등록</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <CatalogSectionHeader>Per-item override</CatalogSectionHeader>
      <TagGroupRoot size="t2">
        <TagGroupItem tone="brand" weight="bold">
          <TagGroupItemLabel>NEW</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>무료 나눔</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem tone="neutral">
          <TagGroupItemLabel>직거래 선호</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <CatalogSectionHeader>Wrap behaviour</CatalogSectionHeader>
      <TagGroupRoot size="t2">
        <TagGroupItem>
          <TagGroupItemLabel>관악구 봉천동</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>재거래 희망 89%</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>매너 온도 42.0°C</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>평균 응답 12분</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>판매자 인증 완료</TagGroupItemLabel>
        </TagGroupItem>
      </TagGroupRoot>

      <CatalogSectionHeader>Custom separator</CatalogSectionHeader>
      <TagGroupRoot size="t2" separator=" / ">
        <TagGroupItem>
          <TagGroupItemLabel>서울</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>관악구</TagGroupItemLabel>
        </TagGroupItem>
        <TagGroupItem>
          <TagGroupItemLabel>봉천동</TagGroupItemLabel>
        </TagGroupItem>
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
