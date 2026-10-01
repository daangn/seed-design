import { menuSheet } from "@seed-design/lynx-css/recipes/menu-sheet";
import type { MenuSheetVariantProps } from "@seed-design/lynx-css/recipes/menu-sheet";
import { menuSheetItem } from "@seed-design/lynx-css/recipes/menu-sheet-item";
import type { MenuSheetItemVariantProps } from "@seed-design/lynx-css/recipes/menu-sheet-item";
import {
  BottomSheetBackdrop as HeadlessBottomSheetBackdrop,
  BottomSheetContent as HeadlessBottomSheetContent,
  BottomSheetPositioner as HeadlessBottomSheetPositioner,
  BottomSheetRoot as HeadlessBottomSheetRoot,
  useBottomSheetCloseButton,
  useBottomSheetContext,
  useBottomSheetTrigger,
  type BottomSheetBackdropProps as HeadlessBottomSheetBackdropProps,
  type BottomSheetContentProps as HeadlessBottomSheetContentProps,
  type BottomSheetOpenChangeDetails,
  type BottomSheetOpenChangeReason,
  type BottomSheetPositionerProps as HeadlessBottomSheetPositionerProps,
  type BottomSheetRootProps as HeadlessBottomSheetRootProps,
  type BottomSheetRootRef,
} from "@seed-design/lynx-react-bottom-sheet";
import * as React from "@lynx-js/react";
import { forwardRef, isValidElement } from "@lynx-js/react";
import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "@lynx-js/react";
import clsx from "clsx";

import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import { mergeProps } from "../../utils/merge-props";
import { usePressTap } from "../../hooks/usePressTap";
import { useSafeArea } from "../../hooks/useSafeArea";
import type {
  LynxAccessibilityProps,
  LynxPressableProps,
  LynxStyledElementProps,
  LynxTextRef,
  LynxViewRef,
} from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";
import { toArray } from "../../utils/children";
import {
  BottomSheetHandle,
  SEED_ENTER_ANIMATION,
  SEED_EXIT_ANIMATION,
  SEED_SNAP_ANIMATION,
  type BottomSheetHandleProps,
} from "../BottomSheet/BottomSheet";
import { IconSlotProvider } from "../Icon/Icon";

type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

interface MenuSheetClassNames {
  positioner: string;
  backdrop: string;
  content: string;
  contentInner: string;
  header: string;
  title: string;
  description: string;
  list: string;
  group: string;
  footer: string;
  closeButton: string;
  closeButtonLabel: string;
}

interface MenuSheetItemClassNames {
  root: string;
  scaleContent: string;
  content: string;
  label: string;
  description: string;
  prefixIcon: string;
  divider: string;
}

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(menuSheet);
// Keep this concrete: Lynx drops the entire calc when this token remains a var() reference.
const CONTENT_PADDING_BOTTOM = "16px";

export type MenuSheetOpenChangeReason = BottomSheetOpenChangeReason;

export interface MenuSheetOpenChangeDetails extends BottomSheetOpenChangeDetails {}

const ContentLabelAlignContext = React.createContext<MenuSheetLabelAlign | undefined>(undefined);
const GroupLabelAlignContext = React.createContext<MenuSheetLabelAlign | undefined>(undefined);
const MenuSheetItemPositionContext = React.createContext({ isLast: true });

export type MenuSheetRootRef = BottomSheetRootRef;

export interface MenuSheetRootProps
  extends Omit<HeadlessBottomSheetRootProps, "side" | "snapPoints" | "skipAnimation">,
    Omit<MenuSheetVariantProps, "closeButtonPressed"> {}

/**
 * A bottom-only, fit-height menu sheet backed by the Lynx BottomSheet engine.
 */
export const MenuSheetRoot: LynxForwardRefComponent<BottomSheetRootRef, MenuSheetRootProps> =
  forwardRef<BottomSheetRootRef, MenuSheetRootProps>((props, ref) => {
    const [variantProps, restProps] = menuSheet.splitVariantProps(props);
    const { children, ...rootProps } = restProps;
    const skipAnimation = variantProps.skipAnimation === true;
    const classNames = React.useMemo(() => menuSheet({ skipAnimation }), [skipAnimation]);

    return (
      <ClassNamesProvider value={classNames}>
        <HeadlessBottomSheetRoot
          {...(ref ? { ref } : {})}
          {...rootProps}
          side="bottom"
          snapPoints={["fit"]}
          skipAnimation={skipAnimation}
        >
          {children}
        </HeadlessBottomSheetRoot>
      </ClassNamesProvider>
    );
  });
