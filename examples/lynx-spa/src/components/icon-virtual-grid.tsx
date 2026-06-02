import { vars } from "@seed-design/lynx-css/vars";
import { Icon as SeedIcon } from "@seed-design/lynx-react";

import { chunkIconEntries, type IconEntry } from "./icon-grid-rows";

export type { IconEntry, IconProps } from "./icon-grid-rows";

const { $color } = vars;

const COLUMN_COUNT = 4;
const ITEM_HEIGHT = 76;
const PRELOAD_ROW_COUNT = 8;

// Row-level virtualization needs stable list-item metrics before the first scroll.
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
  width: "25%",
} as const;

const iconLabelStyle = {
  color: $color.fg.neutralMuted,
  fontSize: "9px",
  height: "24px",
  lineHeight: "10px",
  textAlign: "center",
  wordBreak: "break-all",
} as const;

const iconRowStyle = {
  display: "flex",
  flexDirection: "row",
  height: `${ITEM_HEIGHT}px`,
  width: "100%",
} as const;

interface VirtualIconGridProps {
  iconColor?: string;
  icons: IconEntry[];
  packageName: string;
  title: string;
}

export function VirtualIconGrid({ iconColor, icons, packageName, title }: VirtualIconGridProps) {
  const iconRows = chunkIconEntries(icons, COLUMN_COUNT);

  return (
    <view className="flex flex-1 min-h-0 flex-col px-x4">
      <text style={titleStyle}>{title}</text>
      <text style={subtitleStyle}>
        {packageName} - {icons.length} icons
      </text>

      <list
        list-type="single"
        span-count={1}
        scroll-orientation="vertical"
        preload-buffer-count={PRELOAD_ROW_COUNT}
        style={iconListStyle}
      >
        {iconRows.map((row) => (
          <list-item
            key={`icon-row-${row[0]?.name}`}
            item-key={`icon-row-${row[0]?.name}`}
            estimated-main-axis-size-px={ITEM_HEIGHT}
            reuse-identifier="icon-row"
          >
            <view style={iconRowStyle}>
              {row.map(({ component: IconComp, name }) => (
                <view key={name} style={iconCellStyle}>
                  {iconColor == null ? (
                    <IconComp size={24} />
                  ) : (
                    <SeedIcon icon={<IconComp />} size={24} color={iconColor} />
                  )}
                  <text style={iconLabelStyle}>{name}</text>
                </view>
              ))}
            </view>
          </list-item>
        ))}
      </list>
    </view>
  );
}
