"use client";

import { IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import {
  isSiteAnnouncementBannerActive,
  SITE_ANNOUNCEMENT_BANNER,
  type SiteAnnouncementBannerConfig,
} from "./site-announcement-banner-config";

const DISMISSAL_KEY_PREFIX = "seed-site-announcement-dismissed:";
const ACTIVE_DATE_CHECK_INTERVAL = 60_000;

function getDismissalKey(id: string) {
  return `${DISMISSAL_KEY_PREFIX}${id}`;
}

export function SiteAnnouncementBanner({
  config = SITE_ANNOUNCEMENT_BANNER,
}: {
  config?: SiteAnnouncementBannerConfig;
}) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissalKey = getDismissalKey(config.id);
    const updateVisibility = () => {
      setVisible(
        isSiteAnnouncementBannerActive(config) &&
          window.localStorage.getItem(dismissalKey) !== "true",
      );
    };

    updateVisibility();
    const interval = window.setInterval(updateVisibility, ACTIVE_DATE_CHECK_INTERVAL);

    return () => window.clearInterval(interval);
  }, [config]);

  useEffect(() => {
    if (!visible || !bannerRef.current) return;

    const root = document.documentElement;
    const previousScrollPaddingBottom = root.style.scrollPaddingBottom;
    const updateScrollPadding = () => {
      const bannerHeight = bannerRef.current?.getBoundingClientRect().height ?? 0;
      root.style.scrollPaddingBottom = `${bannerHeight + 48}px`;
    };

    updateScrollPadding();
    const observer = new ResizeObserver(updateScrollPadding);
    observer.observe(bannerRef.current);

    return () => {
      observer.disconnect();
      if (previousScrollPaddingBottom) {
        root.style.scrollPaddingBottom = previousScrollPaddingBottom;
      } else {
        root.style.removeProperty("scroll-padding-bottom");
      }
    };
  }, [visible]);

  if (!visible) return null;

  const handleDismiss = () => {
    window.localStorage.setItem(getDismissalKey(config.id), "true");
    setVisible(false);
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-[900] md:inset-x-7 md:bottom-[calc(24px+env(safe-area-inset-bottom))]"
      role="region"
      aria-label="사이트 새 소식"
    >
      <div
        ref={bannerRef}
        className="pointer-events-auto flex min-h-12 w-full items-stretch overflow-hidden bg-[#1a1c20]"
      >
        <Link
          href={config.href}
          className="flex min-w-0 flex-1 items-center gap-1 px-5 py-3 text-sm font-semibold text-[#d6fead] transition-colors duration-color-transition hover:bg-[#202329] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-stroke-focus-ring motion-reduce:transition-none md:text-base"
        >
          <span className="line-clamp-2">{config.message}</span>
          <IconSeedArrow className="size-4 flex-none" />
        </Link>
        <button
          type="button"
          aria-label="새 소식 배너 닫기"
          onClick={handleDismiss}
          className="flex size-12 flex-none items-center justify-center self-center text-[#d6fead] transition-[background-color,transform] duration-color-transition hover:bg-[#202329] active:[transform:scale(0.96)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-stroke-focus-ring motion-reduce:transition-none"
        >
          <IconXmarkLine className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
