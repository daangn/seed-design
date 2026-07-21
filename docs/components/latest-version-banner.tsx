"use client";

import { useEffect, useState } from "react";
import { Banner } from "fumadocs-ui/components/banner";
import { IconSeedArrow } from "@/components/icon-seed-arrow";

export function LatestVersionBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const host = window.location.hostname;
    // latest(루트)가 아닌 모든 곳(버전 서브도메인·프리뷰·alpha)에서 안내 배너 노출. dev·프리뷰는 숨김.
    setShow(host !== "seed-design.io" && host !== "localhost" && host !== "127.0.0.1");
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
