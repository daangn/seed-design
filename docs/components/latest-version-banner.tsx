"use client";

import { useEffect, useState } from "react";
import { Banner } from "fumadocs-ui/components/banner";

export function LatestVersionBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window.location.hostname.includes("pages.dev"));
  }, []);

  if (!show) return null;

  return (
    <Banner id="latest-version">
      더 최신 버전의 문서가 있습니다.{" "}
      <a href="https://seed-design.io" className="font-medium underline">
        최신 버전 보기 →
      </a>
    </Banner>
  );
}
