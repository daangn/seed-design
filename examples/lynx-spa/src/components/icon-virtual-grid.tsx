import type { ComponentType } from "@lynx-js/react";
import { Icon as SeedIcon, type LynxIconElementProps } from "@seed-design/lynx-react";

const COLUMN_COUNT = 4;
const ITEM_HEIGHT = 76;
const PRELOAD_ITEM_COUNT = COLUMN_COUNT * 8;

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
      <text className="t6-bold text-fg-neutral">{title}</text>
      <text className="t2-regular mb-x2 text-fg-neutral-subtle">
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
              className="flex flex-col items-center justify-center gap-x1 px-x1 py-x2"
              style={{
                height: `${ITEM_HEIGHT}px`,
              }}
            >
              {iconColor == null ? (
                <IconComp size={24} />
              ) : (
                <SeedIcon icon={<IconComp />} size={24} color={iconColor} />
              )}
              <text
                className="h-[24px] break-all text-center text-[9px] leading-[10px] text-fg-neutral-muted"
                style={{
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
