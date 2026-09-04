import { useMainThreadRef } from "@lynx-js/react";
import type { CSSProperties, MainThread } from "@lynx-js/types";
import { clsx } from "cn";
import * as React from "@lynx-js/react";
import {
  cloneElement,
  isValidElement,
  type DependencyList,
  type ReactElement,
} from "@lynx-js/react";

import { useIconColor } from "../../hooks/useIconColor";
import type { LynxIconElementProps, LynxStyledElementProps, LynxViewRef } from "../../types";
import { handleColor, handleDimension, type StyleProps } from "../../utils/styled";

export type IconSlotName = "icon" | "prefixIcon" | "suffixIcon";

////////////////////////////////////////////////////////////////////////////////////

interface IconSlotContextValue {
  classNames?: Partial<Record<IconSlotName, string>>;
  deps?: DependencyList;
}

const IconSlotContext = React.createContext<IconSlotContextValue | null>(null);

interface IconRequiredContextValue {
  register: () => void;
  unregister: () => void;
}

const IconRequiredContext = React.createContext<IconRequiredContextValue | null>(null);

export function IconRequired({
  children,
  enabled,
}: {
  children: React.ReactNode;
  enabled: boolean;
}) {
  const registeredCountRef = React.useRef(0);
  const parentContext = React.useContext(IconRequiredContext);

  const register = React.useCallback(() => {
    registeredCountRef.current += 1;

    if (process.env.NODE_ENV !== "production" && registeredCountRef.current > 1) {
      throw new Error(
        "Icon-only Component must render only one <Icon /> under children. Check if you are rendering multiple <Icon />.",
      );
    }
  }, []);

  const unregister = React.useCallback(() => {
    registeredCountRef.current = Math.max(0, registeredCountRef.current - 1);
  }, []);

  React.useLayoutEffect(() => {
    if (!enabled) return;

    if (process.env.NODE_ENV !== "production") {
      if (parentContext) {
        throw new Error(
          "Icon-only Component must not be nested within another Icon-Only. Check if you are using Icon-Only inside another Icon-Only.",
        );
      }
      if (registeredCountRef.current === 0) {
        throw new Error(
          "Icon-only Component must render <Icon /> as a child. Check if you are using raw icon element instead of <Icon icon={} />.",
        );
      }
    }
  }, [enabled, parentContext]);

  const value = React.useMemo<IconRequiredContextValue | null>(() => {
    if (!enabled) return parentContext ?? null;
    return { register, unregister };
  }, [enabled, parentContext, register, unregister]);

  return <IconRequiredContext.Provider value={value}>{children}</IconRequiredContext.Provider>;
}

export function IconSlotProvider({
  value,
  children,
}: {
  value: IconSlotContextValue;
  children: React.ReactNode;
}) {
  return <IconSlotContext.Provider value={value}>{children}</IconSlotContext.Provider>;
}

////////////////////////////////////////////////////////////////////////////////////

const iconSlotMarker = Symbol.for("@seed-design/lynx-react/icon-slot");
const seedMulticolorIconMarker = Symbol.for("@seed-design/multicolor-icon");

interface IconSlotComponent {
  [iconSlotMarker]?: IconSlotName;
}

interface MulticolorIconComponent {
  [seedMulticolorIconMarker]?: boolean;
}

export function getIconSlotName(node: React.ReactNode): IconSlotName | null {
  if (!isValidElement(node)) return null;

  return ((node.type as IconSlotComponent)[iconSlotMarker] ?? null) as IconSlotName | null;
}

function isMulticolorIcon(node: React.ReactNode): boolean {
  if (!isValidElement(node)) return false;
  if (node.type == null || (typeof node.type !== "function" && typeof node.type !== "object")) {
    return false;
  }

  return (node.type as MulticolorIconComponent)[seedMulticolorIconMarker] === true;
}

////////////////////////////////////////////////////////////////////////////////////

export interface IconProps extends LynxStyledElementProps {
  icon: ReactElement<LynxIconElementProps>;
  size?: StyleProps["height"] | number;
  color?: StyleProps["color"];
  /**
   * 자동 감지되지 않는 멀티컬러 아이콘의 원본 색상을 유지합니다.
   * @default false
   */
  multicolor?: boolean;
}

export interface PrefixIconProps extends IconProps {}

export interface SuffixIconProps extends IconProps {}

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

const IconSlotBase = React.forwardRef<unknown, IconSlotBaseProps>((props, ref) => {
  const {
    icon,
    slot,
    baseClassName,
    className,
    style,
    size,
    color,
    multicolor = false,
    children: _children,
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
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      main-thread:ref={sourceRef}
      className={clsx(baseClassName, slotClassName, className)}
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

function createIconComponent<Props extends IconProps>(
  displayName: string,
  slot: IconSlotName,
  baseClassName: string,
) {
  const Component = React.forwardRef<unknown, Props>((props, ref) => {
    return <IconSlotBase ref={ref} slot={slot} baseClassName={baseClassName} {...props} />;
  });

  Component.displayName = displayName;
  (Component as IconSlotComponent)[iconSlotMarker] = slot;

  return Component;
}

export const Icon = createIconComponent<IconProps>("Icon", "icon", "seed-icon");
export const PrefixIcon = createIconComponent<PrefixIconProps>(
  "PrefixIcon",
  "prefixIcon",
  "seed-prefix-icon",
);
export const SuffixIcon = createIconComponent<SuffixIconProps>(
  "SuffixIcon",
  "suffixIcon",
  "seed-suffix-icon",
);

////////////////////////////////////////////////////////////////////////////////////

export interface InternalIconProps extends LynxStyledElementProps {
  icon: ReactElement<LynxIconElementProps>;
  deps?: DependencyList;
}

export const InternalIcon = React.forwardRef<unknown, InternalIconProps>((props, ref) => {
  const { icon, deps = [], className, style, children: _children, ...nativeProps } = props;
  const sourceRef = useMainThreadRef<MainThread.Element>(null);
  const styleColor = getStyleColor(style);
  const iconColor = useIconColor([className, styleColor, ...(deps ?? [])], { sourceRef });

  if (!isValidElement<LynxIconElementProps>(icon)) return null;

  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      {...nativeProps}
      main-thread:ref={sourceRef}
      className={className}
      style={style}
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
InternalIcon.displayName = "InternalIcon";
