/**
 * 문서 헤더 island. `client:load`, persist하지 않는다(이동 뒤 유지할 상태가 없다). 이동마다 새 페이지의 것이 다시
 * hydrate된다. 마크업은 기존 `components/header/{docs-header,site-header,nav-menu,header-actions}.tsx`와 같다.
 *
 * - 데스크톱(≥968px): 로고, SEED NavigationMenu(Develop → React/Lynx), 테마 버튼, 검색 버튼.
 * - 모바일(<968px): 로고, 테마·검색·메뉴 버튼. 메뉴 버튼은 `openMobileNav()`만 부른다(패널은 `DocsNav`).
 * - 검색 다이얼로그: `searchOpen` atom이 처음 true가 될 때 `React.lazy`로 불러온다. 첫 로드 JS에 없다. 이 island는
 *   페이지마다 다시 hydrate되지만 dialog module과 검색 index는 module 캐시라 세션 동안 한 번만 받는다.
 *
 * 불변식
 * - 테마 아이콘은 해·달 둘 다 렌더링하고 CSS(`html.dark`)가 하나를 고른다. 서버 HTML과 hydrate 결과가 테마와 무관하다.
 * - 활성 nav 항목은 `currentPath` props에서 계산한다. 링크는 plain `<a>`, Develop 메뉴 항목은 `navigate()`다.
 *
 * 측정 게이트(PLAN「경험 예산」): 이동 1회의 `astro:after-swap` → 이 island의 `astro:hydrate` p95 ≤ 50ms
 * (Chromium, CPU 4×), 이동 구간 50ms 넘는 long task 0. 실패 시 escape hatch는 persist(`SiteHeader` 주석 DESIGN 핵심 결정 5).
 */
import {
  IconChevronDownSmallLine,
  IconHorizline3VerticalLine,
  IconMagnifyingglassFill,
  IconMoonFill,
  IconSunFill,
} from "@karrotmarket/react-monochrome-icon";
import { navigate } from "astro:transitions/client";
import clsx from "clsx";
import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { DocsNavigationMenuContent } from "../../components/header/docs-nav-menu-content";
import { NAV_ITEMS, type NavItem } from "../../components/header/nav-items";
import { SeedMark } from "../../components/landing/seed-mark";
import { SeedWordmark } from "../../components/landing/seed-wordmark";
import { archivePaths } from "../../lib/docs-archive";
import {
  NavigationMenuGroup,
  NavigationMenuItem,
  NavigationMenuProvider,
  NavigationMenuRoot,
  NavigationMenuTrigger,
} from "../../registry/react/ui/navigation-menu";
import { TAGS } from "../../lib/search-tags";
import { toggleTheme } from "./root-attributes";
import { closeSearch, openMobileNav, openSearch, searchOpen } from "./store";
import { useAtom } from "./use-store";

const SearchDialog = lazy(() => import("../../components/search/search"));

export interface SiteHeaderProps {
  currentPath: string;
  /** 현재 섹션. 검색 다이얼로그의 기본 필터가 된다(필터 칩이 없는 섹션·404는 "All"). */
  sectionId: string | null;
}

const itemBase =
  "flex items-center gap-1 whitespace-nowrap rounded-r2 px-1.5 py-1 text-base text-fg-neutral transition-colors min-[1120px]:px-2 min-[1120px]:py-1.5 min-[1280px]:px-3";
const itemInteractiveState =
  "hover:bg-bg-transparent-pressed aria-[expanded=true]:bg-bg-transparent-pressed";

