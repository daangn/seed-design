"use client";

import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { configuredLynxBundleOrigin, createLynxExampleUrls } from "./urls";

export function LynxComponentQRCode({ bundlePath }: { bundlePath: string }) {
  const [browserOrigin, setBrowserOrigin] = useState<string>();
  const [qrDataUrl, setQrDataUrl] = useState<string>();
  const [qrError, setQrError] = useState(false);
  const origin =
    configuredLynxBundleOrigin(process.env.NEXT_PUBLIC_LYNX_BUNDLE_ORIGIN) ?? browserOrigin;
  const urls = useMemo(() => {
    if (!origin) return undefined;
    return createLynxExampleUrls(bundlePath, origin);
  }, [bundlePath, origin]);
  const [copied, copy] = useCopyButton(() => {
    if (urls) void navigator.clipboard.writeText(urls.native);
  });

  useEffect(() => setBrowserOrigin(window.location.origin), []);

  useEffect(() => {
    let cancelled = false;
    if (!urls) return;
    setQrError(false);
    void QRCode.toDataURL(urls.explorer, { width: 240, margin: 1, errorCorrectionLevel: "M" })
      .then((value) => {
        if (!cancelled) setQrDataUrl(value);
      })
      .catch(() => {
        if (!cancelled) setQrError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [urls]);

  if (!urls)
    return <div className="p-x5 text-sm text-fd-muted-foreground">URL을 준비하는 중입니다.</div>;

  return (
    <div className="flex flex-col items-center gap-4 p-x5 text-center">
      {qrDataUrl && !qrError ? (
        // biome-ignore lint/performance/noImgElement: 브라우저에서 생성한 data URL은 최적화 대상이 아닙니다.
        <img src={qrDataUrl} width={240} height={240} alt="Lynx Explorer 실행 QR 코드" />
      ) : qrError ? (
        <p className="m-0 text-sm text-fd-muted-foreground">QR 코드를 만들지 못했습니다.</p>
      ) : (
        <div className="h-[240px] w-[240px] animate-pulse rounded-r2 bg-fd-muted" />
      )}
      {urls.loopback ? (
        <p className="m-0 max-w-lg text-sm text-fd-muted-foreground">
          현재 주소는 휴대폰에서 접근할 수 없습니다. LAN 주소나 배포 주소로 문서를 열어 주세요.
        </p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={urls.explorer}
          className="rounded-r2 bg-bg-brand-solid px-x3 py-x2 text-sm text-fg-brand-contrast"
        >
          Lynx Explorer에서 열기
        </a>
        <button
          type="button"
          onClick={copy}
          className="rounded-r2 border border-solid border-stroke-neutral-muted px-x3 py-x2 text-sm"
        >
          {copied ? "복사됨" : "Bundle URL 복사"}
        </button>
      </div>
      <code className="max-w-full break-all text-xs text-fd-muted-foreground">{urls.native}</code>
    </div>
  );
}
