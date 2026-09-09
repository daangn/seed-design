"use client";

import {
  NavigationMenuGroup,
  NavigationMenuItem,
  NavigationMenuProvider,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from "@/registry/react/ui/navigation-menu";
import { IconChevronDownSmallLine } from "@karrotmarket/react-monochrome-icon";
import { DocsNavigationMenuContent } from "./docs-nav-menu-content";
import { clsx } from "cn";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAV_ITEMS, type NavItem } from "./nav-items";

/** Text stays neutral; hover/current/open state is expressed through pressed background. */
const defaultItemBase =
  "flex items-center gap-1 whitespace-nowrap rounded-r2 px-3 py-1.5 text-base text-fg-neutral transition-colors";
const docsItemBase =
  "flex items-center gap-1 whitespace-nowrap rounded-r2 px-1.5 py-1 text-base text-fg-neutral transition-colors min-[1120px]:px-2 min-[1120px]:py-1.5 min-[1280px]:px-3";
const itemInteractiveState =
  "hover:bg-bg-transparent-pressed aria-[expanded=true]:bg-bg-transparent-pressed";
const itemState = (active: boolean) => (active ? "bg-bg-transparent-pressed" : undefined);

type SiteNavDensity = "default" | "docs";

function getItemBase(density: SiteNavDensity) {
  return density === "docs" ? docsItemBase : defaultItemBase;
}

function useIsActive() {
  const pathname = usePathname();
  return (item: NavItem) =>
    !!item.match?.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * A nav item that reveals its `children` in a SEED NavigationMenu flyout on hover
 * (e.g. Develop → React / Lynx). The trigger is a disclosure, not a link;
 * the children navigate via the router (NavigationMenuItem has no native href).
 */
function DropdownItem({
  item,
  active,
  itemBase,
}: {
  item: NavItem;
  active: boolean;
  itemBase: string;
}) {
  const router = useRouter();
  return (
    <NavigationMenuRoot value={item.label}>
      <NavigationMenuTrigger asChild>
        <button
          type="button"
          className={clsx(
            itemBase,
            itemInteractiveState,
            itemState(active),
            "cursor-pointer [&_svg]:size-3",
          )}
        >
          {item.label}
          <IconChevronDownSmallLine />
        </button>
      </NavigationMenuTrigger>
      <DocsNavigationMenuContent>
        <NavigationMenuGroup>
          {item.children?.map((child) => (
            <NavigationMenuItem
              key={child.label}
              className="cursor-pointer"
              label={child.label}
              onClick={() => router.push(child.href)}
            />
          ))}
        </NavigationMenuGroup>
      </DocsNavigationMenuContent>
    </NavigationMenuRoot>
  );
}

/**
 * The docs header's centered nav: links keep neutral text and show hover/current/open
 * state through the pressed transparent background. A single
 * NavigationMenuProvider hosts every dropdown; hover open/close is automatic.
 */
export function SiteNav({
  className,
  density = "default",
}: {
  className?: string;
  density?: SiteNavDensity;
}) {
  const isActive = useIsActive();
  const itemBase = getItemBase(density);
  return (
    <NavigationMenuProvider placement="bottom-start" size="small">
      <nav className={clsx("flex items-center gap-0.5", className)}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);

          if (item.children?.length) {
            return (
              <DropdownItem key={item.label} item={item} active={active} itemBase={itemBase} />
            );
          }

          if (item.disabled) {
            return (
              <span
                key={item.label}
                aria-disabled
                className={clsx(itemBase, "cursor-default opacity-60")}
              >
                {item.label}
              </span>
            );
          }

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(itemBase, itemInteractiveState, itemState(false))}
              >
                {item.label}
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(itemBase, itemInteractiveState, itemState(active))}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </NavigationMenuProvider>
  );
}
