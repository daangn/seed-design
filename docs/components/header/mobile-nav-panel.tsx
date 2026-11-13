"use client";

import { archivePaths } from "@/lib/docs-archive";

import { IconChevronLeftLine, IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { type DocsVersionPlatform, DocsVersionSwitcher } from "@/components/docs-version-switcher";
import { Icon, Portal, ScrollFog, SidePanel as SeedSidePanel } from "@seed-design/react";
import clsx from "clsx";
import { SiteLink } from "@/components/site-link";
import { type RefObject, useEffect, useRef, useState } from "react";
import { type FolderOpenMap, isFolderOpen } from "@/src/shell/nav-folders";
import {
  folderContains,
  isCurrentLink,
  type NavFolder,
  type NavGroup,
  type NavLink,
  type SectionNav,
} from "@/src/shell/nav-model";
import { SidebarFeaturedDot } from "../layout/sidebar-featured-dot";
import { SeedMark } from "../landing/seed-mark";
import { SeedWordmark } from "../landing/seed-wordmark";
import {
  DocsMobileNavAccordion,
  DocsMobileNavButtonItem,
  DocsMobileNavLinkItem,
  DocsMobileNavList,
  DocsMobileNavListHeader,
} from "./mobile-nav-accordion";
import { NAV_ITEMS, type NavItem } from "./nav-items";

/** 문서 섹션 메뉴. 폴더 열림 상태는 데스크톱 사이드바와 같은 `DocsNav`의 맵이다. */
export interface MobileNavSection {
  nav: SectionNav;
  platform: DocsVersionPlatform | null;
  folders: FolderOpenMap;
  onFolderOpenChange: (folder: NavFolder, open: boolean) => void;
}

interface MobileNavPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 현재 경로. 주 메뉴·섹션 메뉴의 현재 항목 표시에 쓴다. */
  pathname: string;
  section?: MobileNavSection;
  /** overlay를 붙일 요소. 문서 셸은 persist된 `#docs-nav-portal`이다(없으면 `document.body`). */
  portalContainer?: RefObject<HTMLElement | null>;
}

type MobileNavView = "menu" | "section";

const PANEL_CONTENT_CLASS =
  "isolate bg-fd-background text-fd-foreground max-md:!w-screen max-md:!max-w-none";
const PANEL_POSITIONER_CLASS = "[--side-panel-z-index:1100]";
const PANEL_HEADER_CLASS =
  "flex min-h-16 flex-row items-center gap-3 px-5 py-4 [&&]:pt-4 [&&]:pb-4 [&&]:pl-5 [&&]:pr-5";
const PANEL_ICON_BUTTON_CLASS =
  "static flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-transparent-selected text-fg-neutral transition-colors hover:bg-bg-transparent-selected-pressed [&_svg]:size-4";
const PANEL_BACK_BUTTON_CLASS =
  "static flex size-10 shrink-0 items-center justify-center rounded-full bg-transparent text-fg-neutral transition-colors hover:bg-bg-transparent-selected [&_svg]:size-5";
const PANEL_LOGO_BUTTON_CLASS =
  "flex h-10 min-w-0 flex-1 items-center rounded-lg text-left text-fg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring";
const PANEL_SCROLL_FOG_CLASS = "min-h-0 flex-1";
const PANEL_BODY_CLASS = "px-2 pt-5 pb-20";
const MAIN_MENU_CHILD_INDENT = 12;
const SECTION_ITEM_INDENT_PER_LEVEL = 6;

