import * as React from "@lynx-js/react";
import {
  PrefixIcon,
  SwipeableMenuSheet as SeedSwipeableMenuSheet,
  type LynxIconElementProps,
} from "@seed-design/lynx-react";

export interface SwipeableMenuSheetRootProps extends SeedSwipeableMenuSheet.RootProps {}

export type SwipeableMenuSheetRootRef = SeedSwipeableMenuSheet.RootRef;

/**
 * @see https://seed-design.io/lynx/components/swipeable-menu-sheet
 */
export const SwipeableMenuSheetRoot = React.forwardRef<
  SwipeableMenuSheetRootRef,
  SwipeableMenuSheetRootProps
>((props, ref) => {
  return <SeedSwipeableMenuSheet.Root ref={ref} {...props} />;
});
SwipeableMenuSheetRoot.displayName = "SwipeableMenuSheetRoot";

export interface SwipeableMenuSheetTriggerProps extends SeedSwipeableMenuSheet.TriggerProps {}

export const SwipeableMenuSheetTrigger = SeedSwipeableMenuSheet.Trigger;

export interface SwipeableMenuSheetContentProps extends SeedSwipeableMenuSheet.ContentProps {
  title?: React.ReactNode;
  description?: React.ReactNode;

  /**
   * @default false
   *
   * Lynx는 웹과 달리 숨겨진 close button fallback을 제공하지 않습니다.
   */
  showCloseButton?: boolean;
}

/**
 * Positioner / Backdrop / Handle / Header / List를 내부에서 조립해
 * 단일 컴포넌트로 메뉴 시트를 구성할 수 있도록 합니다.
 *
 * @see https://seed-design.io/lynx/components/swipeable-menu-sheet
 */
export const SwipeableMenuSheetContent = React.forwardRef<unknown, SwipeableMenuSheetContentProps>(
  (
    {
      children,
      title,
      description,
      showCloseButton = false,
      "accessibility-label": accessibilityLabel,
      ...otherProps
    },
    ref,
  ) => {
    if (!title && !accessibilityLabel && process.env.NODE_ENV !== "production") {
      console.warn(
        "SwipeableMenuSheetContent requires `accessibility-label` when `title` is not provided.",
      );
    }

    const shouldRenderHeader = title != null || description != null;

    return (
      <SeedSwipeableMenuSheet.Positioner>
        <SeedSwipeableMenuSheet.Backdrop />
        <SeedSwipeableMenuSheet.Content
          ref={ref}
          accessibility-label={accessibilityLabel}
          {...otherProps}
        >
          <SeedSwipeableMenuSheet.Handle />
          {shouldRenderHeader ? (
            <SeedSwipeableMenuSheet.Header>
              {title != null ? (
                <SeedSwipeableMenuSheet.Title>{title}</SeedSwipeableMenuSheet.Title>
              ) : null}
              {description != null ? (
                <SeedSwipeableMenuSheet.Description>
                  {description}
                </SeedSwipeableMenuSheet.Description>
              ) : null}
            </SeedSwipeableMenuSheet.Header>
          ) : null}
          <SeedSwipeableMenuSheet.List>{children}</SeedSwipeableMenuSheet.List>
          {showCloseButton ? (
            <SeedSwipeableMenuSheet.Footer>
              <SeedSwipeableMenuSheet.CloseButton accessibility-label="닫기">
                닫기
              </SeedSwipeableMenuSheet.CloseButton>
            </SeedSwipeableMenuSheet.Footer>
          ) : null}
        </SeedSwipeableMenuSheet.Content>
      </SeedSwipeableMenuSheet.Positioner>
    );
  },
);
SwipeableMenuSheetContent.displayName = "SwipeableMenuSheetContent";

export interface SwipeableMenuSheetGroupProps extends SeedSwipeableMenuSheet.GroupProps {}

export const SwipeableMenuSheetGroup = SeedSwipeableMenuSheet.Group;

export interface SwipeableMenuSheetItemProps
  extends Omit<SeedSwipeableMenuSheet.ItemProps, "children"> {
  prefixIcon?: React.ReactElement<LynxIconElementProps>;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const SwipeableMenuSheetItem = React.forwardRef<unknown, SwipeableMenuSheetItemProps>(
  (
    { prefixIcon, label, description, "accessibility-label": accessibilityLabel, ...otherProps },
    ref,
  ) => {
    return (
      <SeedSwipeableMenuSheet.Item
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        {...otherProps}
      >
        {prefixIcon != null ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedSwipeableMenuSheet.ItemContent>
          <SeedSwipeableMenuSheet.ItemLabel>{label}</SeedSwipeableMenuSheet.ItemLabel>
          {description != null ? (
            <SeedSwipeableMenuSheet.ItemDescription>
              {description}
            </SeedSwipeableMenuSheet.ItemDescription>
          ) : null}
        </SeedSwipeableMenuSheet.ItemContent>
      </SeedSwipeableMenuSheet.Item>
    );
  },
);
SwipeableMenuSheetItem.displayName = "SwipeableMenuSheetItem";
