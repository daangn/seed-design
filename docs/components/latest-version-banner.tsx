"use client";

import { archivePaths } from "@/lib/docs-archive";

import { useLayoutEffect, useState } from "react";
import { Banner } from "fumadocs-ui/components/banner";
import { IconSeedArrow } from "@/components/icon-seed-arrow";

const BANNER_HEIGHT = "3rem";
// 배너를 띄울 문서임을 `<html>`에 알리는 표시. `Layout.astro`의 `<head>`에서 아래 script가 붙인다.
const MARK = "data-latest-version-banner";
// fumadocs `Banner`가 닫힘을 저장하는 key(`nd-banner-${encodeBase32(id)}`, id = "latest-version").
// fumadocs가 이 함수를 내보내지 않아 값을 그대로 둔다. `id`를 바꾸면 이 값도 바꾼다.
const DISMISSED_KEY = "nd-banner-nrqxizltoqwxmzlsonuw63q";

// 배너를 띄울지는 이 script 한 곳에서 정한다. 배너는 `client:only` island라 JS가 받아진 뒤에야 그려지므로,
// 첫 paint 전에 같은 조건을 판단해 자리를 비워 두지 않으면 배너가 나타날 때 문서 전체가 3rem 밀린다.
// 같은 도메인에서 제공하는 아카이브(빌드 시 정해진다)와 프리뷰 배포 host에서 띄우고, 닫았으면 띄우지 않는다.
export const latestVersionBannerScript = `(() => {
  const host = location.hostname;
  const show = ${JSON.stringify(!!archivePaths.prefix)} ||
    (host !== "seed-design.io" && host !== "v3.seed-design.io" && host !== "localhost" && host !== "127.0.0.1");
  if (!show) return;
  try {
    if (localStorage.getItem(${JSON.stringify(DISMISSED_KEY)}) === "true") return;
  } catch {}
  document.documentElement.setAttribute(${JSON.stringify(MARK)}, "");
})();`;

// 표시가 있는 동안 배너와 같은 자리·높이를 비워 두고, fumadocs layout이 sticky 위치와 사이드바 높이에 쓰는
// `--fd-banner-height`도 미리 맞춘다. 배너가 그려지면 같은 commit에서 표시를 지워 넘겨준다.
export const latestVersionBannerStyle = `html[${MARK}] { --fd-banner-height: ${BANNER_HEIGHT}; }
html[${MARK}] body::before {
  content: "";
  display: block;
  position: sticky;
  top: 0;
  z-index: 40;
  height: ${BANNER_HEIGHT};
  background: var(--color-fd-secondary);
}`;

export function LatestVersionBanner() {
  // `client:only`라 서버 render가 없어 첫 render에서 DOM을 읽어도 된다. effect에서 정하면 한 프레임 늦다.
  const [show] = useState(() => document.documentElement.hasAttribute(MARK));

  // 배너가 DOM에 들어간 같은 commit, paint 전에 비워 둔 자리를 거둔다. 이후 닫으면 아무 자리도 남지 않는다.
  useLayoutEffect(() => {
    document.documentElement.removeAttribute(MARK);
  }, []);

  if (!show) return null;

  return (
    <Banner id="latest-version" height={BANNER_HEIGHT}>
      프리뷰 또는 이전 버전의 문서를 보고 있습니다.
      <a
        href={
          archivePaths.prefix
            ? `https://seed-design.io/${archivePaths.platform}`
            : "https://seed-design.io"
        }
        className="ml-1 font-medium underline flex gap-0.5 items-center"
      >
        seed-design.io 방문 <IconSeedArrow className="size-3.5" />
      </a>
    </Banner>
  );
}