function isActiveNavItem(item: NavItem, pathname: string) {
  return !!item.match?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function isActiveNavHref(href: string, pathname: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MainMenuItem({
  item,
  active,
  pathname,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  pathname: string;
  onClose: () => void;
}) {
  if (item.children?.length) {
    return (
      <li>
        <DocsMobileNavAccordion
          value={item.label}
          title={item.label}
          current={active}
          defaultOpen={active}
        >
          <DocsMobileNavList className="mt-2">
            {item.children.map((child) => {
              const childActive = isActiveNavHref(child.href, pathname);

              return (
                <DocsMobileNavLinkItem
                  key={child.href}
                  title={child.label}
                  href={child.href}
                  current={childActive}
                  indent={MAIN_MENU_CHILD_INDENT}
                  onClick={onClose}
                />
              );
            })}
          </DocsMobileNavList>
        </DocsMobileNavAccordion>
      </li>
    );
  }

  if (item.disabled) {
    return <DocsMobileNavButtonItem title={item.label} disabled />;
  }

  if (item.external) {
    return (
      <DocsMobileNavLinkItem
        title={item.label}
        current={active}
        href={item.href}
        external
        onClick={onClose}
      />
    );
  }

  return (
    <DocsMobileNavLinkItem title={item.label} href={item.href} current={active} onClick={onClose} />
  );
}

function getSectionItemIndent(item: NavLink) {
  return item.level * SECTION_ITEM_INDENT_PER_LEVEL;
}

function MobileSectionItem({
  item,
  pathname,
  onClose,
}: {
  item: NavLink;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <DocsMobileNavLinkItem
      title={
        <>
          {item.label}
          {item.featured && <SidebarFeaturedDot />}
        </>
      }
      href={item.href}
      external={item.external}
      current={isCurrentLink(item, pathname)}
      indent={getSectionItemIndent(item)}
      suffix={
        item.external ? <IconSeedArrow external className="size-4 text-fg-neutral" /> : undefined
      }
      onClick={onClose}
    />
  );
}

function MobileSectionFolder({
  item,
  section,
  pathname,
  onClose,
}: {
  item: NavFolder;
  section: MobileNavSection;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <li>
      <DocsMobileNavAccordion
        value={item.key}
        title={item.label}
        current={folderContains(item, pathname)}
        open={isFolderOpen(section.folders, item)}
        onOpenChange={(open) => section.onFolderOpenChange(item, open)}
        collapsible={item.collapsible}
        index={
          item.index
            ? { current: isCurrentLink(item.index, pathname), featured: item.index.featured }
            : undefined
        }
      >
        <DocsMobileNavList className="mt-2">
          {item.items.map((sub) => (
            <MobileSectionItem key={sub.key} item={sub} pathname={pathname} onClose={onClose} />
          ))}
        </DocsMobileNavList>
      </DocsMobileNavAccordion>
    </li>
  );
}

function MobileSectionGroup({
  group,
  isFirst,
  section,
  pathname,
  onClose,
}: {
  group: NavGroup;
  isFirst: boolean;
  section: MobileNavSection;
  pathname: string;
  onClose: () => void;
}) {
  return (
    <section className={clsx(!isFirst && "mt-4")}>
      {group.divider && <hr className="mx-3 my-1 border-0 border-t border-fd-border" />}
      {group.label && <DocsMobileNavListHeader>{group.label}</DocsMobileNavListHeader>}
      <DocsMobileNavList>
        {group.items.map((item) =>
          item.kind === "folder" ? (
            <MobileSectionFolder
              key={item.key}
              item={item}
              section={section}
              pathname={pathname}
              onClose={onClose}
            />
          ) : (
            <MobileSectionItem key={item.key} item={item} pathname={pathname} onClose={onClose} />
          ),
        )}
      </DocsMobileNavList>
    </section>
  );
}

function PanelCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      aria-label="메뉴 닫기"
      className={PANEL_ICON_BUTTON_CLASS}
      onClick={onClose}
    >
      <Icon svg={<IconXmarkLine />} />
    </button>
  );
}

