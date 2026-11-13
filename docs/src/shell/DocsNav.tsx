/**
 * 문서 내비게이션 island. 데스크톱 사이드바(≥968px)와 모바일 메뉴 패널(<968px, SEED `SidePanel` 모달)을 함께 그린다.
 * `DocsShell.astro`가 `client:load transition:persist="docs-nav" transition:persist-props`로 렌더링한다.
 * 문서 셸에서 persist되는 island는 이것 하나다.
 *
 * 마크업은 기존 `components/layout/docs-side-navigation{,-items}.tsx`(데스크톱)와 `components/header/mobile-nav-panel.tsx`
 * (모바일)와 같다(SEED `SideNavigation`, `SidePanel`).
 *
 * 불변식
 * - children·slot을 받지 않는다(persist island의 slot은 갱신되지 않는다). props는 JSON이다(O-3, O-4).
 * - 값의 출처는 시점마다 하나다. 첫 hydrate는 props, 첫 이동부터는 `store.ts`의 `navState`(after-swap에 `syncNavState`가
 *   새 body의 `#docs-nav-data`를 넣는다). `persist-props`라 이동 뒤에도 props는 첫 페이지 값으로 남으므로 이동 뒤에는
 *   읽지 않는다. 이 경로가 "기사와 사이드바 강조가 같은 프레임"을 3엔진에서 지킨다(S1-b).
 * - 문서 셸의 모든 페이지에 같은 persist 이름으로 존재한다. 사이드바 없는 페이지에서는 `nav: null`이라 데스크톱 부분을
 *   그리지 않지만 island는 남아 폴더 상태를 이어 간다. 그 페이지를 지나 돌아오면 `#nd-sidebar` 노드와 `scrollTop`은
 *   새로 시작한다(오너 결정 13).
 * - 세션당 `hydrateRoot`는 한 번이다. 이동마다 옮겨진 island의 `start()`가 다시 돌아 `astro:hydrate`가 2번 난다(S1).
 *   그래서 경로에서 파생하는 폴더 갱신은 idempotent하고(`nav-folders.ts`), ref가 아니라 "이전 render 값을 state로" 두는
 *   패턴으로 쓴다.
 * - 폴더 열림 상태의 쓰기는 이 컴포넌트만 한다(`nav-folders.ts` 전이 함수). 데스크톱과 모바일 패널이 같은 맵을 쓴다.
 * - overlay(모바일 SidePanel)는 `#docs-nav-portal`(persist된 요소)에 portal한다. body로 portal하면 swap 때 떨어진 body에
 *   남는다. 패널이 열린 채 이동하면 before-swap의 `resetTransientUi()`가 닫는다.
 * - 사이드바 스크롤 위치: `astro:before-swap`에서 저장하고 `astro:after-swap`(paint 전)에서 엔진 분기 없이 복원한다.
 *   persist 노드를 옮기는 동안 Chromium은 값이 깎이고 WebKit은 0이 되며 Firefox만 유지했다(S1-a).
 * - 링크는 plain `<a>`(SEED `SideNavigation.Item asChild`)다. ClientRouter가 가로챈다. 폴더 trigger로 인덱스에 갈 때만
 *   `navigate()`(`astro:transitions/client`)를 쓴다.
 */
