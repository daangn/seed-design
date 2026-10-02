import * as React from "@lynx-js/react";
import {
  PrefixIcon,
  MenuSheet as SeedMenuSheet,
  type LynxIconElementProps,
} from "@seed-design/lynx-react";

export interface MenuSheetRootProps extends SeedMenuSheet.RootProps {}

export type MenuSheetRootRef = SeedMenuSheet.RootRef;

/**
 * @see https://seed-design.io/lynx/components/menu-sheet
 */
export const MenuSheetRoot = React.forwardRef<MenuSheetRootRef, MenuSheetRootProps>(
  (props, ref) => {
    return <SeedMenuSheet.Root ref={ref} {...props} />;
  },
);
MenuSheetRoot.displayName = "MenuSheetRoot";

export interface MenuSheetTriggerProps extends SeedMenuSheet.TriggerProps {}

export const MenuSheetTrigger = SeedMenuSheet.Trigger;

export interface MenuSheetContentProps extends SeedMenuSheet.ContentProps {
  title?: React.ReactNode;
  description?: React.ReactNode;

  container?: SeedMenuSheet.PositionerProps["container"];

  overlayLevel?: SeedMenuSheet.PositionerProps["overlayLevel"];

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
 * @see https://seed-design.io/lynx/components/menu-sheet
 */
export const MenuSheetContent = React.forwardRef<unknown, MenuSheetContentProps>(
  (
    {
      children,
      title,
      description,
      container,
      overlayLevel,
      showCloseButton = false,
      "accessibility-label": accessibilityLabel,
      ...otherProps
    },
    ref,
  ) => {
    if (!title && !accessibilityLabel && process.env.NODE_ENV !== "production") {
      console.warn("MenuSheetContent requires `accessibility-label` when `title` is not provided.");
    }

    const shouldRenderHeader = title != null || description != null;

    return (
      <SeedMenuSheet.Positioner container={container} overlayLevel={overlayLevel}>
        <SeedMenuSheet.Backdrop />
        <SeedMenuSheet.Content ref={ref} accessibility-label={accessibilityLabel} {...otherProps}>
          <SeedMenuSheet.Handle />
          {shouldRenderHeader ? (
            <SeedMenuSheet.Header>
              {title != null ? <SeedMenuSheet.Title>{title}</SeedMenuSheet.Title> : null}
              {description != null ? (
                <SeedMenuSheet.Description>{description}</SeedMenuSheet.Description>
              ) : null}
            </SeedMenuSheet.Header>
          ) : null}
          <SeedMenuSheet.List>{children}</SeedMenuSheet.List>
          {showCloseButton ? (
            <SeedMenuSheet.Footer>
              <SeedMenuSheet.CloseButton accessibility-label="닫기">닫기</SeedMenuSheet.CloseButton>
            </SeedMenuSheet.Footer>
          ) : null}
        </SeedMenuSheet.Content>
      </SeedMenuSheet.Positioner>
    );
  },
);
MenuSheetContent.displayName = "MenuSheetContent";

export interface MenuSheetGroupProps extends SeedMenuSheet.GroupProps {}

export const MenuSheetGroup = SeedMenuSheet.Group;

export interface MenuSheetItemProps extends Omit<SeedMenuSheet.ItemProps, "children"> {
  prefixIcon?: React.ReactElement<LynxIconElementProps>;
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const MenuSheetItem = React.forwardRef<unknown, MenuSheetItemProps>(
  (
    { prefixIcon, label, description, "accessibility-label": accessibilityLabel, ...otherProps },
    ref,
  ) => {
    return (
      <SeedMenuSheet.Item
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        {...otherProps}
      >
        {prefixIcon != null ? <PrefixIcon icon={prefixIcon} /> : null}
        <SeedMenuSheet.ItemContent>
          <SeedMenuSheet.ItemLabel>{label}</SeedMenuSheet.ItemLabel>
          {description != null ? (
            <SeedMenuSheet.ItemDescription>{description}</SeedMenuSheet.ItemDescription>
          ) : null}
        </SeedMenuSheet.ItemContent>
      </SeedMenuSheet.Item>
    );
  },
);
MenuSheetItem.displayName = "MenuSheetItem";