function MainMenuView({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <>
      <SeedSidePanel.Header className={clsx(PANEL_HEADER_CLASS, "justify-between")}>
        <SeedSidePanel.Title className="min-w-0 flex-1">
          <SiteLink
            href={archivePaths.link("/")}
            aria-label="SEED 홈으로 이동"
            className={PANEL_LOGO_BUTTON_CLASS}
            onClick={onClose}
          >
            <span className="sr-only">SEED</span>
            <SeedMark className="h-10 w-auto shrink-0" />
            <SeedWordmark className="ml-2 h-10 w-auto" />
          </SiteLink>
        </SeedSidePanel.Title>
        <PanelCloseButton onClose={onClose} />
      </SeedSidePanel.Header>
      <ScrollFog
        hideScrollBar
        placement={["top", "bottom"]}
        sizes={{ top: 20, bottom: 32 }}
        className={PANEL_SCROLL_FOG_CLASS}
      >
        <nav aria-label="사이트 메뉴" className={PANEL_BODY_CLASS}>
          <DocsMobileNavList>
            {NAV_ITEMS.map((item) => (
              <MainMenuItem
                key={item.label}
                item={item}
                active={isActiveNavItem(item, pathname)}
                pathname={pathname}
                onClose={onClose}
              />
            ))}
          </DocsMobileNavList>
        </nav>
      </ScrollFog>
    </>
  );
}

function SectionView({
  section,
  pathname,
  onBack,
  onClose,
}: {
  section: MobileNavSection;
  pathname: string;
  onBack: () => void;
  onClose: () => void;
}) {
  const versionContainer = useRef<HTMLDivElement>(null);
  const versionPlatform = section.platform;

  return (
    <>
      <SeedSidePanel.Header className={clsx(PANEL_HEADER_CLASS, "justify-between")}>
        <button
          type="button"
          aria-label="상위 메뉴로 돌아가기"
          className={PANEL_BACK_BUTTON_CLASS}
          onClick={onBack}
        >
          <IconChevronLeftLine />
        </button>
        <SeedSidePanel.Title className="t9-medium min-w-0 flex-1 truncate text-fg-neutral">
          {section.nav.label}
        </SeedSidePanel.Title>
        <PanelCloseButton onClose={onClose} />
      </SeedSidePanel.Header>
      {versionPlatform && (
        <div ref={versionContainer} className="relative z-10 px-5 pb-2">
          <DocsVersionSwitcher platform={versionPlatform} positionerContainer={versionContainer} />
        </div>
      )}
      <ScrollFog
        hideScrollBar
        placement={["top", "bottom"]}
        sizes={{ top: 20, bottom: 32 }}
        className={PANEL_SCROLL_FOG_CLASS}
      >
        <div className={PANEL_BODY_CLASS}>
          {section.nav.groups.map((group, index) => (
            <MobileSectionGroup
              key={group.key}
              group={group}
              isFirst={index === 0}
              section={section}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </div>
      </ScrollFog>
    </>
  );
}

export function MobileNavPanel({
  open,
  onOpenChange,
  pathname,
  section,
  portalContainer,
}: MobileNavPanelProps) {
  const initialView: MobileNavView = section ? "section" : "menu";
  const [view, setView] = useState<MobileNavView>(initialView);

  useEffect(() => {
    if (!open) return;
    setView(initialView);
  }, [open, initialView]);

  const shouldShowSection = view === "section" && section;

  // Render in a Portal so the panel escapes the landing's light-only <main> scope, where the
  // --color-* bridge bakes text to light values. Docs pages pass the persisted `#docs-nav-portal`
  // so an open panel survives the ClientRouter body swap without being left on the old body.
  return (
    <SeedSidePanel.Root open={open} onOpenChange={onOpenChange} size="small" direction="right">
      <Portal container={portalContainer}>
        <SeedSidePanel.Positioner className={PANEL_POSITIONER_CLASS}>
          <SeedSidePanel.Backdrop />
          <SeedSidePanel.Content aria-label="사이트 메뉴" className={PANEL_CONTENT_CLASS}>
            {shouldShowSection ? (
              <SectionView
                section={section}
                pathname={pathname}
                onBack={() => setView("menu")}
                onClose={() => onOpenChange(false)}
              />
            ) : (
              <MainMenuView pathname={pathname} onClose={() => onOpenChange(false)} />
            )}
          </SeedSidePanel.Content>
        </SeedSidePanel.Positioner>
      </Portal>
    </SeedSidePanel.Root>
  );
}
