"use client";

import { TOCItem, type TOCItemType, useTOCSelector } from "fumadocs-core/toc";
import { TOCProvider, TOCScrollArea, useTOCItems } from "fumadocs-ui/components/toc";
import { TOCEmpty } from "fumadocs-ui/components/toc/default";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { twMerge as cn } from "tailwind-merge";
import type { TocTitleSegment } from "@/lib/satteri/rehype-toc-titles";
import { InlineCode, renderInlineCode } from "./inline-code";
import {
  buildTocTrackGeometry,
  getActiveTrackClip,
  getTocTrackOffset,
  type TocTrackGeometry,
  type TocTrackPosition,
} from "./table-of-contents-path";

type TocListOptions = ComponentProps<"div"> & {
  thumbBox?: boolean;
};

interface TocListProps {
  list?: TocListOptions;
  onItemClick?: () => void;
  variant: "desktop" | "popover";
}

interface TocTrackState {
  geometry: TocTrackGeometry;
  positions: TocTrackPosition[];
}

function getItemPadding(depth: number): number {
  if (depth <= 2) return 20;
  if (depth === 3) return 32;
  return 44;
}

function TocTrack({ state }: { state: TocTrackState }) {
  const { geometry, positions } = state;
  const activeRange = useTOCSelector((items) => ({
    startIndex: items.findIndex((item) => item.active),
    endIndex: items.findLastIndex((item) => item.active),
  }));
  const activeClip = getActiveTrackClip(positions, activeRange.startIndex, activeRange.endIndex);
  const clipPath = activeClip
    ? `inset(${activeClip.top}px 0 ${geometry.height - activeClip.bottom}px 0)`
    : "inset(0 0 100% 0)";
  return (
    <>
      <svg
        aria-hidden="true"
        focusable="false"
        height={geometry.height}
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        width={geometry.width}
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute start-0 top-0 overflow-visible"
      >
        <path
          d={geometry.path}
          className="stroke-fd-foreground/10"
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      <svg
        aria-hidden="true"
        focusable="false"
        height={geometry.height}
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        width={geometry.width}
        xmlns="http://www.w3.org/2000/svg"
        className="pointer-events-none absolute start-0 top-0 overflow-visible transition-[clip-path,opacity] motion-reduce:transition-none"
        style={{ clipPath, opacity: activeClip ? 1 : 0 }}
      >
        <path
          d={geometry.path}
          className="stroke-fd-primary"
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </>
  );
}

function TocList({ list, onItemClick, variant }: TocListProps) {
  const items = useTOCItems();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const anchorRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [trackState, setTrackState] = useState<TocTrackState | null>(null);
  const {
    children: _children,
    className,
    ref: listRef,
    thumbBox: _thumbBox,
    ...listProps
  } = list ?? {};

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container || container.clientHeight === 0 || items.length === 0) {
      setTrackState(null);
      return;
    }

    const positions: TocTrackPosition[] = [];
    for (let index = 0; index < items.length; index += 1) {
      const anchor = anchorRefs.current[index];
      const item = items[index];
      if (!anchor || !item) {
        setTrackState(null);
        return;
      }

      const styles = getComputedStyle(anchor);
      const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
      const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
      positions.push({
        top: anchor.offsetTop + paddingTop,
        bottom: anchor.offsetTop + anchor.clientHeight - paddingBottom,
        x: getTocTrackOffset(item.depth),
      });
    }

    const geometry = buildTocTrackGeometry(positions);
    setTrackState(geometry ? { geometry, positions } : null);
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    for (const anchor of anchorRefs.current) {
      if (anchor) observer.observe(anchor);
    }
    measure();

    return () => observer.disconnect();
  }, [measure]);

  return (
    <div
      {...listProps}
      ref={(element) => {
        containerRef.current = element;
        if (typeof listRef === "function") listRef(element);
        else if (listRef) listRef.current = element;
      }}
      className={cn("relative flex flex-col", className)}
    >
      {trackState ? <TocTrack state={trackState} /> : null}
      {items.length === 0 ? <TOCEmpty /> : null}
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        const trackOffset = getTocTrackOffset(item.depth);

        return (
          <TOCItem
            key={item.url}
            ref={(element) => {
              anchorRefs.current[index] = element;
            }}
            href={item.url}
            onClick={onItemClick}
            className={cn(
              "prose relative py-1.5 scroll-m-4 text-fd-muted-foreground transition-colors wrap-anywhere data-[active=true]:text-fd-primary hover:text-fd-accent-foreground",
              variant === "desktop" ? "text-xs leading-5" : "text-sm leading-5",
              isFirst && "pt-0",
              isLast && "pb-0",
            )}
            style={{ paddingInlineStart: getItemPadding(item.depth) }}
          >
            {item._step !== undefined ? (
              <span
                className="pointer-events-none absolute flex size-4 -translate-1/2 items-center justify-center rounded-full bg-fd-muted font-mono text-xs font-medium leading-none text-fd-muted-foreground"
                style={{
                  insetInlineStart: trackOffset,
                  top: `calc(50% + ${(isFirst ? -0.75 : 0) + (isLast ? 0.75 : 0)} * var(--spacing))`,
                }}
              >
                {item._step}
              </span>
            ) : null}
            {renderInlineCode(item.title)}
          </TOCItem>
        );
      })}
    </div>
  );
}

/** `rehypeTocTitles`가 조각 배열로 내보낸 제목(inline code 포함)을 React 노드로 되돌린다. */
function renderTocTitle(title: ReactNode | TocTitleSegment[]): ReactNode {
  if (!Array.isArray(title)) return title;

  return title.map((segment, index) =>
    // biome-ignore lint/suspicious/noArrayIndexKey: 조각은 순서가 바뀌지 않는다.
    typeof segment === "string" ? segment : <InlineCode key={index}>{segment.code}</InlineCode>,
  );
}

/**
 * 데스크톱 목차 island. `#nd-toc` 열은 `src/components/DocsPage.astro`가 정적으로 그리고, 여기서는
 * 목록과 현재 위치 표시(scroll spy)만 맡는다. 항목이 없는 문서에서는 island를 두지 않는다.
 */
export function DocsTableOfContents({ toc }: { toc: TOCItemType[] }) {
  const items = useMemo(
    () => toc.map((item) => ({ ...item, title: renderTocTitle(item.title) })),
    [toc],
  );

  return (
    <TOCProvider toc={items}>
      <h3 id="toc-title" className="text-xs font-light leading-4 text-fd-muted-foreground">
        목차
      </h3>
      <TOCScrollArea>
        <TocList variant="desktop" />
      </TOCScrollArea>
    </TOCProvider>
  );
}
