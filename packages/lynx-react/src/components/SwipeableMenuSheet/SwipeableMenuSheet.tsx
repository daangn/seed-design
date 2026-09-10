import { menuSheet } from "@seed-design/lynx-css/recipes/menu-sheet";
import type { MenuSheetVariantProps } from "@seed-design/lynx-css/recipes/menu-sheet";
import { menuSheetItem } from "@seed-design/lynx-css/recipes/menu-sheet-item";
import type { MenuSheetItemVariantProps } from "@seed-design/lynx-css/recipes/menu-sheet-item";
import * as React from "@lynx-js/react";
import { forwardRef, isValidElement } from "@lynx-js/react";
import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "@lynx-js/react";
import clsx from "clsx";

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
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetHandle,
  BottomSheetPositioner,
  BottomSheetRoot,
  type BottomSheetBackdropProps,
  type BottomSheetContentProps,
  type BottomSheetHandleProps,
  type BottomSheetPositionerProps,
  type BottomSheetRootProps,
  type BottomSheetRootRef,
} from "../BottomSheet/BottomSheet";
import { IconSlotProvider } from "../Icon/Icon";

type LynxForwardRefComponent<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

interface SwipeableMenuSheetClassNames {
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

interface SwipeableMenuSheetItemClassNames {
  root: string;
  content: string;
  label: string;
  description: string;
  prefixIcon: string;
  divider: string;
}

const { ClassNamesProvider, useClassNames } = createSlotRecipeContext(menuSheet);
// Keep this concrete: Lynx drops the entire calc when this token remains a var() reference.
const CONTENT_PADDING_BOTTOM = "16px";

export type SwipeableMenuSheetCloseReason = "trigger" | "closeButton" | "interactOutside" | "drag";

export interface SwipeableMenuSheetOpenChangeDetails {
  reason: SwipeableMenuSheetCloseReason;
}

interface SwipeableMenuSheetContextValue {
  rootRef: React.RefObject<BottomSheetRootRef | null>;
  skipAnimation: boolean;
  setPendingReason: (reason: SwipeableMenuSheetCloseReason) => void;
}

const SwipeableMenuSheetContext = React.createContext<SwipeableMenuSheetContextValue | null>(null);
const ContentLabelAlignContext = React.createContext<SwipeableMenuSheetLabelAlign | undefined>(
  undefined,
);
const GroupLabelAlignContext = React.createContext<SwipeableMenuSheetLabelAlign | undefined>(
  undefined,
);
const SwipeableMenuSheetItemPositionContext = React.createContext({ isLast: true });

function useSwipeableMenuSheetContext(): SwipeableMenuSheetContextValue {
  const context = React.useContext(SwipeableMenuSheetContext);
  if (!context) {
    throw new Error(
      "SwipeableMenuSheet compound components must be used within SwipeableMenuSheetRoot.",
    );
  }
  return context;
}

function closeSheet(
  rootRef: React.RefObject<BottomSheetRootRef | null>,
  skipAnimation: boolean,
): void {
  if (skipAnimation) {
    rootRef.current?.close({ animate: false });
  } else {
    rootRef.current?.close();
  }
}

export type SwipeableMenuSheetRootRef = BottomSheetRootRef;

export interface SwipeableMenuSheetRootProps
  extends Omit<
      BottomSheetRootProps,
      | "open"
      | "defaultOpen"
      | "onOpenChange"
      | "side"
      | "snapPoints"
      | "headerAlign"
      | "skipAnimation"
    >,
    Omit<MenuSheetVariantProps, "closeButtonPressed"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: SwipeableMenuSheetOpenChangeDetails) => void;
}

/**
 * A bottom-only, fit-height menu sheet backed by the Lynx BottomSheet engine.
 */
export const SwipeableMenuSheetRoot: LynxForwardRefComponent<
  BottomSheetRootRef,
  SwipeableMenuSheetRootProps
