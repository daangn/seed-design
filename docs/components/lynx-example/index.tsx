import { SafeAreaPreviewLegend } from "../safe-area-preview";
import { SeedTab as Tab, SeedTabs as Tabs } from "@/components/tabs/seed-tabs";
import type { LynxExampleName } from "@/lib/lynx-examples/manifest-schema";
import type { ReactNode } from "react";
import ErrorBoundary from "../error-boundary";
import { LynxComponentPreview } from "./preview";
import { LynxComponentQRCode } from "./qr-code";
import type { PreviewSafeAreaInsets } from "./preview-lifecycle";

export interface LynxComponentExampleProps {
  name: LynxExampleName;
  height?: number;
  safeAreaInsets?: PreviewSafeAreaInsets;
  /** manifest에서 읽은 Web preview 번들 URL. */
  webUrl: string;
  /** manifest에서 읽은 Lynx 번들 경로. QR 코드가 가리킨다. */
  bundlePath: string;
  children: ReactNode;
}

/**
 * Lynx 예제의 미리보기·QR·코드 탭. manifest 조회와 props 검증은
 * `src/components/mdx/LynxComponentExample.astro`가 빌드 시점에 한다.
 */
export function LynxComponentExample({
  name,
  height,
  safeAreaInsets,
  webUrl,
  bundlePath,
  children,
}: LynxComponentExampleProps) {
  return (
    <ErrorBoundary>
      <Tabs card className="!overflow-hidden" items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          {safeAreaInsets && <SafeAreaPreviewLegend {...safeAreaInsets} />}
          {/* 카드 폭 기준으로 배치한다. 좁으면 QR 패널이 미리보기 아래로 내려간다. */}
          <div className="@container">
            <div className="flex flex-col @xl:flex-row">
              <div className="min-w-0 flex-1">
                <LynxComponentPreview
                  url={webUrl}
                  example={name}
                  height={height}
                  safeAreaInsets={safeAreaInsets}
                />
              </div>
              <aside
                aria-label="Lynx Explorer에서 열기"
                className="flex shrink-0 flex-col items-center justify-center border-0 border-t border-solid border-stroke-neutral-muted @xl:w-[220px] @xl:border-t-0 @xl:border-l"
              >
                <LynxComponentQRCode name={name} bundlePath={bundlePath} />
              </aside>
            </div>
          </div>
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
