import type { ComponentType } from '@lynx-js/react';
import { vars } from '@seed-design/lynx-css/vars';

const { $color } = vars;

const COLUMN_COUNT = 4;
const ITEM_HEIGHT = 76;
const PRELOAD_ITEM_COUNT = COLUMN_COUNT * 8;

interface IconProps {
  color?: string;
  size?: number;
}

export interface IconEntry {
  component: ComponentType<IconProps>;
  name: string;
}

interface VirtualIconGridProps {
  iconColor?: string;
  icons: IconEntry[];
  packageName: string;
  title: string;
}

export function VirtualIconGrid({
  iconColor,
  icons,
  packageName,
  title,
}: VirtualIconGridProps) {
  return (
    <view
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minHeight: 0,
        paddingLeft: '16px',
        paddingRight: '16px',
      }}
    >
      <text style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</text>
      <text
        style={{
          fontSize: '13px',
          color: $color.fg.neutralSubtle,
          marginBottom: '8px',
        }}
      >
        {packageName} — {icons.length} icons
      </text>

      <list
        list-type="flow"
        span-count={COLUMN_COUNT}
        scroll-orientation="vertical"
        preload-buffer-count={PRELOAD_ITEM_COUNT}
        style={{ flex: 1, height: '100%', width: '100%' }}
      >
        {icons.map(({ component: IconComp, name }) => (
          <list-item
            key={name}
            item-key={name}
            estimated-main-axis-size-px={ITEM_HEIGHT}
            reuse-identifier="icon-cell"
          >
            <view
              style={{
                height: `${ITEM_HEIGHT}px`,
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              {iconColor == null ? (
                <IconComp size={24} />
              ) : (
                <IconComp size={24} color={iconColor} />
              )}
              <text
                style={{
                  height: '24px',
                  fontSize: '9px',
                  lineHeight: '10px',
                  color: $color.fg.neutralMuted,
                  textAlign: 'center',
                  wordBreak: 'break-all',
                }}
              >
                {name}
              </text>
            </view>
          </list-item>
        ))}
      </list>
    </view>
  );
}