MenuSheetRoot.displayName = "MenuSheetRoot";

export interface MenuSheetTriggerProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    Pick<LynxPressableProps, "bindtap"> {}

export const MenuSheetTrigger: LynxForwardRefComponent<unknown, MenuSheetTriggerProps> = forwardRef<
  unknown,
  MenuSheetTriggerProps
>((props, ref) => {
  const {
    children,
    className,
    style,
    bindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-label": accessibilityLabel,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    "accessibility-elements-hidden": accessibilityElementsHidden,
    "accessibility-heading": accessibilityHeading,
    "accessibility-actions": accessibilityActions,
    "accessibility-exclusive-focus": accessibilityExclusiveFocus,
    "ios-platform-accessibility-id": iosPlatformAccessibilityId,
  } = props;
  const { triggerProps } = useBottomSheetTrigger({ bindtap });

  return (
    <view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      {...triggerProps}
      className={className}
      style={style as never}
      accessibility-element={accessibilityElement}
      accessibility-label={accessibilityLabel}
      accessibility-role-description={accessibilityRoleDescription}
      accessibility-traits={accessibilityTraits}
      accessibility-value={accessibilityValue}
      accessibility-elements-hidden={accessibilityElementsHidden}
      accessibility-heading={accessibilityHeading}
      accessibility-actions={accessibilityActions}
      accessibility-exclusive-focus={accessibilityExclusiveFocus}
      ios-platform-accessibility-id={iosPlatformAccessibilityId}
    >
      {children}
    </view>
  );
});
MenuSheetTrigger.displayName = "MenuSheetTrigger";

export interface MenuSheetPositionerProps extends HeadlessBottomSheetPositionerProps {}

/**
 * Backdrop/Content를 담는 레이어입니다. `container`를 지정하면 native overlay에 렌더링합니다.
 */
export function MenuSheetPositioner(props: MenuSheetPositionerProps) {
  const classNames = useClassNames();

  return (
    <HeadlessBottomSheetPositioner
      {...props}
      className={clsx(classNames.positioner, props.className)}
    />
  );
}
MenuSheetPositioner.displayName = "MenuSheetPositioner";

export interface MenuSheetBackdropProps extends HeadlessBottomSheetBackdropProps {}

export function MenuSheetBackdrop(props: MenuSheetBackdropProps) {
  const classNames = useClassNames();

  return (
    <HeadlessBottomSheetBackdrop
      {...props}
      className={clsx(classNames.backdrop, props.className)}
    />
  );
}
MenuSheetBackdrop.displayName = "MenuSheetBackdrop";

export interface MenuSheetContentProps
  extends HeadlessBottomSheetContentProps,
    LynxAccessibilityProps {
  labelAlign?: MenuSheetLabelAlign;
}

export const MenuSheetContent: LynxForwardRefComponent<unknown, MenuSheetContentProps> = forwardRef<
  unknown,
  MenuSheetContentProps
>((props, ref) => {
  const {
    children,
    className,
    style,
    innerClassName,
    innerStyle,
    labelAlign,
    snapAnimation,
    enterAnimation,
    exitAnimation,
    ...contentProps
  } = props;
  const classNames = useClassNames();
  const { skipAnimation } = useBottomSheetContext();
  const { safeAreaInsetBottom } = useSafeArea();

  return (
    <ContentLabelAlignContext.Provider value={labelAlign}>
      <HeadlessBottomSheetContent
        {...(ref ? { ref } : {})}
        {...contentProps}
        className={clsx(classNames.content, className)}
        // `SheetContent` pins its outer view with an inline `left: 0`. Releasing it lets the
        // positioner center the sheet within the recipe's `max-width`.
        style={{ left: "auto", ...style }}
        innerClassName={clsx(classNames.contentInner, innerClassName)}
        innerStyle={{
          display: "flex",
          flexDirection: "column",
          minHeight: "0",
          paddingBottom: `calc(${CONTENT_PADDING_BOTTOM} + ${safeAreaInsetBottom})`,
          ...innerStyle,
        }}
        // With `skipAnimation`, leave SEED springs out so headless Content ends transitions immediately.
        snapAnimation={snapAnimation ?? (skipAnimation ? undefined : SEED_SNAP_ANIMATION)}
        enterAnimation={enterAnimation ?? (skipAnimation ? undefined : SEED_ENTER_ANIMATION)}
        exitAnimation={exitAnimation ?? (skipAnimation ? undefined : SEED_EXIT_ANIMATION)}
      >
        {children}
      </HeadlessBottomSheetContent>
    </ContentLabelAlignContext.Provider>
  );
});
MenuSheetContent.displayName = "MenuSheetContent";