function isActive(item: NavItem, path: string) {
  return !!item.match?.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

/** 원형 아이콘 버튼(r-full, 16px 아이콘). 기존 `header-actions.tsx`의 `ActionButton`과 같은 마크업. */
function ActionButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={clsx(
        "flex cursor-pointer items-center justify-center rounded-full bg-bg-transparent-selected text-fg-neutral transition-colors hover:bg-bg-transparent-selected-pressed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stroke-focus-ring [&_svg]:size-4",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ThemeToggle({ className }: { className: string }) {
  return (
    <ActionButton label="테마 전환" onClick={toggleTheme} className={className}>
      <IconMoonFill className="dark:hidden" />
      <IconSunFill className="hidden dark:block" />
    </ActionButton>
  );
}

function SearchButton({ className }: { className: string }) {
  return (
    <ActionButton label="검색" onClick={openSearch} className={className}>
      <IconMagnifyingglassFill />
    </ActionButton>
  );
}

function DevelopMenu({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <NavigationMenuRoot value={item.label}>
      <NavigationMenuTrigger asChild>
        <button
          type="button"
          className={clsx(
            itemBase,
            itemInteractiveState,
            active && "bg-bg-transparent-pressed",
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
              onClick={() => void navigate(child.href)}
            />
          ))}
        </NavigationMenuGroup>
      </DocsNavigationMenuContent>
    </NavigationMenuRoot>
  );
}

function SiteNav({ currentPath }: { currentPath: string }) {
  return (
    <NavigationMenuProvider placement="bottom-start" size="small">
      <nav className="flex items-center gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, currentPath);
          if (item.children?.length)
            return <DevelopMenu key={item.label} item={item} active={active} />;
          return (
            <a
              key={item.label}
              href={item.href}
              className={clsx(
                itemBase,
                itemInteractiveState,
                active && "bg-bg-transparent-pressed",
              )}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </NavigationMenuProvider>
  );
}

/** 검색 필터. latest는 모든 섹션, archive 빌드는 그 플랫폼 하나(기존 Next 섹션 layout과 같다). */
const SEARCH_TAGS = archivePaths.platform ? [TAGS[archivePaths.platform]] : Object.values(TAGS);

/** 처음 열릴 때 받는다. 한 번 받은 뒤에는 닫혀도 남겨 두어 닫힘 애니메이션과 다음 열림이 바로 된다. */
function LazySearch({ sectionId }: { sectionId: string | null }) {
  const open = useAtom(searchOpen, false);
  const [requested, setRequested] = useState(false);
  useEffect(() => {
    if (open) setRequested(true);
  }, [open]);
  if (!requested) return null;
  const defaultTag = SEARCH_TAGS.find((tag) => tag.value === sectionId)?.value;
  return (
    <Suspense fallback={null}>
      <SearchDialog
        open={open}
        onOpenChange={(next) => (next ? openSearch() : closeSearch())}
        defaultTag={defaultTag}
        tags={SEARCH_TAGS}
      />
    </Suspense>
  );
}

export function SiteHeader({ currentPath, sectionId }: SiteHeaderProps) {
  const desktopAction = "size-9 min-[968px]:size-8 min-[1120px]:size-9";
  return (
    <header className="sticky top-0 z-40 [grid-area:header]">
      <div className="hidden bg-fd-background min-[968px]:block">
        <div className="grid h-[76px] w-full grid-cols-[1fr_auto_1fr] items-center px-4 min-[968px]:h-[72px] min-[968px]:px-3 min-[1120px]:h-[76px] min-[1120px]:px-4">
          <a
            href={archivePaths.link("/")}
            aria-label="SEED Design System 홈"
            className="flex items-center justify-self-start text-palette-gray-1000 dark:text-palette-static-white"
          >
            <SeedMark className="h-10 w-auto shrink-0 min-[968px]:h-8 min-[1120px]:h-9 min-[1280px]:h-10" />
            <SeedWordmark className="ml-2 h-10 w-auto min-[968px]:ml-1.5 min-[968px]:h-8 min-[1120px]:ml-2 min-[1120px]:h-9 min-[1280px]:h-10" />
          </a>
          <SiteNav currentPath={currentPath} />
          <div className="flex items-center gap-1.5 justify-self-end text-fg-neutral">
            <ThemeToggle className={desktopAction} />
            <SearchButton className={desktopAction} />
          </div>
        </div>
      </div>

      {/* 뷰포트 전체 폭. header의 grid-area 오프셋을 상쇄해 가운데에 둔다(기존 docs-header.tsx와 같다). */}
      <div className="relative left-[50%] ml-[-50vw] flex h-16 w-screen items-center justify-between bg-fd-background px-4 min-[968px]:hidden">
        <a
          href={archivePaths.link("/")}
          aria-label="SEED Design System 홈"
          className="text-palette-gray-1000 dark:text-palette-static-white"
        >
          <SeedMark className="h-10 w-auto" />
        </a>
        <div className="flex items-center gap-2.5 text-fg-neutral">
          <ThemeToggle className="size-10" />
          <SearchButton className="size-10" />
          <ActionButton label="메뉴" onClick={openMobileNav} className="size-10">
            <IconHorizline3VerticalLine />
          </ActionButton>
        </div>
      </div>
      <LazySearch sectionId={sectionId} />
    </header>
  );
}
