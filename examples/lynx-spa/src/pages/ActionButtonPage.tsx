import IconChevronDownFill from '@karrotmarket/lynx-monochrome-icon/IconChevronDownFill';
import IconPlusFill from '@karrotmarket/lynx-monochrome-icon/IconPlusFill';
import { actionButtonVariantMap } from '@seed-design/lynx-css/recipes/action-button';

import {
  CatalogExamples,
  CatalogSectionTitle,
} from '../components/catalog-examples.jsx';
import {
  type VariantAxis,
  VariantCatalog,
  type VariantValues,
} from '../components/variant-catalog.jsx';
import {
  ActionButton,
  type ActionButtonProps,
} from '../seed-design/ui/action-button';

type ActionButtonVariant = NonNullable<ActionButtonProps['variant']>;
type ActionButtonSize = NonNullable<ActionButtonProps['size']>;
type ActionButtonLayout = NonNullable<ActionButtonProps['layout']>;

const variants: readonly VariantAxis[] = [
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
];

function renderActionButton(values: VariantValues) {
  const layout = values.layout as ActionButtonLayout;
  const size = values.size as ActionButtonSize;
  const variant = values.variant as ActionButtonVariant;
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
        icon={<IconPlusFill />}
        aria-label="Add"
      />
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
        <ActionButton variant="brandSolid" prefixIcon={<IconPlusFill />}>
          Prefix Icon
        </ActionButton>
        <ActionButton
          variant="neutralSolid"
          suffixIcon={<IconChevronDownFill />}
        >
          Suffix Icon
        </ActionButton>
        <ActionButton
          variant="brandOutline"
          prefixIcon={<IconPlusFill />}
          suffixIcon={<IconChevronDownFill />}
        >
          Both
        </ActionButton>
        <ActionButton
          variant="brandSolid"
          disabled
          prefixIcon={<IconPlusFill />}
        >
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
        <ActionButton
          variant="neutralSolid"
          prefixIcon={<IconPlusFill />}
          loading
        >
          Prefix Icon
        </ActionButton>
        <ActionButton
          variant="brandOutline"
          suffixIcon={<IconChevronDownFill />}
          loading
        >
          Suffix Icon
        </ActionButton>
        <ActionButton
          layout="iconOnly"
          variant="brandSolid"
          icon={<IconPlusFill />}
          loading
          aria-label="Loading"
        />
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
        <ActionButton
          layout="iconOnly"
          variant="brandSolid"
          icon={<IconPlusFill />}
          aria-label="Add"
        />
        <ActionButton
          layout="iconOnly"
          variant="neutralSolid"
          size="small"
          icon={<IconPlusFill />}
          aria-label="Add"
        />
        <ActionButton
          layout="iconOnly"
          variant="brandOutline"
          icon={<IconPlusFill />}
          aria-label="Add"
        />
        <ActionButton
          layout="iconOnly"
          variant="brandSolid"
          disabled
          icon={<IconPlusFill />}
          aria-label="Disabled"
        />
      </view>
    </CatalogExamples>
  );
}

export function ActionButtonPage() {
  return (
    <VariantCatalog variants={variants} examples={<ActionButtonExamples />}>
      {(values) => renderActionButton(values)}
    </VariantCatalog>
  );
}
