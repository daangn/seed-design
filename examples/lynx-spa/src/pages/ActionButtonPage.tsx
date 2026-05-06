import IconChevronDownFill from '@karrotmarket/lynx-monochrome-icon/IconChevronDownFill';
import IconPlusFill from '@karrotmarket/lynx-monochrome-icon/IconPlusFill';

import { ActionButton } from '../seed-design/ui/action-button';

export function ActionButtonPage() {
  return (
    <scroll-view scroll-y style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>ActionButton</text>

      <text style={{ fontSize: '16px', fontWeight: 'bold' }}>Variants</text>
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

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Sizes
      </text>
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

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Disabled
      </text>
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

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Prefix / Suffix Icon
      </text>
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
        <ActionButton variant="neutralSolid" suffixIcon={<IconChevronDownFill />}>
          Suffix Icon
        </ActionButton>
        <ActionButton
          variant="brandOutline"
          prefixIcon={<IconPlusFill />}
          suffixIcon={<IconChevronDownFill />}
        >
          Both
        </ActionButton>
        <ActionButton variant="brandSolid" disabled prefixIcon={<IconPlusFill />}>
          Disabled
        </ActionButton>
      </view>

      <text style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '8px' }}>
        Icon Only
      </text>
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
          aria-label="추가"
        />
        <ActionButton
          layout="iconOnly"
          variant="neutralSolid"
          size="small"
          icon={<IconPlusFill />}
          aria-label="추가"
        />
        <ActionButton
          layout="iconOnly"
          variant="brandOutline"
          icon={<IconPlusFill />}
          aria-label="추가"
        />
        <ActionButton
          layout="iconOnly"
          variant="brandSolid"
          disabled
          icon={<IconPlusFill />}
          aria-label="비활성"
        />
      </view>
    </scroll-view>
  );
}