export interface MenuSheetHandleProps extends BottomSheetHandleProps {}

export function MenuSheetHandle(props: MenuSheetHandleProps) {
  return <BottomSheetHandle {...props} />;
}
MenuSheetHandle.displayName = "MenuSheetHandle";

export interface MenuSheetSlotProps extends LynxStyledElementProps {}

function createViewSlot(
  slotName: keyof MenuSheetClassNames,
): LynxForwardRefComponent<unknown, MenuSheetSlotProps> {
  return forwardRef<unknown, MenuSheetSlotProps>((props, ref) => {
    const { children, className, style } = props;
    const classNames = useClassNames();

    return (
      <view
        {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
        className={clsx(classNames[slotName], className)}
        style={style as never}
      >
        {children}
      </view>
    );
  });
}

function createTextSlot(
  slotName: keyof MenuSheetClassNames,
): LynxForwardRefComponent<unknown, MenuSheetSlotProps> {
  return forwardRef<unknown, MenuSheetSlotProps>((props, ref) => {
    const { children, className, style } = props;
    const classNames = useClassNames();

    return (
      <text
        {...(ref ? ({ ref: ref as LynxTextRef } as Record<string, unknown>) : {})}
        className={clsx(classNames[slotName], className)}
        style={style as never}
      >
        {children}
      </text>
    );
  });
}

export interface MenuSheetHeaderProps extends MenuSheetSlotProps {}
export const MenuSheetHeader = createViewSlot("header");
MenuSheetHeader.displayName = "MenuSheetHeader";

export interface MenuSheetTitleProps extends MenuSheetSlotProps {}
export const MenuSheetTitle = createTextSlot("title");
MenuSheetTitle.displayName = "MenuSheetTitle";

export interface MenuSheetDescriptionProps extends MenuSheetSlotProps {}
export const MenuSheetDescription = createTextSlot("description");
MenuSheetDescription.displayName = "MenuSheetDescription";

export interface MenuSheetListProps extends MenuSheetSlotProps {}
export const MenuSheetList = createViewSlot("list");
MenuSheetList.displayName = "MenuSheetList";

export type MenuSheetLabelAlign = "left" | "center";

export interface MenuSheetGroupProps extends MenuSheetSlotProps {
  labelAlign?: MenuSheetLabelAlign;
}

export const MenuSheetGroup: LynxForwardRefComponent<unknown, MenuSheetGroupProps> = forwardRef<
  unknown,
  MenuSheetGroupProps
>((props, ref) => {
  const { children, className, style, labelAlign } = props;
  const classNames = useClassNames();
  const contentLabelAlign = React.useContext(ContentLabelAlignContext);
  const resolvedLabelAlign = labelAlign ?? contentLabelAlign;
  const items = toArray(children);

  return (
    <GroupLabelAlignContext.Provider value={resolvedLabelAlign}>
      <view
        {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
        className={clsx(classNames.group, className)}
        style={style as never}
      >
        {items.map((item, index) => (
          <MenuSheetItemPositionContext.Provider
            key={isValidElement(item) ? (item.key ?? index) : index}
            value={{ isLast: index === items.length - 1 }}
          >
            {item}
          </MenuSheetItemPositionContext.Provider>
        ))}
      </view>
    </GroupLabelAlignContext.Provider>
  );
});
MenuSheetGroup.displayName = "MenuSheetGroup";

export interface MenuSheetFooterProps extends MenuSheetSlotProps {}
export const MenuSheetFooter = createViewSlot("footer");
MenuSheetFooter.displayName = "MenuSheetFooter";

export interface MenuSheetCloseButtonProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxPressableProps {}

export const MenuSheetCloseButton: LynxForwardRefComponent<unknown, MenuSheetCloseButtonProps> =
  forwardRef<unknown, MenuSheetCloseButtonProps>((props, ref) => {
    const {
      children,
      className,
      style,
      bindtap,
      "main-thread:bindtap": userMainThreadBindtap,
      "accessibility-element": accessibilityElement = true,
      "accessibility-label": accessibilityLabel = "Close",
      "accessibility-role-description": accessibilityRoleDescription = "button",
      "accessibility-traits": accessibilityTraits,
      "accessibility-value": accessibilityValue,
      "accessibility-elements-hidden": accessibilityElementsHidden,
      "accessibility-heading": accessibilityHeading,
      "accessibility-actions": accessibilityActions,
      "accessibility-exclusive-focus": accessibilityExclusiveFocus,
      "ios-platform-accessibility-id": iosPlatformAccessibilityId,
      ...nativeProps
    } = props;
    const { skipAnimation } = useBottomSheetContext();
    const { closeButtonProps } = useBottomSheetCloseButton({ bindtap });
    const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } =
      usePressTap({
        onTap: closeButtonProps.bindtap,
        mainThreadOnTap: userMainThreadBindtap,
      });
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
      onTouchStart: bindtouchstart,
      onTouchEnd: bindtouchend,
      onTouchCancel: bindtouchcancel,
    });
    const classNames = menuSheet({ skipAnimation, closeButtonPressed: pressed });

    return (
      <view
        {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
        {...mergeProps(
          scaleFeedbackTriggerProps,
          scaleFeedbackTargetProps,
          pressHandlers,
          nativeProps,
        )}
        className={clsx(classNames.closeButton, className)}
        style={style as never}
        accessibility-element={accessibilityElement}
        accessibility-label={accessibilityLabel}
        accessibility-role-description={accessibilityRoleDescription}
        accessibility-traits={accessibilityTraits}
        accessibility-value={accessibilityValue}
        accessibility-elements-hidden={accessibilityElementsHidden}
        accessibility-heading={accessibilityHeading}
        accessibility-actions={accessibilityActions}
        accessibility-exclusive-focus={accessibilityExclusiveFocus}
        ios-platform-accessibility-id={iosPlatformAccessibilityId}
      >
        <text className={classNames.closeButtonLabel}>{children}</text>
      </view>
    );
  });
