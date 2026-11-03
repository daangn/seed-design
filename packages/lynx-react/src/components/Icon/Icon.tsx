import { useMainThreadRef } from "@lynx-js/react";
import type { CSSProperties, MainThread } from "@lynx-js/types";
import clsx from "clsx";
import * as React from "@lynx-js/react";
import {
  cloneElement,
  type DependencyList,
  isValidElement,
  type ReactElement,
} from "@lynx-js/react";

import { useIconColor } from "../../hooks/useIconColor";
import type { LynxHostProps, LynxIconElementProps, LynxViewRef } from "../../types";
import { handleColor, handleDimension, type StyleProps } from "../../utils/styled";
import { mergeProps } from "../../utils/merge-props";

import {
  IconSlotContext,
  IconRequiredContext,
  iconSlotMarker,
  type IconSlotName,
} from "./icon-context";
export { IconRequired, IconSlotProvider, getIconSlotName, type IconSlotName } from "./icon-context";
const seedMulticolorIconMarker = Symbol.for("@seed-design/multicolor-icon");
interface MulticolorIconComponent {
  [seedMulticolorIconMarker]?: boolean;
}
interface IconSlotComponent {
  [iconSlotMarker]?: IconSlotName;
}
function isMulticolorIcon(node: React.ReactNode): boolean {
  if (!isValidElement(node)) return false;
  if (node.type == null || (typeof node.type !== "function" && typeof node.type !== "object")) {
    return false;
  }

  return (node.type as MulticolorIconComponent)[seedMulticolorIconMarker] === true;
}

////////////////////////////////////////////////////////////////////////////////////

export interface IconProps extends Omit<LynxHostProps<"view">, "children"> {
  icon: ReactElement<LynxIconElementProps>;
  size?: StyleProps["height"] | number;
  color?: StyleProps["color"];
  /**
   * 자동 감지되지 않는 멀티컬러 아이콘의 원본 색상을 유지합니다.
   * @default false
   */
  multicolor?: boolean;
}

/** React와 같이 크기와 색상은 감싼 컴포넌트의 recipe slot이 정합니다. */
export interface PrefixIconProps extends Omit<IconProps, "size" | "color"> {}

/** React와 같이 크기와 색상은 감싼 컴포넌트의 recipe slot이 정합니다. */
export interface SuffixIconProps extends Omit<IconProps, "size" | "color"> {}

interface IconSlotBaseProps extends IconProps {
  slot: IconSlotName | null;
  baseClassName?: string;
}

function mergeWrapperStyle({
  size,
  color,
  style,
}: Pick<IconProps, "size" | "color" | "style">): CSSProperties | undefined {
  const dimension = handleDimension(size);
  const resolvedColor = handleColor(color);

  if (dimension == null && resolvedColor == null) return style;

  return {
    ...(dimension != null ? { width: dimension, height: dimension } : {}),
    ...(resolvedColor != null ? { color: resolvedColor } : {}),
    ...style,
  };
}

function getStyleColor(style: CSSProperties | undefined): CSSProperties["color"] {
  return style?.color;
}

const IconSlotBase = /* @__PURE__ */ React.forwardRef<unknown, IconSlotBaseProps>((props, ref) => {
  const {
    icon,
    slot,
    baseClassName,
    className,
    style,
    size,
    color,
    multicolor = false,
    ...nativeProps
  } = props;
  const context = React.useContext(IconSlotContext);
  const iconRequiredContext = React.useContext(IconRequiredContext);
  const sourceRef = useMainThreadRef<MainThread.Element>(null);
  const slotClassName = slot != null ? context?.classNames?.[slot] : undefined;
  const styleColor = getStyleColor(style);
  const shouldPreserveOriginalColor = multicolor || isMulticolorIcon(icon);
  const iconColor = useIconColor(
    [baseClassName, slotClassName, className, size, color, styleColor, ...(context?.deps ?? [])],
    { sourceRef, enabled: !shouldPreserveOriginalColor },
  );
  const hasValidIcon = isValidElement<LynxIconElementProps>(icon);

  React.useLayoutEffect(() => {
    if (slot !== "icon" || !hasValidIcon) return;

    iconRequiredContext?.register();
    return () => {
      iconRequiredContext?.unregister();
    };
  }, [hasValidIcon, iconRequiredContext, slot]);

  if (!hasValidIcon) return null;

  return (
    <view
      {...mergeProps(
        { "main-thread:ref": sourceRef, "accessibility-elements-hidden": true },
        ref ? { ref: ref as LynxViewRef } : {},
        nativeProps,
      )}
      className={clsx(
        slotClassName && baseClassName ? `${baseClassName}-slot` : baseClassName,
        slotClassName,
        className,
      )}
      style={mergeWrapperStyle({ size, color, style })}
    >
      {cloneElement(icon, {
        ...iconColor,
        className: icon.props.className,
        style: {
          ...icon.props.style,
          width: "100%",
          height: "100%",
        },
      })}
    </view>
  );
});
IconSlotBase.displayName = "IconSlotBase";

////////////////////////////////////////////////////////////////////////////////////

function createIconComponent<Props extends PrefixIconProps>(
  displayName: string,
  slot: IconSlotName,
  baseClassName: string,
) {
  const Component = React.forwardRef<unknown, Props>((props, ref) => {
    return (
      <IconSlotBase
        {...mergeProps(ref ? { ref } : {}, props)}
        slot={slot}
        baseClassName={baseClassName}
      />
    );
  });

  Component.displayName = displayName;
  (Component as IconSlotComponent)[iconSlotMarker] = slot;

  return Component;
}

export const Icon = /* @__PURE__ */ createIconComponent<IconProps>("Icon", "icon", "seed-icon");
export const PrefixIcon = /* @__PURE__ */ createIconComponent<PrefixIconProps>(
  "PrefixIcon",
  "prefixIcon",
  "seed-prefix-icon",
);
export const SuffixIcon = /* @__PURE__ */ createIconComponent<SuffixIconProps>(
  "SuffixIcon",
  "suffixIcon",
  "seed-suffix-icon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface InternalIconProps extends Omit<LynxHostProps<"view">, "children"> {
  icon: ReactElement<LynxIconElementProps>;
  deps?: DependencyList;
  disableDefaultResize?: boolean;
}

export const InternalIcon = /* @__PURE__ */ React.forwardRef<unknown, InternalIconProps>(
  (props, ref) => {
    const {
      icon,
      deps = [],
      className,
      style,
      disableDefaultResize = false,
      ...nativeProps
    } = props;
    const sourceRef = useMainThreadRef<MainThread.Element>(null);
    const styleColor = getStyleColor(style);
    const iconColor = useIconColor([className, styleColor, ...(deps ?? [])], { sourceRef });

    if (!isValidElement<LynxIconElementProps>(icon)) return null;

    return (
      <view
        {...mergeProps(
          { "main-thread:ref": sourceRef },
          ref ? { ref: ref as LynxViewRef } : {},
          nativeProps,
        )}
        className={className}
        style={style}
      >
        {cloneElement(icon, {
          ...iconColor,
          ...(disableDefaultResize ? { "disable-default-resize": true } : {}),
          className: icon.props.className,
          style: {
            ...icon.props.style,
            width: "100%",
            height: "100%",
          },
        })}
      </view>
    );
  },
);
InternalIcon.displayName = "InternalIcon";
