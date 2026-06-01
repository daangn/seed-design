import type { ComponentType } from "@lynx-js/react";

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

interface IconRow {
  emptyKeys: string[];
  icons: IconEntry[];
  key: string;
}

const COLUMN_COUNT = 4;
const EMPTY_CELL_KEYS = ["empty-a", "empty-b", "empty-c"];

function chunkIconRows(icons: IconEntry[]) {
  const rows: IconRow[] = [];

  for (let index = 0; index < icons.length; index += COLUMN_COUNT) {
    const rowIcons = icons.slice(index, index + COLUMN_COUNT);
    const rowKey = rowIcons.map(({ name }) => name).join(":");
    const emptyKeys = EMPTY_CELL_KEYS.slice(0, COLUMN_COUNT - rowIcons.length).map(
      (key) => `${rowKey}:${key}`,
    );

    rows.push({ emptyKeys, icons: rowIcons, key: rowKey });
  }

  return rows;
}

export function VirtualIconGrid({ iconColor, icons, packageName, title }: VirtualIconGridProps) {
  const rows = chunkIconRows(icons);

  return (
    <view className="lynx-icon-grid-page">
      <view className="lynx-icon-grid-header">
        <text className="lynx-icon-grid-title">{title}</text>
        <text className="lynx-icon-grid-subtitle">
          {packageName} - {icons.length} icons
        </text>
      </view>

      <scroll-view scroll-y className="lynx-icon-grid-scroll">
        <view className="lynx-icon-grid-content">
          {rows.map((row) => (
            <view key={row.key} className="lynx-icon-grid-row">
              {row.icons.map(({ component: IconComp, name }) => (
                <view key={name} className="lynx-icon-grid-cell">
                  <view className="lynx-icon-grid-icon">
                    {iconColor == null ? (
                      <IconComp size={28} />
                    ) : (
                      <IconComp size={28} color={iconColor} />
                    )}
                  </view>
                  <text className="lynx-icon-grid-label">{name}</text>
                </view>
              ))}
              {row.emptyKeys.map((key) => (
                <view key={key} className="lynx-icon-grid-placeholder" />
              ))}
            </view>
          ))}
        </view>
      </scroll-view>
    </view>
  );
}
