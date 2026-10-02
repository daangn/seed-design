import * as React from "@lynx-js/react";
import clsx from "clsx";

import { menu, type MenuVariantProps } from "@seed-design/lynx-css/recipes/menu";
import { menuItem, type MenuItemVariantProps } from "@seed-design/lynx-css/recipes/menu-item";
import type { Placement as MenuPlacement } from "@seed-design/lynx-react-floating";
import {
  MenuAnchor as MenuAnchorPrimitive,
  MenuContent as MenuContentPrimitive,
  MenuGroup as MenuGroupPrimitive,
  MenuGroupLabel as MenuGroupLabelPrimitive,
  MenuPositioner as MenuPositionerPrimitive,
  MenuProvider,
  MenuTrigger as MenuTriggerPrimitive,
  useMenu,
  useMenuContext,
  useMenuItem,
  type MenuOpenChangeDetails,
  type MenuOpenChangeReason,
  type MenuPositionerProps as MenuPositionerPrimitiveProps,
  type UseMenuProps,
} from "@seed-design/lynx-react-menu";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import { mergeProps } from "../../utils/merge-props";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewProps,
  LynxViewRef,
} from "../../types";
import { toArray } from "../../utils/children";
import { IconSlotProvider, PrefixIcon, SuffixIcon } from "../Icon/Icon";

type MenuClassNames = {
  positioner: string;
  content: string;
  scrollArea: string;
  scrollContent: string;
  group: string;
  groupLabel: string;
  separator: string;
};
type MenuItemClassNames = {
  root: string;
  scaleContent: string;
  pressedOverlay: string;
  body: string;
  label: string;
  description: string;
  prefixIcon: string;
  suffixIcon: string;
};
type MenuPublicVariantProps = Omit<MenuVariantProps, "open" | "positioned" | "size"> & {
  size?: "small" | "medium" | "responsive";
};
type MenuItemPublicVariantProps = Omit<MenuItemVariantProps, "size" | "disabled" | "pressed">;
type NativeTransitionHandler = NonNullable<LynxViewProps["bindtransitionend"]>;

interface MenuStyleContextValue {
  classes: MenuClassNames;
  size: "small" | "medium";
}

const MenuStyleContext = React.createContext<MenuStyleContextValue | null>(null);
const MenuItemClassNamesContext = React.createContext<MenuItemClassNames | null>(null);
const MenuGroupPositionContext = React.createContext({ isFirst: true });