> = forwardRef<BottomSheetRootRef, SwipeableMenuSheetRootProps>((props, forwardedRef) => {
  const [variantProps, restProps] = menuSheet.splitVariantProps(props);
  const { open, defaultOpen, onOpenChange, children, ...nativeProps } = restProps;
  const skipAnimation = variantProps.skipAnimation === true;
  const internalRef = React.useRef<BottomSheetRootRef | null>(null);
  const pendingReasonRef = React.useRef<SwipeableMenuSheetCloseReason | null>(null);

  const mergedRef = React.useCallback(
    (value: BottomSheetRootRef | null) => {
      internalRef.current = value;
      if (typeof forwardedRef === "function") {
        forwardedRef(value);
      } else if (forwardedRef) {
        forwardedRef.current = value;
      }
    },
    [forwardedRef],
  );
  const setPendingReason = React.useCallback((reason: SwipeableMenuSheetCloseReason) => {
    pendingReasonRef.current = reason;
  }, []);
  const handleShowChange = React.useCallback(
    (nextOpen: boolean) => {
      const reason = pendingReasonRef.current ?? "drag";
      pendingReasonRef.current = null;
      onOpenChange?.(nextOpen, { reason });
    },
    [onOpenChange],
  );
  const classNames = React.useMemo(() => menuSheet({ skipAnimation }), [skipAnimation]);
  const context = React.useMemo<SwipeableMenuSheetContextValue>(
    () => ({ rootRef: internalRef, skipAnimation, setPendingReason }),
    [setPendingReason, skipAnimation],
  );

  return (
    <SwipeableMenuSheetContext.Provider value={context}>
      <ClassNamesProvider value={classNames}>
        <BottomSheetRoot
          {...nativeProps}
          ref={mergedRef}
          open={open}
          defaultOpen={defaultOpen}
          side="bottom"
          snapPoints={["fit"]}
          skipAnimation={skipAnimation}
          onOpenChange={handleShowChange}
        >
          {children}
        </BottomSheetRoot>
      </ClassNamesProvider>
    </SwipeableMenuSheetContext.Provider>
  );
});
SwipeableMenuSheetRoot.displayName = "SwipeableMenuSheetRoot";

export interface SwipeableMenuSheetTriggerProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    Pick<LynxPressableProps, "bindtap"> {}