MenuSheetCloseButton.displayName = "MenuSheetCloseButton";

export type MenuSheetItemTone = NonNullable<MenuSheetItemVariantProps["tone"]>;

export interface MenuSheetItemProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxPressableProps {
  tone?: MenuSheetItemTone;
  labelAlign?: MenuSheetLabelAlign;
}

interface MenuSheetItemContextValue {
  classNames: MenuSheetItemClassNames;
}

const MenuSheetItemContext = React.createContext<MenuSheetItemContextValue | null>(null);

function useMenuSheetItemContext(): MenuSheetItemContextValue {
  const context = React.useContext(MenuSheetItemContext);
  if (!context) {
    throw new Error("MenuSheet item slots must be used within MenuSheetItem.");
  }
  return context;
}

/**
 * 사용자 작업만 실행하며 시트를 닫지 않습니다. 작업 뒤 닫으려면 제어 상태에서는 `open`을 바꾸고, 비제어 상태에서는
 * Root ref의 `close()`를 호출하세요.
 */
export const MenuSheetItem: LynxForwardRefComponent<unknown, MenuSheetItemProps> = forwardRef<
  unknown,
  MenuSheetItemProps
>((props, ref) => {
  const {
    children,
    className,
    style,
    tone = "neutral",
    labelAlign,
    bindtap: userBindtap,
    "main-thread:bindtap": userMainThreadBindtap,
    "accessibility-element": accessibilityElement = true,
    "accessibility-role-description": accessibilityRoleDescription = "button",
    "accessibility-label": accessibilityLabel,
    "accessibility-traits": accessibilityTraits,
    "accessibility-value": accessibilityValue,
    "accessibility-elements-hidden": accessibilityElementsHidden,
    "accessibility-heading": accessibilityHeading,
    "accessibility-actions": accessibilityActions,
    "accessibility-exclusive-focus": accessibilityExclusiveFocus,
    "ios-platform-accessibility-id": iosPlatformAccessibilityId,
    ...nativeProps
  } = props;
  const groupLabelAlign = React.useContext(GroupLabelAlignContext);
  const contentLabelAlign = React.useContext(ContentLabelAlignContext);
  const { isLast } = React.useContext(MenuSheetItemPositionContext);
  const resolvedLabelAlign = labelAlign ?? groupLabelAlign ?? contentLabelAlign ?? "left";
  const { pressed, bindtouchstart, bindtouchend, bindtouchcancel, ...pressHandlers } = usePressTap({
    onTap: userBindtap,
    mainThreadOnTap: userMainThreadBindtap,
  });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    onTouchStart: bindtouchstart,
    onTouchEnd: bindtouchend,
    onTouchCancel: bindtouchcancel,
  });
  const classNames = menuSheetItem({ tone, labelAlign: resolvedLabelAlign, pressed });
  const itemContext = React.useMemo<MenuSheetItemContextValue>(
    () => ({ classNames }),
    [classNames],
  );

  return (
    <MenuSheetItemContext.Provider value={itemContext}>
      <IconSlotProvider
        value={{
          classNames: { prefixIcon: classNames.prefixIcon },
          deps: [tone, resolvedLabelAlign, pressed],
        }}
      >
        <view
          {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
          {...mergeProps(scaleFeedbackTriggerProps, pressHandlers, nativeProps)}
          className={clsx(classNames.root, className)}
          style={style as never}
          accessibility-element={accessibilityElement}
          accessibility-label={accessibilityLabel}
          accessibility-role-description={accessibilityRoleDescription}
          accessibility-traits={accessibilityTraits}
          accessibility-value={accessibilityValue}
          accessibility-elements-hidden={accessibilityElementsHidden}
          accessibility-heading={accessibilityHeading}
          accessibility-actions={accessibilityActions}
          accessibility-exclusive-focus={accessibilityExclusiveFocus}
          ios-platform-accessibility-id={iosPlatformAccessibilityId}
        >
          <view className={classNames.scaleContent} {...scaleFeedbackTargetProps}>
            {children}
          </view>
          {!isLast ? (
            <view className={classNames.divider} accessibility-elements-hidden={true} />
          ) : null}
        </view>
      </IconSlotProvider>
    </MenuSheetItemContext.Provider>
  );
});
MenuSheetItem.displayName = "MenuSheetItem";