function useMenuStyle(consumer: string): MenuStyleContextValue {
  const context = React.useContext(MenuStyleContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <MenuRoot/>.`);
  return context;
}

function useMenuItemClassNames(consumer: string): MenuItemClassNames {
  const context = React.useContext(MenuItemClassNamesContext);
  if (!context) throw new Error(`<${consumer}/> must be rendered inside <MenuItem/>.`);
  return context;
}

function getScreenWidth(): number | null {
  const systemInfo = typeof SystemInfo === "undefined" ? undefined : SystemInfo;
  const pixelWidth = systemInfo?.pixelWidth;
  const pixelRatio = systemInfo?.pixelRatio;
  if (
    typeof pixelWidth !== "number" ||
    typeof pixelRatio !== "number" ||
    pixelWidth <= 0 ||
    pixelRatio <= 0
  ) {
    return null;
  }
  return pixelWidth / pixelRatio;
}

function hasExitTransition(event: Parameters<NativeTransitionHandler>[0]): boolean {
  if (event.target.uid !== event.currentTarget.uid) return false;
  return (
    event.params.animation_type === "transition-opacity" ||
    event.params.animation_name === "opacity"
  );
}

////////////////////////////////////////////////////////////////////////////////////

export interface MenuRootProps
  extends MenuPublicVariantProps,
    LynxStyledElementProps,
    Omit<UseMenuProps, "onOpenChange"> {
  onOpenChange?: (open: boolean, details: MenuOpenChangeDetails) => void;
}

/**
 * @platform Lynx
 *
 * `@seed-design/lynx-react-menu`에 menu recipe를 적용합니다. Root는 자식을 native `view`로 감쌉니다.
 * Lynx menu supports native tap and accessibility semantics. It does not expose
 * web DOM focus, keyboard navigation, typeahead, `asChild`, or nested submenus.
 */
export const MenuRoot = React.forwardRef<unknown, MenuRootProps>((props, ref) => {
  const { size: sizeProp = "medium", open, ...restProps } = props;
  const [variantProps, otherProps] = menu.splitVariantProps({
    ...restProps,
    size: sizeProp === "responsive" ? undefined : sizeProp,
  });
  const {
    children,
    className,
    defaultOpen,
    onOpenChange,
    disabled,
    placement,
    gutter,
    overflowPadding,
    matchReferenceWidth,
    ...nativeProps
  } = otherProps;
  const api = useMenu({
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    placement,
    gutter,
    overflowPadding,
    matchReferenceWidth,
  });
  const screenWidth = getScreenWidth();
  const resolvedSize =
    sizeProp === "responsive" && screenWidth != null && screenWidth >= 1280
      ? "small"
      : (variantProps.size ?? "medium");
  const classes = menu({ size: resolvedSize, open: api.open, positioned: api.positioned });
  const styleValue = React.useMemo<MenuStyleContextValue>(
    () => ({ classes, size: resolvedSize }),
    [
      classes.positioner,
      classes.content,
      classes.scrollArea,
      classes.scrollContent,
      classes.group,
      classes.groupLabel,
      classes.separator,
      resolvedSize,
    ],
  );

  return (
    <MenuProvider value={api}>
      <MenuStyleContext.Provider value={styleValue}>
        <view {...(ref ? { ref: ref as LynxViewRef } : {})} className={className} {...nativeProps}>
          {children}
        </view>
      </MenuStyleContext.Provider>
    </MenuProvider>
  );
});
MenuRoot.displayName = "MenuRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuAnchorProps extends LynxStyledElementProps {}

export const MenuAnchor: React.ForwardRefExoticComponent<
  MenuAnchorProps & React.RefAttributes<unknown>
> = MenuAnchorPrimitive;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuTriggerProps
  extends LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const MenuTrigger: React.ForwardRefExoticComponent<
  MenuTriggerProps & React.RefAttributes<unknown>
> = MenuTriggerPrimitive;

////////////////////////////////////////////////////////////////////////////////////

export interface MenuPositionerProps
  extends LynxStyledElementProps,
    Pick<MenuPositionerPrimitiveProps, "container" | "overlayLevel" | "overlayViewProps"> {}

/**
 * 화면 전체를 덮는 메뉴 레이어입니다. `container`가 없으면 Lynx view 안의 고정 native `view`로,
 * `container`를 지정하면 Lynx view 밖까지 덮는 native overlay로 렌더링합니다. `container`가 없을 때
 * 같은 화면의 형제 요소와의 순서는 recipe의 z-index `99`가 정합니다.
 */
export const MenuPositioner = React.forwardRef<unknown, MenuPositionerProps>((props, ref) => {
  const { className, ...positionerProps } = props;
  const { classes } = useMenuStyle("MenuPositioner");

  return (
    <MenuPositionerPrimitive
      {...(ref ? { ref } : {})}
      {...positionerProps}
      className={clsx(classes.positioner, className)}
    />
  );
});
MenuPositioner.displayName = "MenuPositioner";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuContentProps extends LynxStyledElementProps {}

/**
 * 위치를 계산해 표시하는 메뉴 표면입니다. `MenuPositioner` 안에 두고, 항목은 `MenuScrollArea` 안에 둡니다.
 */
export const MenuContent = React.forwardRef<unknown, MenuContentProps>((props, ref) => {
  const { className, ...contentProps } = props;
  const { classes } = useMenuStyle("MenuContent");
  const { open, finishClose } = useMenuContext();
  const handleTransitionEnd = React.useCallback<NativeTransitionHandler>(
    (event) => {
      "background only";
      if (!open && hasExitTransition(event)) finishClose();
    },
    [finishClose, open],
  );

  return (
    <MenuContentPrimitive
      {...(ref ? { ref } : {})}
      {...contentProps}
      className={clsx(classes.content, className)}
      bindtransitionend={handleTransitionEnd}
    />
  );
});
MenuContent.displayName = "MenuContent";

////////////////////////////////////////////////////////////////////////////////////

/** `MenuContent` 안에서 긴 목록을 세로로 스크롤하는 viewport입니다. 그룹 사이에 구분선을 넣습니다. */
export interface MenuScrollAreaProps extends LynxStyledElementProps {}

export const MenuScrollArea = React.forwardRef<unknown, MenuScrollAreaProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { classes } = useMenuStyle("MenuScrollArea");
  const childNodes = toArray(children);

  return (
    <scroll-view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.scrollArea, className)}
      scroll-orientation="vertical"
      {...nativeProps}
    >
      <view className={classes.scrollContent}>
        {childNodes.map((child, index) => (
          <MenuGroupPositionContext.Provider
            key={React.isValidElement(child) ? (child.key ?? index) : index}
            value={{ isFirst: index === 0 }}
          >
            {child}
          </MenuGroupPositionContext.Provider>
        ))}
      </view>
    </scroll-view>
  );
});
MenuScrollArea.displayName = "MenuScrollArea";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupProps extends LynxStyledElementProps {}

export const MenuGroup = React.forwardRef<unknown, MenuGroupProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { classes } = useMenuStyle("MenuGroup");
  const position = React.useContext(MenuGroupPositionContext);
  return (
    <MenuGroupPrimitive
      {...(ref ? { ref } : {})}
      className={clsx(classes.group, className)}
      {...nativeProps}
    >
      {!position.isFirst ? (
        <view className={classes.separator} accessibility-elements-hidden={true} />
      ) : null}
      {children}
    </MenuGroupPrimitive>
  );
});
MenuGroup.displayName = "MenuGroup";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuGroupLabelProps extends LynxStyledElementProps, LynxAccessibilityProps {}

export const MenuGroupLabel = React.forwardRef<unknown, MenuGroupLabelProps>((props, ref) => {
  const { className, ...labelProps } = props;
  const { classes } = useMenuStyle("MenuGroupLabel");
  return (
    <MenuGroupLabelPrimitive
      {...(ref ? { ref } : {})}
      className={clsx(classes.groupLabel, className)}
      {...labelProps}
    />
  );
});
MenuGroupLabel.displayName = "MenuGroupLabel";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemProps
  extends MenuItemPublicVariantProps,
    LynxStyledElementProps,
    LynxPressableProps,
    LynxAccessibilityProps {
  disabled?: boolean;
}

export const MenuItem = React.forwardRef<unknown, MenuItemProps>((props, ref) => {
  const [variantProps, otherProps] = menuItem.splitVariantProps(props);
  const { disabled, tone = "neutral" } = variantProps;
  const {
    children,
    className,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    ...nativeProps
  } = otherProps;
  const { size } = useMenuStyle("MenuItem");
  const api = useMenuItem({
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-element": accessibilityElement,
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
  });
  // 눌림 상태는 Scale Feedback의 touch handler를 따라갑니다.
  const { bindtouchstart, bindtouchend, bindtouchcancel, ...rootProps } = api.rootProps;
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled: api.disabled,
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const classes = menuItem({
    ...variantProps,
    size,
    tone,
    disabled: api.disabled,
    pressed: api.pressed,
  });
  const iconSlots = React.useMemo(
    () => ({
      classNames: { prefixIcon: classes.prefixIcon, suffixIcon: classes.suffixIcon },
      deps: [classes.prefixIcon, classes.suffixIcon],
    }),
    [classes.prefixIcon, classes.suffixIcon],
  );

  return (
    <MenuItemClassNamesContext.Provider value={classes}>
      <IconSlotProvider value={iconSlots}>
        <view
          {...(ref ? { ref: ref as LynxViewRef } : {})}
          className={clsx(classes.root, className)}
          {...mergeProps(scaleFeedbackTriggerProps, rootProps, nativeProps)}
        >
          <view className={classes.pressedOverlay} accessibility-elements-hidden={true} />
          <view className={classes.scaleContent} {...scaleFeedbackTargetProps}>
            {children}
          </view>
        </view>
      </IconSlotProvider>
    </MenuItemClassNamesContext.Provider>
  );
});
MenuItem.displayName = "MenuItem";

////////////////////////////////////////////////////////////////////////////////////

export interface MenuItemBodyProps extends LynxStyledElementProps {}

export const MenuItemBody = React.forwardRef<unknown, MenuItemBodyProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useMenuItemClassNames("MenuItemBody");
  return (
    <view
      {...(ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(classes.body, className)}
      {...nativeProps}
    >
      {children}
    </view>
  );
});
MenuItemBody.displayName = "MenuItemBody";

export interface MenuItemLabelProps extends LynxStyledElementProps {}

export const MenuItemLabel = React.forwardRef<unknown, MenuItemLabelProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const classes = useMenuItemClassNames("MenuItemLabel");
  return (
    <text
      {...(ref ? { ref: ref as LynxTextRef } : {})}
      className={clsx(classes.label, className)}
      {...nativeProps}
    >
      {children}
    </text>
  );
});
MenuItemLabel.displayName = "MenuItemLabel";

export interface MenuItemDescriptionProps extends LynxStyledElementProps {}

export const MenuItemDescription = React.forwardRef<unknown, MenuItemDescriptionProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const classes = useMenuItemClassNames("MenuItemDescription");
    return (
      <text
        {...(ref ? { ref: ref as LynxTextRef } : {})}
        className={clsx(classes.description, className)}
        {...nativeProps}
      >
        {children}
      </text>
    );
  },
);
MenuItemDescription.displayName = "MenuItemDescription";

export { PrefixIcon as MenuPrefixIcon, SuffixIcon as MenuSuffixIcon };
export type { MenuOpenChangeDetails, MenuOpenChangeReason, MenuPlacement };
