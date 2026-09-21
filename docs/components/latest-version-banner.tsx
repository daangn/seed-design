"use client";

import { useEffect, useState } from "react";
import { Banner } from "fumadocs-ui/components/banner";
import { IconSeedArrow } from "@/components/icon-seed-arrow";

export function LatestVersionBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    // 최신 문서의 두 도메인과 로컬 개발에서는 숨기고, 이전 버전·프리뷰에서 안내한다.
    setShow(
      host !== "seed-design.io" &&
        host !== "v3.seed-design.io" &&
        host !== "localhost" &&
        host !== "127.0.0.1",
    );
  }, []);

  if (!show) return null;

  return (
    <Banner id="latest-version">
      프리뷰 또는 이전 버전의 문서를 보고 있습니다.
      <a
        href="https://seed-design.io"
        className="ml-1 font-medium underline flex gap-0.5 items-center"
      >
        seed-design.io 방문 <IconSeedArrow className="size-3.5" />
      </a>
    </Banner>
  );
}
