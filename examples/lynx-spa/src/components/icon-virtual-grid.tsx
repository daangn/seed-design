import type { ComponentType } from "@lynx-js/react";
import { vars } from "@seed-design/lynx-css/vars";
import { Icon as SeedIcon, type LynxIconElementProps } from "@seed-design/lynx-react";

const { $color } = vars;

const COLUMN_COUNT = 4;
const ITEM_HEIGHT = 76;
const PRELOAD_ITEM_COUNT = COLUMN_COUNT * 8;

// Flow-list positions reused cells from measured inline layout, so keep these metrics explicit.
const titleStyle = {
  color: $color.fg.neutral,
  fontSize: "20px",
  fontWeight: "bold",
} as const;

const subtitleStyle = {
  color: $color.fg.neutralSubtle,
  fontSize: "13px",
  marginBottom: "8px",
} as const;

const iconListStyle = {
  flex: 1,
  height: "100%",
  width: "100%",
} as const;

const iconCellStyle = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  height: `${ITEM_HEIGHT}px`,
  justifyContent: "center",
  padding: "8px 4px",
} as const;

const iconLabelStyle = {
  color: $color.fg.neutralMuted,
  fontSize: "9px",
  height: "24px",
  lineHeight: "10px",
  textAlign: "center",
  wordBreak: "break-all",
} as const;

export interface IconProps extends LynxIconElementProps {
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
    <view className="flex flex-1 min-h-0 flex-col px-x4">
      <text style={titleStyle}>{title}</text>
      <text style={subtitleStyle}>
        {packageName} - {icons.length} icons
      </text>

      <list
        list-type="flow"
        span-count={COLUMN_COUNT}
        scroll-orientation="vertical"
        preload-buffer-count={PRELOAD_ITEM_COUNT}
        style={iconListStyle}
      >
        {icons.map(({ component: IconComp, name }) => (
          <list-item
            key={name}
            item-key={name}
            estimated-main-axis-size-px={ITEM_HEIGHT}
            reuse-identifier="icon-cell"
          >
            <view style={iconCellStyle}>
              {iconColor == null ? (
                <IconComp size={24} />
              ) : (
                <SeedIcon icon={<IconComp />} size={24} color={iconColor} />
              )}
              <text style={iconLabelStyle}>{name}</text>
            </view>
          </list-item>
        ))}
      </list>
    </view>
  );
}