export const SwipeableMenuSheetTrigger: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetTriggerProps
> = forwardRef<unknown, SwipeableMenuSheetTriggerProps>((props, ref) => {
  const {
    children,
    className,
    style,
    bindtap: userBindtap,
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
  const { rootRef, setPendingReason, skipAnimation } = useSwipeableMenuSheetContext();

  const handleTap: NonNullable<LynxPressableProps["bindtap"]> = (event, instance) => {
    setPendingReason("trigger");
    if (skipAnimation) {
      rootRef.current?.open({ animate: false });
    } else {
      rootRef.current?.open();
    }
    userBindtap?.(event, instance);
  };

  return (
    <view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      bindtap={handleTap}
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
SwipeableMenuSheetTrigger.displayName = "SwipeableMenuSheetTrigger";

export interface SwipeableMenuSheetPositionerProps extends BottomSheetPositionerProps {}

export const SwipeableMenuSheetPositioner: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetPositionerProps
> = forwardRef<unknown, SwipeableMenuSheetPositionerProps>((props, ref) => {
  const classNames = useClassNames();

  return (
    <BottomSheetPositioner
      {...(ref ? { ref } : {})}
      {...props}
      className={clsx(classNames.positioner, props.className)}
    />
  );
});
SwipeableMenuSheetPositioner.displayName = "SwipeableMenuSheetPositioner";

export interface SwipeableMenuSheetBackdropProps extends BottomSheetBackdropProps {}

export function SwipeableMenuSheetBackdrop(props: SwipeableMenuSheetBackdropProps) {
  const { children, className, clickToClose = true, onClick: userOnClick, ...nativeProps } = props;
  const classNames = useClassNames();
  const { rootRef, setPendingReason, skipAnimation } = useSwipeableMenuSheetContext();
  const handleClick = React.useCallback(() => {
    if (clickToClose) {
      setPendingReason("interactOutside");
      closeSheet(rootRef, skipAnimation);
    }
    userOnClick?.();
  }, [clickToClose, rootRef, setPendingReason, skipAnimation, userOnClick]);

  return (
    <BottomSheetBackdrop
      {...nativeProps}
      className={clsx(classNames.backdrop, className)}
      clickToClose={false}
      onClick={handleClick}
    >
      {children}
    </BottomSheetBackdrop>
  );
}
SwipeableMenuSheetBackdrop.displayName = "SwipeableMenuSheetBackdrop";

export interface SwipeableMenuSheetContentProps
  extends BottomSheetContentProps,
    LynxAccessibilityProps {
  labelAlign?: SwipeableMenuSheetLabelAlign;
}

export const SwipeableMenuSheetContent: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetContentProps
> = forwardRef<unknown, SwipeableMenuSheetContentProps>((props, ref) => {
  const { children, className, innerClassName, innerStyle, labelAlign, ...contentProps } = props;
  const classNames = useClassNames();
  const { safeAreaInsetBottom } = useSafeArea();

  return (
    <ContentLabelAlignContext.Provider value={labelAlign}>
      <BottomSheetContent
        {...(ref ? { ref } : {})}
        {...contentProps}
        className={clsx(classNames.content, className)}
        innerClassName={clsx(classNames.contentInner, innerClassName)}
        innerStyle={
          {
            paddingBottom: `calc(${CONTENT_PADDING_BOTTOM} + ${safeAreaInsetBottom})`,
            ...innerStyle,
          } as BottomSheetContentProps["innerStyle"]
        }
      >
        {children}
      </BottomSheetContent>
    </ContentLabelAlignContext.Provider>
  );
});
SwipeableMenuSheetContent.displayName = "SwipeableMenuSheetContent";

export interface SwipeableMenuSheetHandleProps extends BottomSheetHandleProps {}

export function SwipeableMenuSheetHandle(props: SwipeableMenuSheetHandleProps) {
  return <BottomSheetHandle {...props} />;
}
SwipeableMenuSheetHandle.displayName = "SwipeableMenuSheetHandle";

export interface SwipeableMenuSheetSlotProps extends LynxStyledElementProps {}

function createViewSlot(
  slotName: keyof SwipeableMenuSheetClassNames,
): LynxForwardRefComponent<unknown, SwipeableMenuSheetSlotProps> {
  return forwardRef<unknown, SwipeableMenuSheetSlotProps>((props, ref) => {
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
  slotName: keyof SwipeableMenuSheetClassNames,
): LynxForwardRefComponent<unknown, SwipeableMenuSheetSlotProps> {
  return forwardRef<unknown, SwipeableMenuSheetSlotProps>((props, ref) => {
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

export interface SwipeableMenuSheetHeaderProps extends SwipeableMenuSheetSlotProps {}
export const SwipeableMenuSheetHeader = createViewSlot("header");
SwipeableMenuSheetHeader.displayName = "SwipeableMenuSheetHeader";

export interface SwipeableMenuSheetTitleProps extends SwipeableMenuSheetSlotProps {}
export const SwipeableMenuSheetTitle = createTextSlot("title");
SwipeableMenuSheetTitle.displayName = "SwipeableMenuSheetTitle";

export interface SwipeableMenuSheetDescriptionProps extends SwipeableMenuSheetSlotProps {}
export const SwipeableMenuSheetDescription = createTextSlot("description");
SwipeableMenuSheetDescription.displayName = "SwipeableMenuSheetDescription";

export interface SwipeableMenuSheetListProps extends SwipeableMenuSheetSlotProps {}
export const SwipeableMenuSheetList = createViewSlot("list");
SwipeableMenuSheetList.displayName = "SwipeableMenuSheetList";

export type SwipeableMenuSheetLabelAlign = "left" | "center";

export interface SwipeableMenuSheetGroupProps extends SwipeableMenuSheetSlotProps {
  labelAlign?: SwipeableMenuSheetLabelAlign;
}

export const SwipeableMenuSheetGroup: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetGroupProps
> = forwardRef<unknown, SwipeableMenuSheetGroupProps>((props, ref) => {
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
          <SwipeableMenuSheetItemPositionContext.Provider
            key={isValidElement(item) ? (item.key ?? index) : index}
            value={{ isLast: index === items.length - 1 }}
          >
            {item}
          </SwipeableMenuSheetItemPositionContext.Provider>
        ))}
      </view>
    </GroupLabelAlignContext.Provider>
  );
});
SwipeableMenuSheetGroup.displayName = "SwipeableMenuSheetGroup";

export interface SwipeableMenuSheetFooterProps extends SwipeableMenuSheetSlotProps {}
export const SwipeableMenuSheetFooter = createViewSlot("footer");
SwipeableMenuSheetFooter.displayName = "SwipeableMenuSheetFooter";

export interface SwipeableMenuSheetCloseButtonProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxPressableProps {}

export const SwipeableMenuSheetCloseButton: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetCloseButtonProps
> = forwardRef<unknown, SwipeableMenuSheetCloseButtonProps>((props, ref) => {
  const {
    children,
    className,
    style,
    bindtap: userBindtap,
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
  } = props;
  const { rootRef, setPendingReason, skipAnimation } = useSwipeableMenuSheetContext();
  const handleTap = React.useCallback<NonNullable<LynxPressableProps["bindtap"]>>(
    (event, instance) => {
      setPendingReason("closeButton");
      closeSheet(rootRef, skipAnimation);
      userBindtap?.(event, instance);
    },
    [rootRef, setPendingReason, skipAnimation, userBindtap],
  );
  const { pressed, ...pressHandlers } = usePressTap({
    onTap: handleTap,
    mainThreadOnTap: userMainThreadBindtap,
  });
  const classNames = menuSheet({ skipAnimation, closeButtonPressed: pressed });

  return (
    <view
      {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
      {...pressHandlers}
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
SwipeableMenuSheetCloseButton.displayName = "SwipeableMenuSheetCloseButton";

export type SwipeableMenuSheetItemTone = NonNullable<MenuSheetItemVariantProps["tone"]>;

export interface SwipeableMenuSheetItemProps
  extends LynxStyledElementProps,
    LynxAccessibilityProps,
    LynxPressableProps {
  tone?: SwipeableMenuSheetItemTone;
  labelAlign?: SwipeableMenuSheetLabelAlign;
}

interface SwipeableMenuSheetItemContextValue {
  classNames: SwipeableMenuSheetItemClassNames;
}

const SwipeableMenuSheetItemContext =
  React.createContext<SwipeableMenuSheetItemContextValue | null>(null);

function useSwipeableMenuSheetItemContext(): SwipeableMenuSheetItemContextValue {
  const context = React.useContext(SwipeableMenuSheetItemContext);
  if (!context) {
    throw new Error("SwipeableMenuSheet item slots must be used within SwipeableMenuSheetItem.");
  }
  return context;
}

export const SwipeableMenuSheetItem: LynxForwardRefComponent<unknown, SwipeableMenuSheetItemProps> =
  forwardRef<unknown, SwipeableMenuSheetItemProps>((props, ref) => {
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
    } = props;
    const groupLabelAlign = React.useContext(GroupLabelAlignContext);
    const contentLabelAlign = React.useContext(ContentLabelAlignContext);
    const { isLast } = React.useContext(SwipeableMenuSheetItemPositionContext);
    const resolvedLabelAlign = labelAlign ?? groupLabelAlign ?? contentLabelAlign ?? "left";
    const { pressed, ...pressHandlers } = usePressTap({
      onTap: userBindtap,
      mainThreadOnTap: userMainThreadBindtap,
    });
    const classNames = menuSheetItem({ tone, labelAlign: resolvedLabelAlign, pressed });
    const itemContext = React.useMemo<SwipeableMenuSheetItemContextValue>(
      () => ({ classNames }),
      [classNames],
    );

    return (
      <SwipeableMenuSheetItemContext.Provider value={itemContext}>
        <IconSlotProvider
          value={{
            classNames: { prefixIcon: classNames.prefixIcon },
            deps: [tone, resolvedLabelAlign, pressed],
          }}
        >
          <view
            {...(ref ? ({ ref: ref as LynxViewRef } as Record<string, unknown>) : {})}
            {...pressHandlers}
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
            {children}
          </view>
          {!isLast ? (
            <view className={classNames.divider} accessibility-elements-hidden={true} />
          ) : null}
        </IconSlotProvider>
      </SwipeableMenuSheetItemContext.Provider>
    );
  });
SwipeableMenuSheetItem.displayName = "SwipeableMenuSheetItem";

export interface SwipeableMenuSheetItemContentProps extends LynxStyledElementProps {}

export const SwipeableMenuSheetItemContent: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetItemContentProps
> = forwardRef<unknown, SwipeableMenuSheetItemContentProps>((props, ref) => {
  const { children, className, style } = props;
  const { classNames } = useSwipeableMenuSheetItemContext();

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
SwipeableMenuSheetItemContent.displayName = "SwipeableMenuSheetItemContent";

export interface SwipeableMenuSheetItemLabelProps extends LynxStyledElementProps {}

export const SwipeableMenuSheetItemLabel: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetItemLabelProps
> = forwardRef<unknown, SwipeableMenuSheetItemLabelProps>((props, ref) => {
  const { children, className, style } = props;
  const { classNames } = useSwipeableMenuSheetItemContext();

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
SwipeableMenuSheetItemLabel.displayName = "SwipeableMenuSheetItemLabel";

export interface SwipeableMenuSheetItemDescriptionProps extends LynxStyledElementProps {}

export const SwipeableMenuSheetItemDescription: LynxForwardRefComponent<
  unknown,
  SwipeableMenuSheetItemDescriptionProps
> = forwardRef<unknown, SwipeableMenuSheetItemDescriptionProps>((props, ref) => {
  const { children, className, style } = props;
  const { classNames } = useSwipeableMenuSheetItemContext();

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
SwipeableMenuSheetItemDescription.displayName = "SwipeableMenuSheetItemDescription";
