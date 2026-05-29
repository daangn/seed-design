import type { ComponentType } from "@lynx-js/react";

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

export function VirtualIconGrid({ iconColor, icons, packageName, title }: VirtualIconGridProps) {
  return (
    <view className="flex flex-1 flex-col min-h-0 px-x4">
      <text className="t7-bold text-fg-neutral">{title}</text>
      <text className="t3-regular text-fg-neutral-subtle mb-x2">
        {packageName} — {icons.length} icons
      </text>

      <list
        list-type="flow"
        span-count={COLUMN_COUNT}
        scroll-orientation="vertical"
        preload-buffer-count={PRELOAD_ITEM_COUNT}
        className="flex-1 h-full w-full"
      >
        {icons.map(({ component: IconComp, name }) => (
          <list-item
            key={name}
            item-key={name}
            estimated-main-axis-size-px={ITEM_HEIGHT}
            reuse-identifier="icon-cell"
          >
            <view className="h-[76px] py-x2 px-x1 flex flex-col items-center justify-center gap-x1">
              {iconColor == null ? (
                <IconComp size={24} />
              ) : (
                <IconComp size={24} color={iconColor} />
              )}
              <text className="h-x6 text-[9px] leading-[10px] text-fg-neutral-muted text-center break-all">
                {name}
              </text>
            </view>
          </list-item>
        ))}
      </list>
    </view>
  );
}