import { IconChevronUpSmallFill } from "@karrotmarket/react-monochrome-icon";
import { ScrollFog, SideNavigation } from "@seed-design/react";
import { navigate } from "astro:transitions/client";
import clsx from "clsx";
import {
  type CSSProperties,
  lazy,
  type RefObject,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { DocsVersionSwitcher } from "../../components/docs-version-switcher";
import { IconSeedArrow } from "../../components/icon-seed-arrow";
import { SidebarFeaturedDot } from "../../components/layout/sidebar-featured-dot";
import {
  isCurrentLink,
  type NavFolder,
  type NavGroup,
  type NavLink,
  type SectionNav,
} from "./nav-model";
import {
  type FolderOpenMap,
  foldersAfterNavigation,
  initialFolders,
  isFolderOpen,
  setFolderOpen,
} from "./nav-folders";
import { closeMobileNav, mobileNavOpen, type NavState, navState, openMobileNav } from "./store";
import { useAtom } from "./use-store";

/** 첫 페이지의 `NavState`와 같은 모양. SSR과 첫 hydrate에만 쓴다. */
export type DocsNavProps = NavState;

type FolderOpenChange = (folder: NavFolder, open: boolean) => void;

const ITEM_HEIGHT = 40;
const LABEL_PADDING_BASE = 2;
const LABEL_PADDING_PER_LEVEL = 6;
const REGULAR_WEIGHT = "var(--seed-font-weight-regular)";

const itemRootStyle: CSSProperties = {
  height: `var(--docs-sidebar-item-height, ${ITEM_HEIGHT}px)`,
  flexShrink: 0,
  borderRadius: 8,
};

// 현재 항목의 배경은 SEED side-navigation-menu-item recipe가 `bg-transparent-selected`로 칠한다. 글자색만 정한다.
function itemRootClass(current: boolean) {
  return clsx(
    "[&::before]:rounded-[8px]",
    current ? "text-fd-foreground" : "text-fd-muted-foreground",
  );
}

function labelClass(current: boolean) {
  return clsx("t4-regular", current ? "text-fd-foreground" : "text-fd-muted-foreground");
}

function labelStyle(level: number): CSSProperties {
  return {
    paddingLeft: LABEL_PADDING_BASE + level * LABEL_PADDING_PER_LEVEL,
    fontWeight: REGULAR_WEIGHT,
  };
}

function NavLinkItem({ link, currentPath }: { link: NavLink; currentPath: string }) {
  const current = isCurrentLink(link, currentPath);
  return (
    <SideNavigation.Item
      asChild
      current={current}
      className={itemRootClass(current)}
      style={itemRootStyle}
    >
      <a
        href={link.href}
        target={link.external ? "_blank" : undefined}
        rel={link.external ? "noopener noreferrer" : undefined}
      >
        <SideNavigation.ItemLabel className={labelClass(current)} style={labelStyle(link.level)}>
          {link.label}
          {link.featured && <SidebarFeaturedDot />}
        </SideNavigation.ItemLabel>
        {link.external && (
          // 접힘 chevron 자리(`ItemSuffixIcon`)는 recipe가 회전시키므로 일반 아이콘으로 둔다.
          <IconSeedArrow external className="size-3.5 text-fd-muted-foreground/80" />
        )}
      </a>
    </SideNavigation.Item>
  );
}

function NavFolderItem({
  folder,
  currentPath,
  open,
  onOpenChange,
}: {
  folder: NavFolder;
  currentPath: string;
  open: boolean;
  onOpenChange: FolderOpenChange;
}) {
  const indexCurrent = folder.index ? isCurrentLink(folder.index, currentPath) : false;
  const inert = !folder.collapsible && !folder.index;

  return (
    <SideNavigation.ItemCollapsibleRoot
      open={open}
      onOpenChange={(next) => onOpenChange(folder, next)}
    >
      <SideNavigation.ItemCollapsibleTrigger
        current={indexCurrent}
        aria-current={indexCurrent ? "page" : undefined}
        aria-disabled={inert ? true : undefined}
        tabIndex={inert ? -1 : undefined}
        className={itemRootClass(indexCurrent)}
        style={itemRootStyle}
      >
        <SideNavigation.ItemLabel className={labelClass(indexCurrent)} style={labelStyle(0)}>
          {folder.label}
          {folder.index?.featured && <SidebarFeaturedDot />}
        </SideNavigation.ItemLabel>
        {folder.collapsible && (
          <SideNavigation.ItemSuffixIcon
            svg={
              <IconChevronUpSmallFill
                className={indexCurrent ? "text-fd-foreground" : "text-fd-muted-foreground/80"}
              />
            }
          />
        )}
      </SideNavigation.ItemCollapsibleTrigger>
      {/* 하위 항목 사이 2px 간격(최상위 항목과 같다). */}
      <SideNavigation.ItemCollapsibleContent className="flex flex-col gap-0.5">
        {folder.items.map((item) => (
          <NavLinkItem key={item.key} link={item} currentPath={currentPath} />
        ))}
      </SideNavigation.ItemCollapsibleContent>
    </SideNavigation.ItemCollapsibleRoot>
  );
}

function NavGroupItem({
  group,
  isFirst,
  currentPath,
  folders,
  onFolderOpenChange,
}: {
  group: NavGroup;
  isFirst: boolean;
  currentPath: string;
  folders: FolderOpenMap;
  onFolderOpenChange: FolderOpenChange;
}) {
  return (
    <SideNavigation.Group className={clsx(!isFirst && "mt-4", "gap-0.5")}>
      {group.divider && <hr className="mx-2 my-1 border-0 border-t border-fd-border" />}
      {group.label && (
        <SideNavigation.GroupLabel
          className="t2-regular px-2.5 pb-1 text-fd-muted-foreground/70"
          style={{ fontWeight: REGULAR_WEIGHT }}
        >
          {group.label}
        </SideNavigation.GroupLabel>
      )}
      {group.items.map((item) =>
        item.kind === "folder" ? (
          <NavFolderItem
            key={item.key}
            folder={item}
            currentPath={currentPath}
            open={isFolderOpen(folders, item)}
            onOpenChange={onFolderOpenChange}
          />
        ) : (
          <NavLinkItem key={item.key} link={item} currentPath={currentPath} />
        ),
      )}
    </SideNavigation.Group>
  );
}

function DesktopSidebar({
  nav,
  currentPath,
  platform,
  folders,
  onFolderOpenChange,
  scrollerRef,
}: {
  nav: SectionNav;
  currentPath: string;
  platform: DocsNavProps["platform"];
  folders: FolderOpenMap;
  onFolderOpenChange: FolderOpenChange;
  scrollerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      data-sidebar-placeholder=""
      className="pointer-events-none sticky top-(--fd-docs-row-2) z-20 h-[calc(var(--fd-docs-height)-var(--fd-docs-row-2))] [grid-area:sidebar] *:pointer-events-auto max-[967px]:hidden"
    >
      <aside
        id="nd-sidebar"
        className="absolute inset-y-0 start-0 flex w-full flex-col items-end text-sm duration-250 *:w-(--fd-sidebar-width)"
      >
        {/* SEED Provider의 ResponsiveCollapseEffect가 1280px 아래에서 접지 않도록 collapsed를 false로 고정한다. */}
        <SideNavigation.Provider collapsed={false}>
          <SideNavigation.Root tone="transparent" className="h-full w-(--fd-sidebar-width) pb-2">
            <ScrollFog
              ref={scrollerRef}
              hideScrollBar
              placement={["top", "bottom"]}
              sizes={{ top: 20, bottom: 32 }}
              className="min-h-0 flex-1"
            >
              <SideNavigation.Content
                className={
                  // recipe의 `__content` 스타일은 layer 밖이라 Tailwind 유틸리티가 이기려면 `!`가 필요하다
                  // (기존 docs-side-navigation.tsx와 같다).
                  "min-h-full [overflow:visible]! px-2! pt-3! pb-20! [--docs-sidebar-item-height:36px] [scrollbar-width:none]! [mask-image:none]! [-webkit-mask-image:none]! min-[1120px]:px-2.5! min-[1120px]:pt-4! min-[1120px]:[--docs-sidebar-item-height:38px] min-[1280px]:px-3! min-[1280px]:pt-5! min-[1280px]:[--docs-sidebar-item-height:40px] [&::-webkit-scrollbar]:hidden [&[data-scrolled]]:shadow-none!"
                }
              >
                {platform && <DocsVersionSwitcher platform={platform} />}
                {nav.groups.map((group, index) => (
                  <NavGroupItem
                    key={group.key}
                    group={group}
                    isFirst={index === 0}
                    currentPath={currentPath}
                    folders={folders}
                    onFolderOpenChange={onFolderOpenChange}
                  />
                ))}
              </SideNavigation.Content>
            </ScrollFog>
          </SideNavigation.Root>
        </SideNavigation.Provider>
      </aside>
    </div>
  );
}

/**
 * 사이드바 스크롤 위치를 swap 앞뒤로 보존한다. 엔진 분기 없이 항상 복원한다(S1-a: Chromium은 깎이고 WebKit은 0).
 * 리스너는 `document`에 둔다. island는 세션 내내 같은 root라 effect는 한 번만 등록된다.
 */
function useSidebarScrollPreservation(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let saved: number | null = null;
    const save = () => {
      saved = ref.current?.isConnected ? ref.current.scrollTop : null;
    };
    const apply = (top: number) => {
      const element = ref.current;
      if (element && element.scrollTop !== top) element.scrollTop = top;
    };
    const restore = () => {
      if (saved === null) return;
      const top = saved;
      saved = null;
      apply(top);
      // 섹션이 바뀌면 목록이 store 갱신의 microtask commit에서 바뀐다. 그 뒤에 한 번 더 맞춘다(같은 task, paint 전).
      queueMicrotask(() => apply(top));
    };
    document.addEventListener("astro:before-swap", save);
    document.addEventListener("astro:after-swap", restore);
    return () => {
      document.removeEventListener("astro:before-swap", save);
      document.removeEventListener("astro:after-swap", restore);
    };
  }, [ref]);
}