export interface MenuSheetItemContentProps extends LynxStyledElementProps {}

export const MenuSheetItemContent: LynxForwardRefComponent<unknown, MenuSheetItemContentProps> =
  forwardRef<unknown, MenuSheetItemContentProps>((props, ref) => {
    const { children, className, style } = props;
    const { classNames } = useMenuSheetItemContext();

    return (
      <view
        {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
        className={clsx(classNames.content, className)}
        style={style as never}
      >
        {children}
      </view>
    );
  });
MenuSheetItemContent.displayName = "MenuSheetItemContent";

export interface MenuSheetItemLabelProps extends LynxStyledElementProps {}

export const MenuSheetItemLabel: LynxForwardRefComponent<unknown, MenuSheetItemLabelProps> =
  forwardRef<unknown, MenuSheetItemLabelProps>((props, ref) => {
    const { children, className, style } = props;
    const { classNames } = useMenuSheetItemContext();

    return (
      <text
        {...(ref ? ({ ref: ref as LynxTextRef } as Record<string, unknown>) : {})}
        className={clsx(classNames.label, className)}
        style={style as never}
      >
        {children}
      </text>
    );
  });
MenuSheetItemLabel.displayName = "MenuSheetItemLabel";

export interface MenuSheetItemDescriptionProps extends LynxStyledElementProps {}

export const MenuSheetItemDescription: LynxForwardRefComponent<
  unknown,
  MenuSheetItemDescriptionProps
> = forwardRef<unknown, MenuSheetItemDescriptionProps>((props, ref) => {
  const { children, className, style } = props;
  const { classNames } = useMenuSheetItemContext();

  return (
    <text
      {...(ref ? ({ ref: ref as LynxTextRef } as Record<string, unknown>) : {})}
      className={clsx(classNames.description, className)}
      style={style as never}
    >
      {children}
    </text>
  );
});
MenuSheetItemDescription.displayName = "MenuSheetItemDescription";
