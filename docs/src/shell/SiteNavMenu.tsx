/**
 * 헤더 데스크톱 nav의 SEED NavigationMenu 판(Develop → React/Lynx). `SiteHeader.tsx`가 사용자가 메뉴 버튼에 다가갈 때
 * lazy로 받는다(NavigationMenu·floating-ui가 첫 로드 JS에 들지 않게). 마크업은 정적 nav와 같다(`site-nav-parts.tsx`).
 */
import { navigate } from "astro:transitions/client";
import clsx from "clsx";
import { DocsNavigationMenuContent } from "../../components/header/docs-nav-menu-content";
import {
  NavigationMenuGroup,
  NavigationMenuItem,
  NavigationMenuProvider,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from "../../registry/react/ui/navigation-menu";
import { isActive, NAV_ITEMS, NavLinkItem, NavMenuButton, type NavItem } from "./site-nav-parts";

function DevelopMenu({
  item,
  active,
  autoFocus,
}: {
  item: NavItem;
  active: boolean;
  autoFocus: boolean;
}) {
  return (
    <NavigationMenuRoot value={item.label}>
      <NavigationMenuTrigger asChild>
        <NavMenuButton item={item} active={active} autoFocus={autoFocus} />
      </NavigationMenuTrigger>
      <DocsNavigationMenuContent>
        <NavigationMenuGroup>
          {item.children?.map((child) => (
            <NavigationMenuItem
              key={child.label}
              className="cursor-pointer"
              label={child.label}
              onClick={() => void navigate(child.href)}
            />
          ))}
        </NavigationMenuGroup>
      </DocsNavigationMenuContent>
    </NavigationMenuRoot>
  );
}

export default function SiteNavMenu({
  currentPath,
  defaultValue,
  autoFocus,
  className,
}: {
  currentPath: string;
  /** 받았을 때 열려 있을 메뉴(받기 전에 누르거나 포인터가 아직 위에 있을 때). */
  defaultValue: string | null;
  /** 받기 전의 정적 버튼에 focus가 있었으면 메뉴 버튼이 이어받는다. */
  autoFocus: boolean;
  /** 정적 nav(`SiteHeader.tsx#SiteNav`)와 같은 `<nav>` class. */
  className?: string;
}) {
  return (
    <NavigationMenuProvider placement="bottom-start" size="small" defaultValue={defaultValue}>
      <nav className={clsx("flex items-center gap-0.5", className)}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, currentPath);
          if (item.children?.length)
            return (
              <DevelopMenu key={item.label} item={item} active={active} autoFocus={autoFocus} />
            );
          return <NavLinkItem key={item.label} item={item} active={active} />;
        })}
      </nav>
    </NavigationMenuProvider>
  );
}
