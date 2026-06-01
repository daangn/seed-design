import type { ComponentType } from "@lynx-js/react";

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
    <view className="flex flex-1 min-h-0 flex-col bg-bg-layer-default">
      <view className="px-x4 pt-x1 pb-x3 border-b border-stroke-neutral-subtle bg-bg-layer-default">
        <text className="t7-bold text-fg-neutral">{title}</text>
        <text className="t2-regular text-fg-neutral-subtle mt-x0_5">
          {packageName} - {icons.length} icons
        </text>
      </view>

      <scroll-view scroll-y className="flex-1 min-h-0 w-full">
        <view className="px-x4 pt-x3 pb-x16 flex flex-col gap-x2">
          {rows.map((row) => (
            <view key={row.key} className="flex flex-row gap-x2">
              {row.icons.map(({ component: IconComp, name }) => (
                <view
                  key={name}
                  className="flex-1 min-w-0 h-[104px] py-x2 px-x1 rounded-r2 border border-stroke-neutral-subtle bg-bg-layer-fill flex flex-col items-center justify-center gap-x1"
                >
                  <view className="h-x8 flex items-center justify-center">
                    {iconColor == null ? (
                      <IconComp size={28} />
                    ) : (
                      <IconComp size={28} color={iconColor} />
                    )}
                  </view>
                  <text className="h-x8 t1-regular text-fg-neutral-muted text-center break-all">
                    {name}
                  </text>
                </view>
              ))}
              {row.emptyKeys.map((key) => (
                <view key={key} className="flex-1 min-w-0 h-[104px]" />
              ))}
            </view>
          ))}
        </view>
      </scroll-view>
    </view>
  );
}
