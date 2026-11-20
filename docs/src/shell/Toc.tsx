/**
 * 문서 목차(데스크톱 오른쪽 레일) island. `DocsArticle.astro`가 `client:idle`로 렌더링한다. 서버 HTML로 먼저 보이고
 * hydrate 뒤에 scroll-spy(`fumadocs-core/toc`의 `AnchorProvider`·`TOCItem`)와 활성 구간 트랙이 붙는다.
 *
 * 마크업은 기존 `components/table-of-contents.tsx`의 `SeedTableOfContents`와 같다(그 파일은 fumadocs-ui TOC context·
 * scroll area를 읽었다). 항목이 없어도 컨테이너는 그려 오른쪽 열 폭을 예약한다.
 */
import { AnchorProvider, ScrollProvider, TOCItem, useTOCSelector } from "fumadocs-core/toc";
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cn from "clsx";
import { InlineCode } from "../../components/inline-code";
import {
  buildTocTrackGeometry,
  getActiveTrackClip,
  getTocTrackOffset,
  type TocTrackGeometry,
  type TocTrackPosition,
} from "../../components/table-of-contents-path";
import type { TocEntry, TocTitle } from "../content/source";

interface TocTrackState {
  geometry: TocTrackGeometry;
  positions: TocTrackPosition[];
}

function itemPadding(depth: number): number {
  if (depth <= 2) return 20;
  if (depth === 3) return 32;
  return 44;
}

function renderTitle(title: TocTitle): ReactNode {
  if (typeof title === "string") return title;
  return title.map((segment, index) =>
    // oxlint-disable-next-line react/no-array-index-key -- 조각 순서는 바뀌지 않는다.
    typeof segment === "string" ? segment : <InlineCode key={index}>{segment.code}</InlineCode>,
  );
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

function TocList({ items }: { items: TocEntry[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const anchorRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [trackState, setTrackState] = useState<TocTrackState | null>(null);

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
    for (const anchor of anchorRefs.current) if (anchor) observer.observe(anchor);
    measure();
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className="relative flex flex-col">
      {trackState ? <TocTrack state={trackState} /> : null}
      {items.map((item, index) => (
        <TOCItem
          key={item.url}
          ref={(element) => {
            anchorRefs.current[index] = element;
          }}
          href={item.url}
          className={cn(
            "prose relative py-1.5 scroll-m-4 text-fd-muted-foreground transition-colors wrap-anywhere data-[active=true]:text-fd-primary hover:text-fd-accent-foreground text-xs leading-5",
            index === 0 && "pt-0",
            index === items.length - 1 && "pb-0",
          )}
          style={{ paddingInlineStart: itemPadding(item.depth) }}
        >
          {renderTitle(item.title)}
        </TOCItem>
      ))}
    </div>
  );
}

export function Toc({ items }: { items: TocEntry[] }) {
  const viewRef = useRef<HTMLDivElement>(null);
  // `AnchorProvider`는 `url`(헤딩 id)과 `depth`만 읽는다.
  const toc = useMemo(
    () => items.map((item) => ({ url: item.url, depth: item.depth, title: item.url })),
    [items],
  );
  return (
    <div
      id="nd-toc"
      className="sticky top-(--fd-docs-row-3) [grid-area:toc] h-[calc(var(--fd-docs-height)-var(--fd-docs-row-3))] flex flex-col w-(--fd-toc-width) pt-12 pe-4 pb-2 max-xl:hidden"
    >
      {items.length > 0 ? (
        <AnchorProvider toc={toc}>
          <h3 id="toc-title" className="text-xs font-light leading-4 text-fd-muted-foreground">
            목차
          </h3>
          <div
            ref={viewRef}
            className="relative min-h-0 text-sm ms-px overflow-auto overscroll-contain [scrollbar-width:none] mask-[linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] py-3"
          >
            <ScrollProvider containerRef={viewRef}>
              <TocList items={items} />
            </ScrollProvider>
          </div>
        </AnchorProvider>
      ) : null}
    </div>
  );
}
