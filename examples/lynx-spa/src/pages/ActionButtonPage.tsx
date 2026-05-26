import IconChevronDownFill from '@karrotmarket/lynx-monochrome-icon/IconChevronDownFill';
import IconPlusFill from '@karrotmarket/lynx-monochrome-icon/IconPlusFill';
import { actionButtonVariantMap } from '@seed-design/lynx-css/recipes/action-button';
import {
  ActionButton,
  Icon,
  PrefixIcon,
  SuffixIcon,
} from '@seed-design/lynx-react';

import {
  CatalogExamples,
  CatalogSectionTitle,
} from '../components/catalog-examples.jsx';
import {
  definePreviewStates,
  defineVariantAxes,
  VariantCatalog,
  type VariantCatalogValues,
} from '../components/variant-catalog.jsx';

const variants = defineVariantAxes([
  {
    key: 'variant',
    options: actionButtonVariantMap.variant,
    defaultValue: 'brandSolid',
  },
  {
    key: 'size',
    options: actionButtonVariantMap.size,
    defaultValue: 'medium',
  },
  {
    key: 'layout',
    options: actionButtonVariantMap.layout,
    defaultValue: 'withText',
  },
  {
    key: 'disabled',
    options: actionButtonVariantMap.disabled,
    defaultValue: false,
  },
  {
    key: 'loading',
    options: actionButtonVariantMap.loading,
    defaultValue: false,
  },
]);

const previewStates = definePreviewStates([
  { key: 'disabled', defaultValue: false },
  { key: 'loading', defaultValue: false },
]);

type ActionButtonValues = VariantCatalogValues<
  typeof variants,
  typeof previewStates
>;

function renderActionButton(values: ActionButtonValues) {
  const { layout, size, variant } = values;
  const disabled = Boolean(values.disabled);
  const loading = Boolean(values.loading);

  if (layout === 'iconOnly') {
    return (
      <ActionButton
        layout="iconOnly"
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        aria-label="Add"
      >
        <Icon icon={<IconPlusFill />} />
      </ActionButton>
    );
  }

  return (
    <ActionButton
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
    >
      Action
    </ActionButton>
  );
}

function ActionButtonExamples() {
  return (
    <CatalogExamples title="ActionButton" gap="12px">
      <CatalogSectionTitle>Variants</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <ActionButton variant="brandSolid">Brand Solid</ActionButton>
        <ActionButton variant="neutralSolid">Neutral Solid</ActionButton>
        <ActionButton variant="neutralWeak">Neutral Weak</ActionButton>
        <ActionButton variant="criticalSolid">Critical Solid</ActionButton>
        <ActionButton variant="brandOutline">Brand Outline</ActionButton>
        <ActionButton variant="neutralOutline">Neutral Outline</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
      </view>

      <CatalogSectionTitle>Sizes</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <ActionButton size="xsmall">XSmall</ActionButton>
        <ActionButton size="small">Small</ActionButton>
        <ActionButton size="medium">Medium</ActionButton>
        <ActionButton size="large">Large</ActionButton>
      </view>

      <CatalogSectionTitle>Disabled</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <ActionButton variant="brandSolid" disabled>
          Disabled
        </ActionButton>
        <ActionButton variant="neutralOutline" disabled>
          Disabled Outline
        </ActionButton>
      </view>

      <CatalogSectionTitle>Prefix / Suffix Icon</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <ActionButton variant="brandSolid">
          <PrefixIcon icon={<IconPlusFill />} />
          Prefix Icon
        </ActionButton>
        <ActionButton variant="neutralSolid">
          Suffix Icon
          <SuffixIcon icon={<IconChevronDownFill />} />
        </ActionButton>
        <ActionButton variant="brandOutline">
          <PrefixIcon icon={<IconPlusFill />} />
          Both
          <SuffixIcon icon={<IconChevronDownFill />} />
        </ActionButton>
        <ActionButton variant="brandSolid" disabled>
          <PrefixIcon icon={<IconPlusFill />} />
          Disabled
        </ActionButton>
      </view>

      <CatalogSectionTitle>Loading</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <ActionButton variant="brandSolid" loading>
          Loading
        </ActionButton>
        <ActionButton variant="neutralSolid" loading>
          <PrefixIcon icon={<IconPlusFill />} />
          Prefix Icon
        </ActionButton>
        <ActionButton variant="brandOutline" loading>
          Suffix Icon
          <SuffixIcon icon={<IconChevronDownFill />} />
        </ActionButton>
        <ActionButton
          layout="iconOnly"
          variant="brandSolid"
          loading
          aria-label="Loading"
        >
          <Icon icon={<IconPlusFill />} />
        </ActionButton>
      </view>

      <CatalogSectionTitle>Icon Only</CatalogSectionTitle>
      <view
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <ActionButton layout="iconOnly" variant="brandSolid" aria-label="Add">
          <Icon icon={<IconPlusFill />} />
        </ActionButton>
        <ActionButton
          layout="iconOnly"
          variant="neutralSolid"
          size="small"
          aria-label="Add"
        >
          <Icon icon={<IconPlusFill />} />
        </ActionButton>
        <ActionButton layout="iconOnly" variant="brandOutline" aria-label="Add">
          <Icon icon={<IconPlusFill />} />
        </ActionButton>
        <ActionButton
          layout="iconOnly"
          variant="brandSolid"
          disabled
          aria-label="Disabled"
        >
          <Icon icon={<IconPlusFill />} />
        </ActionButton>
      </view>
    </CatalogExamples>
  );
}

export function ActionButtonPage() {
  return (
    <VariantCatalog
      variants={variants}
      previewStates={previewStates}
      examples={<ActionButtonExamples />}
    >
      {(values) => renderActionButton(values)}
    </VariantCatalog>
  );
}
