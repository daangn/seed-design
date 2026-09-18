"use client";

import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import type { LynxExampleName } from "../../lib/lynx-examples/manifest-schema";
import { resolveLynxExampleBundle } from "./resolve-bundle";
import { configuredLynxBundleOrigin, createLynxExampleUrls } from "./urls";

export function LynxComponentQRCode({
  name,
  bundlePath,
}: {
  name: LynxExampleName;
  bundlePath: string;
}) {
  const [browserOrigin, setBrowserOrigin] = useState<string>();
  const [qr, setQr] = useState<{ url: string; data?: string; error?: boolean }>();
  const [retry, setRetry] = useState(0);
  const [resolved, setResolved] = useState<{
    key: string;
    bundlePath?: string;
    updated?: boolean;
    error?: boolean;
  }>();
  const origin =
    configuredLynxBundleOrigin(process.env.NEXT_PUBLIC_LYNX_BUNDLE_ORIGIN) ?? browserOrigin;
  const resolutionKey = `${name}|${bundlePath}|${origin}|${retry}`;
  const result = resolved?.key === resolutionKey ? resolved : undefined;
  const urls = useMemo(() => {
    if (!origin || !result?.bundlePath) return undefined;
    return createLynxExampleUrls(result.bundlePath, origin);
  }, [result?.bundlePath, origin]);
  const [copied, copy] = useCopyButton(() => {
    if (urls) void navigator.clipboard.writeText(urls.native);
  });

  useEffect(() => setBrowserOrigin(window.location.origin), []);

  useEffect(() => {
    if (!origin) return;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    let cancelled = false;
    void resolveLynxExampleBundle(name, bundlePath, origin, controller.signal)
      .then((value) => {
        if (!cancelled) setResolved({ key: resolutionKey, ...value });
      })
      .catch(() => {
        if (!cancelled) setResolved({ key: resolutionKey, error: true });
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [name, bundlePath, origin, resolutionKey]);

  useEffect(() => {
    let cancelled = false;
    if (!urls) return;
    setQr(undefined);
    void QRCode.toDataURL(urls.qr, { width: 240, margin: 1, errorCorrectionLevel: "M" })
      .then((value) => {
        if (!cancelled) setQr({ url: urls.qr, data: value });
      })
      .catch(() => {
        if (!cancelled) setQr({ url: urls.qr, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [urls]);

  if (result?.error)
    return (
      <div
        className="flex flex-col items-center gap-3 p-x5 text-sm text-fd-muted-foreground"
        role="status"
      >
        <p>예제 번들에 접근할 수 없습니다. 네트워크를 확인하거나 문서를 새로고침해 주세요.</p>
        <ActionButton
          variant="neutralWeak"
          size="small"
          onClick={() => setRetry((value) => value + 1)}
        >
          다시 확인
        </ActionButton>
      </div>
    );

  if (!urls)
    return <div className="p-x5 text-sm text-fd-muted-foreground">URL을 준비하는 중입니다.</div>;

  const currentQr = qr?.url === urls.qr ? qr : undefined;

  return (
    <div className="flex flex-col items-center gap-4 p-x8 text-center not-prose">
      {currentQr?.data ? (
        // biome-ignore lint/performance/noImgElement: 브라우저에서 생성한 data URL은 최적화 대상이 아닙니다.
        <img src={currentQr.data} width={120} height={120} alt="Lynx Explorer 실행 QR 코드" />
      ) : currentQr?.error ? (
        <p className="m-0 text-sm text-fd-muted-foreground">QR 코드를 만들지 못했습니다.</p>
      ) : (
        <div className="h-[120px] w-[120px] animate-pulse rounded-r2 bg-fd-muted" />
      )}

      {result?.updated && (
        <p className="m-0 text-sm text-fd-muted-foreground" role="status">
          예제가 업데이트되어 현재 배포된 버전을 엽니다. 코드와 미리보기도 갱신하려면 문서를
          새로고침해 주세요.
        </p>
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
