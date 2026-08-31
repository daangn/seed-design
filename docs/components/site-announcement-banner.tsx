"use client";

import { IconXmarkLine } from "@karrotmarket/react-monochrome-icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconSeedArrow } from "@/components/icon-seed-arrow";
import {
  isSiteAnnouncementBannerActive,
  SITE_ANNOUNCEMENT_BANNER,
  type SiteAnnouncementBannerConfig,
} from "./site-announcement-banner-config";

const DISMISSAL_KEY_PREFIX = "seed-site-announcement-dismissed:";

function getDismissalKey(id: string) {
  return `${DISMISSAL_KEY_PREFIX}${id}`;
}

function isDismissed(id: string) {
  try {
    return window.localStorage.getItem(getDismissalKey(id)) === "true";
  } catch {
    return false;
  }
}

export function SiteAnnouncementBanner({
  config = SITE_ANNOUNCEMENT_BANNER,
}: {
  config?: SiteAnnouncementBannerConfig;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(isSiteAnnouncementBannerActive(config) && !isDismissed(config.id));
  }, [config]);

  if (!visible) return null;

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(getDismissalKey(config.id), "true");
    } catch {
      // Keep the banner dismissed for this page even when persistence is unavailable.
    }
    setVisible(false);
  };

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[900]"
      role="region"
      aria-label="사이트 새 소식"
    >
      <div className="pointer-events-auto flex min-h-12 w-full items-stretch overflow-hidden bg-[#1a1c20] pb-[env(safe-area-inset-bottom)]">
        <Link
          href={config.href}
          onClick={handleDismiss}
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
