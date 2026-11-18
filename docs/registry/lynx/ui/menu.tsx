import * as React from "@lynx-js/react";
import { Menu as SeedMenu, type LynxIconElementProps } from "@seed-design/lynx-react";

export interface MenuRootProps extends SeedMenu.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/menu
 */
export const MenuRoot = SeedMenu.Root;

export interface MenuAnchorProps extends SeedMenu.AnchorProps {}

/**
 * 위치 기준점만 만드는 Anchor입니다. 탭으로 메뉴를 열고 닫으려면 MenuTrigger를 사용하세요.
 *
 * @see https://seed-design.io/lynx/components/menu
 */
export const MenuAnchor = SeedMenu.Anchor;

export interface MenuTriggerProps extends SeedMenu.TriggerProps {}

/**
 * @see https://seed-design.io/lynx/components/menu
 */
export const MenuTrigger = SeedMenu.Trigger;

export interface MenuContentProps extends SeedMenu.ContentProps {
  /**
   * 지정하면 Lynx view 밖까지 덮는 native overlay에 렌더링합니다. 생략하면 Lynx view 안의 고정 native
   * `view`로 렌더링합니다.
   */
  container?: SeedMenu.PositionerProps["container"];

  overlayLevel?: SeedMenu.PositionerProps["overlayLevel"];
}

/**
 * 메뉴 레이어(Positioner), 위치를 계산하는 표면(Content)과 긴 목록의 스크롤 영역(ScrollArea)을
 * 조립합니다. 자식에 별도 Positioner나 ScrollArea를 추가하지 마세요.
 *
 * @see https://seed-design.io/lynx/components/menu
 */
export const MenuContent = React.forwardRef<unknown, MenuContentProps>(
  ({ children, container, overlayLevel, ...otherProps }, ref) => {
    return (
      <SeedMenu.Positioner container={container} overlayLevel={overlayLevel}>
        <SeedMenu.Content ref={ref} {...otherProps}>
          <SeedMenu.ScrollArea>{children}</SeedMenu.ScrollArea>
        </SeedMenu.Content>
      </SeedMenu.Positioner>
    );
  },
);
MenuContent.displayName = "MenuContent";

export interface MenuGroupProps extends SeedMenu.GroupProps {}

export const MenuGroup = SeedMenu.Group;

export interface MenuGroupLabelProps extends SeedMenu.GroupLabelProps {}

export const MenuGroupLabel = SeedMenu.GroupLabel;

export interface MenuItemProps extends Omit<SeedMenu.ItemProps, "children"> {
  label: React.ReactNode;

  description?: React.ReactNode;

  prefixIcon?: React.ReactElement<LynxIconElementProps>;

  suffixIcon?: React.ReactElement<LynxIconElementProps>;
}

/**
 * 아이콘, 레이블, 설명 슬롯을 조립해 한 항목으로 제공합니다. `bindtap`은 선택 직전에
 * 호출되고, 비활성 항목에는 호출되지 않습니다.
 *
 * @see https://seed-design.io/lynx/components/menu
 */
export const MenuItem = React.forwardRef<unknown, MenuItemProps>(
  (
    {
      label,
      description,
      prefixIcon,
      suffixIcon,
      "accessibility-label": accessibilityLabel,
      ...otherProps
    },
    ref,
  ) => {
    return (
      <SeedMenu.Item
        ref={ref}
        accessibility-label={accessibilityLabel ?? (typeof label === "string" ? label : undefined)}
        {...otherProps}
      >
        {prefixIcon ? <SeedMenu.PrefixIcon icon={prefixIcon} /> : null}
        <SeedMenu.ItemBody>
          <SeedMenu.ItemLabel>{label}</SeedMenu.ItemLabel>
          {description != null ? (
            <SeedMenu.ItemDescription>{description}</SeedMenu.ItemDescription>
          ) : null}
        </SeedMenu.ItemBody>
        {suffixIcon ? <SeedMenu.SuffixIcon icon={suffixIcon} /> : null}
      </SeedMenu.Item>
    );
  },
);
MenuItem.displayName = "MenuItem";
