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

export interface MenuContentProps extends SeedMenu.ContentProps {}

/**
 * Overlay, 위치 계산, 표시 수명과 긴 메뉴의 스크롤 영역을 함께 구성합니다.
 * 자식에 별도 Positioner나 ScrollArea를 추가하지 마세요.
 *
 * @see https://seed-design.io/lynx/components/menu
 */
export const MenuContent = SeedMenu.Content;

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