const PORTAL_ID = "docs-nav-portal";

// 모바일 패널(SidePanel·Accordion·List)은 처음 열 때 받는다. 데스크톱 첫 로드 JS에 싣지 않는다(가이드 문서 JS 예산).
// 닫힌 패널은 아무것도 그리지 않으므로 서버 HTML·hydrate 결과가 같다.
const MobileNavPanel = lazy(() =>
  import("../../components/header/mobile-nav-panel").then((module) => ({
    default: module.MobileNavPanel,
  })),
);

export function DocsNav(props: DocsNavProps) {
  // 첫 hydrate: props. 첫 이동부터: store(같은 task에서 commit된다).
  const { nav, currentPath, platform } = useAtom(navState, null) ?? props;

  const [folders, setFolders] = useState(() => initialFolders(nav, currentPath));
  // 경로가 바뀌면 그 경로를 새로 포함하게 된 폴더를 연다. 이전 render 값을 state로 두는 패턴(몇 번 불려도 결과가 같다).
  const [prevPath, setPrevPath] = useState(currentPath);
  if (prevPath !== currentPath) {
    setPrevPath(currentPath);
    setFolders((map) => foldersAfterNavigation(map, nav, prevPath, currentPath));
  }

  // 규칙 3: 인덱스 페이지가 있는 폴더의 trigger를 인덱스가 현재가 아닐 때 누르면 열고 인덱스로 이동한다.
  const onFolderOpenChange: FolderOpenChange = (folder, open) => {
    if (folder.index && !isCurrentLink(folder.index, currentPath)) {
      setFolders((map) => setFolderOpen(map, folder, true));
      void navigate(folder.index.href);
      return;
    }
    if (folder.collapsible) setFolders((map) => setFolderOpen(map, folder, open));
  };

  const scrollerRef = useRef<HTMLDivElement>(null);
  useSidebarScrollPreservation(scrollerRef);

  const mobileOpen = useAtom(mobileNavOpen, false);
  // 한 번 연 뒤에는 남겨 둔다(닫힘 애니메이션, 다음 열림).
  const [mobileRequested, setMobileRequested] = useState(false);
  if (mobileOpen && !mobileRequested) setMobileRequested(true);
  const portalRef = useRef<HTMLElement | null>(null);
  if (typeof document !== "undefined" && !portalRef.current) {
    portalRef.current = document.getElementById(PORTAL_ID);
  }

  return (
    <>
      {nav && (
        <DesktopSidebar
          nav={nav}
          currentPath={currentPath}
          platform={platform}
          folders={folders}
          onFolderOpenChange={onFolderOpenChange}
          scrollerRef={scrollerRef}
        />
      )}
      {mobileRequested && (
        <Suspense fallback={null}>
          <MobileNavPanel
            open={mobileOpen}
            onOpenChange={(open) => (open ? openMobileNav() : closeMobileNav())}
            pathname={currentPath}
            section={nav ? { nav, platform, folders, onFolderOpenChange } : undefined}
            portalContainer={portalRef}
          />
        </Suspense>
      )}
    </>
  );
}
