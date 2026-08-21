"use client";

import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
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
    void QRCode.toDataURL(urls.qr, { width: 240, margin: 1, errorCorrectionLevel: "M" })
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
    <div className="flex flex-col items-center gap-4 p-x8 text-center not-prose">
      {qrDataUrl && !qrError ? (
        // biome-ignore lint/performance/noImgElement: 브라우저에서 생성한 data URL은 최적화 대상이 아닙니다.
        <img src={qrDataUrl} width={120} height={120} alt="Lynx Explorer 실행 QR 코드" />
      ) : qrError ? (
        <p className="m-0 text-sm text-fd-muted-foreground">QR 코드를 만들지 못했습니다.</p>
      ) : (
        <div className="h-[120px] w-[120px] animate-pulse rounded-r2 bg-fd-muted" />
      )}

      <div className="flex flex-col justify-center items-center gap-2">
        <ActionButton asChild variant="neutralSolid" size="small">
          <a href={urls.explorer}>Open In Lynx Explorer</a>
        </ActionButton>
        <ActionButton type="button" onClick={copy} variant="neutralWeak" size="small">
          {copied ? "Copied!" : "Copy To Clipboard"}
        </ActionButton>
      </div>
    </div>
  );
}
