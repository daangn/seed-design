"use client";

import { useEffect, useState } from "react";
import { Banner } from "fumadocs-ui/components/banner";

export function LatestVersionBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(
      window.location.hostname !== "seed-design.pages.dev" &&
        window.location.hostname.endsWith("pages.dev"),
    );
  }, []);

  if (!show) return null;

  return (
    <Banner id="latest-version">
      프리뷰 또는 이전 버전의 문서를 보고 있습니다.{" "}
      <a href="https://seed-design.io" className="font-medium underline">
        seed-design.io 방문 →
      </a>
    </Banner>
  );
}
