"use client";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import { clsx } from "cn";
import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import type { FooterProps } from "fumadocs-ui/layouts/docs/page/slots/footer";
import { useFooterItems } from "fumadocs-ui/utils/use-footer-items";
import { useMemo } from "react";

// prev/next 두 카드가 공유하는 베이스. 배경/hover를 side navigation 메뉴 항목의
// active(bg-transparent-selected) / active-hover(bg-transparent-selected-pressed) 색과
// 동일하게 맞춘다. transparent 토큰은 테마 인식형이라 dark: 변형이 필요 없고,
// SEED color-transition 토큰(duration-color-transition) 타이밍에 맞춰 전환된다.
const CARD =
  "flex min-h-[52px] flex-col justify-center gap-x2 rounded-r3 bg-bg-transparent-selected px-x5 py-x3_5 " +
  "text-fg-neutral transition-colors duration-color-transition hover:bg-bg-transparent-selected-pressed";

/**
 * 상세 문서 하단 이전/다음 네비게이션. Fumadocs 기본 Footer 슬롯을 대체한다.
 * prev/next 도출은 기본 구현과 동일(공개 훅 useFooterItems + 현재 pathname).
 * 한쪽만 있어도 이전=왼쪽 / 다음=오른쪽 자리를 고정한다(col-start).
 */
export function DocsPrevNext({ items, className, ...props }: FooterProps) {
  const footerList = useFooterItems();
  const pathname = usePathname();
  const { previous, next } = useMemo(() => {
    if (items) return items;
    const norm = (url: string) => url.replace(/\/$/, "");
    const idx = footerList.findIndex((item) => norm(item.url) === norm(pathname));
    if (idx === -1) return {};
    return { previous: footerList[idx - 1], next: footerList[idx + 1] };
  }, [footerList, items, pathname]);

  if (!previous && !next) return null;

  return (
    <div className={clsx("mt-x16 grid grid-cols-2 gap-x6", className)} {...props}>
      {previous && (
        <Link href={previous.url} className={clsx(CARD, "col-start-1")}>
          <span className="t4-regular inline-flex items-center gap-x2">
            <IconSeedArrow className="size-x3_5 rotate-180" />
            이전 문서
          </span>
          <span className="t5-medium truncate">{previous.name}</span>
        </Link>
      )}
      {next && (
        <Link href={next.url} className={clsx(CARD, "col-start-2 items-end text-end")}>
          <span className="t4-regular inline-flex items-center gap-x2">
            다음 문서
            <IconSeedArrow className="size-x3_5" />
          </span>
          <span className="t5-medium w-full truncate text-end">{next.name}</span>
        </Link>
      )}
    </div>
  );
}
