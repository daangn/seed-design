"use client";

import { TOCItem, useTOCSelector } from "fumadocs-core/toc";
import { TOCScrollArea, useTOCItems } from "fumadocs-ui/components/toc";
import { TOCEmpty } from "fumadocs-ui/components/toc/default";
import type { TOCProps } from "fumadocs-ui/layouts/notebook/page/slots/toc";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { twMerge as cn } from "cn";
import { renderInlineCode } from "./inline-code";
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

export function SeedTableOfContents({ container, header, footer, list }: TOCProps): ReactNode {
  // 항목이 없어도(헤딩 없는 페이지) 이 컨테이너는 렌더해 우측 열 폭(--fd-toc-width)을 예약한다
  // → 콘텐츠 가로 위치가 페이지마다 흔들리지 않는다. 대신 항목이 없으면 안쪽 UI는 비워둔다.
  const items = useTOCItems();
  return (
    <div
      {...container}
      id="nd-toc"
      className={cn(
        "sticky top-(--fd-docs-row-3) [grid-area:toc] h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))] flex flex-col w-(--fd-toc-width) pt-12 pe-4 pb-2 xl:layout:[--fd-toc-width:200px] max-xl:hidden",
        container?.className,
      )}
    >
      {items.length > 0 ? (
        <>
          {header}
          <h3 id="toc-title" className="text-xs font-light leading-4 text-fd-muted-foreground">
            목차
          </h3>
          <TOCScrollArea>
            <TocList list={list} variant="desktop" />
          </TOCScrollArea>
          {footer}
        </>
      ) : null}
    </div>
  );
}

/**
 * 빈 popover 슬롯. <1280(모바일·태블릿)에선 상단 메뉴형 ToC를 전 페이지 공통으로 노출하지 않으므로
 * popover를 렌더하지 않는다(데스크탑 xl+ 우측 레일 SeedTableOfContents만 유지). "use client" 모듈에
 * 둬야 서버 컴포넌트(DocsPageRenderer)에서 슬롯으로 전달 가능(함수는 client reference여야 직렬화됨).
 */
export function HiddenTocPopover(): ReactNode {
  return null;
}
