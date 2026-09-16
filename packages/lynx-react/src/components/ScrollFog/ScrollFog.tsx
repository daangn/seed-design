import { scrollFog as scrollFogVars } from "@seed-design/lynx-css/vars/component";
import * as React from "@lynx-js/react";
import type {
  ForwardRefExoticComponent,
  PropsWithoutRef,
  ReactNode,
  RefAttributes,
} from "@lynx-js/react";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";

type NativeViewProps = Omit<IntrinsicElements["view"], `main-thread:${string}`>;
type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type ScrollFogPlacement = "top" | "bottom" | "left" | "right";

type SizesConfig = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

const DIRECTIONS: Record<ScrollFogPlacement, string> = {
  top: "to bottom",
  bottom: "to top",
  left: "to right",
  right: "to left",
};

const OPAQUE_MASK = "linear-gradient(#000000ff, #000000ff)";
const DEFAULT_SIZE = scrollFogVars.base.enabled.root.size;
const FILL_STYLE = { width: "100%", height: "100%" } as const;

function normalizeSize(size: number | string): string {
  return typeof size === "number" ? `${size}px` : size;
}

function buildGradient(direction: string): string {
  const stops = scrollFogVars.base.enabled.root.gradient.stops
    .map(({ color, position }) => `${color} ${Number((position * 100).toFixed(6))}%`)
    .join(", ");

  return `linear-gradient(${direction}, ${stops})`;
}

function createMaskStyle(edge: ScrollFogPlacement, enabled: boolean, size: string): CSSProperties {
  if (!enabled) {
    return {
      ...FILL_STYLE,
      maskImage: OPAQUE_MASK,
      maskPosition: "top left",
      maskRepeat: "no-repeat",
      maskSize: "100% 100%",
      pointerEvents: "none",
    };
  }

  const isVertical = edge === "top" || edge === "bottom";
  const gradientPosition = edge;
  const opaquePosition =
    edge === "top" ? "bottom" : edge === "bottom" ? "top" : edge === "left" ? "right" : "left";

  return {
    ...FILL_STYLE,
    maskImage: `${buildGradient(DIRECTIONS[edge])}, ${OPAQUE_MASK}`,
    maskPosition: `${gradientPosition}, ${opaquePosition}`,
    maskRepeat: "no-repeat",
    maskSize: isVertical
      ? `100% ${size}, 100% calc(100% - ${size})`
      : `${size} 100%, calc(100% - ${size}) 100%`,
    pointerEvents: "none",
  };
}

const VERTICAL_SCROLL_VIEW_STYLE: CSSProperties = {
  ...FILL_STYLE,
  pointerEvents: "auto",
};

const HORIZONTAL_SCROLL_VIEW_STYLE: CSSProperties = {
  width: "100%",
  pointerEvents: "auto",
};

/**
 * @platform Lynx
 *
 * A two-axis scroll area with independently configurable edge masks.
 */
export interface ScrollFogProps extends Omit<NativeViewProps, "children" | "className" | "style"> {
  children?: ReactNode;
  className?: NativeViewProps["className"];
  style?: NativeViewProps["style"];
  /**
   * Fog 효과를 표시할 방향입니다.
   * @defaultValue ["top", "bottom"]
   */
  placement?: ScrollFogPlacement[];
  /**
   * Fog 효과의 크기입니다. 숫자는 px 단위로 처리합니다.
   * @defaultValue 20
   */
  size?: number | string;
  /** 방향별 Fog 효과의 크기입니다. 숫자는 px 단위로 처리합니다. */
  sizes?: SizesConfig;
  /**
   * Native scroll indicator를 숨깁니다.
   * @defaultValue false
   */
  hideScrollBar?: boolean;
}

export const ScrollFog: LynxForwardRefComponent<NodesRef, ScrollFogProps> = React.forwardRef<
  NodesRef,
  ScrollFogProps
>((props, forwardedRef) => {
  const {
    children,
    className,
    style,
    placement = ["top", "bottom"],
    size = DEFAULT_SIZE,
    sizes,
    hideScrollBar = false,
    ...rootProps
  } = props;
  const normalizedSize = normalizeSize(size);
  const topSize = sizes?.top ? normalizeSize(sizes.top) : normalizedSize;
  const bottomSize = sizes?.bottom ? normalizeSize(sizes.bottom) : normalizedSize;
  const leftSize = sizes?.left ? normalizeSize(sizes.left) : normalizedSize;
  const rightSize = sizes?.right ? normalizeSize(sizes.right) : normalizedSize;
  const scrollBarEnabled = !hideScrollBar;

  return (
    <view
      {...(forwardedRef ? ({ ref: forwardedRef } as Record<string, unknown>) : {})}
      {...rootProps}
      className={className}
      style={style}
    >
      <view flatten={false} style={createMaskStyle("top", placement.includes("top"), topSize)}>
        <view
          flatten={false}
          style={createMaskStyle("bottom", placement.includes("bottom"), bottomSize)}
        >
          <view
            flatten={false}
            style={createMaskStyle("left", placement.includes("left"), leftSize)}
          >
            <view
              flatten={false}
              style={createMaskStyle("right", placement.includes("right"), rightSize)}
            >
              <scroll-view
                enable-nested-scroll
                scroll-bar-enable={scrollBarEnabled}
                scroll-orientation="vertical"
                style={VERTICAL_SCROLL_VIEW_STYLE}
              >
                <scroll-view
                  enable-nested-scroll
                  scroll-bar-enable={scrollBarEnabled}
                  scroll-orientation="horizontal"
                  style={HORIZONTAL_SCROLL_VIEW_STYLE}
                >
                  {children}
                </scroll-view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>
    </view>
  );
});
ScrollFog.displayName = "ScrollFog";
