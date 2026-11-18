/**
 * 헤더 데스크톱 nav의 마크업 조각. 정적 nav(`SiteHeader.tsx`, 첫 로드·hydrate)와 메뉴 nav(`SiteNavMenu.tsx`, lazy)가 같은
 * DOM을 그리도록 함께 쓴다.
 */
import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import clsx from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { NAV_ITEMS, type NavItem } from "../../components/header/nav-items";

const itemBase =
  "flex items-center gap-1 whitespace-nowrap rounded-r2 px-1.5 py-1 text-base text-fg-neutral transition-colors min-[1120px]:px-2 min-[1120px]:py-1.5 min-[1280px]:px-3";
const itemInteractiveState =
  "hover:bg-bg-transparent-pressed aria-[expanded=true]:bg-bg-transparent-pressed";

export { NAV_ITEMS, type NavItem };

export function isActive(item: NavItem, path: string) {
  return !!item.match?.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function NavLinkItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <a
      href={item.href}
      className={clsx(itemBase, itemInteractiveState, active && "bg-bg-transparent-pressed")}
    >
      {item.label}
    </a>
  );
}

/** 하위 메뉴가 있는 항목(Develop)의 버튼. */
export const NavMenuButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { item: NavItem; active: boolean }
>(({ item, active, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={clsx(
      itemBase,
      itemInteractiveState,
      active && "bg-bg-transparent-pressed",
      "cursor-pointer [&_svg]:size-3",
      className,
    )}
    {...props}
  >
    {item.label}
    <IconChevronDownSmallLine />
  </button>
));
NavMenuButton.displayName = "NavMenuButton";
