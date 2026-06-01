import type { ComponentType } from "@lynx-js/react";
import { vars } from "@seed-design/lynx-css/vars";

const { $color } = vars;

const COLUMN_COUNT = 4;
const ITEM_HEIGHT = 76;
const PRELOAD_ITEM_COUNT = COLUMN_COUNT * 8;

export interface IconProps {
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

export function VirtualIconGrid({ iconColor, icons, packageName, title }: VirtualIconGridProps) {
  return (
    <view
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        minHeight: 0,
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <text
        style={{
          color: $color.fg.neutral,
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        {title}
      </text>
      <text
        style={{
          color: $color.fg.neutralSubtle,
          fontSize: "13px",
          marginBottom: "8px",
        }}
      >
        {packageName} - {icons.length} icons
      </text>

      <list
        list-type="flow"
        span-count={COLUMN_COUNT}
        scroll-orientation="vertical"
        preload-buffer-count={PRELOAD_ITEM_COUNT}
        style={{ flex: 1, height: "100%", width: "100%" }}
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
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                height: `${ITEM_HEIGHT}px`,
                justifyContent: "center",
                padding: "8px 4px",
              }}
            >
              {iconColor == null ? (
                <IconComp size={24} />
              ) : (
                <IconComp size={24} color={iconColor} />
              )}
              <text
                style={{
                  color: $color.fg.neutralMuted,
                  fontSize: "9px",
                  height: "24px",
                  lineHeight: "10px",
                  textAlign: "center",
                  wordBreak: "break-all",
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
