/**
 * Lynx 예제 island. `LynxComponentExample.astro`만 렌더링한다(`client:visible`, rootMargin 200px).
 * 미리보기와 QR 패널을 함께 그린다. 배치는 기존 `components/lynx-example/index.tsx`와 같다(카드 폭이 좁으면 QR이 아래로).
 *
 * - 미리보기(`LynxComponentPreview`): hydrate 뒤 보이면 `@lynx-js/web-core/client`를 lazy import한다. ClientRouter 이동의
 *   unmount는 Astro `astro:unmount` → React root unmount → `<lynx-view>` 제거(`disconnectedCallback`이 view와 worker를
 *   정리한다)로 이어진다.
 * - QR(`LynxComponentQRCode`): bundle URL이 브라우저 origin에 달려 있어 빌드 때 만들 수 없다.
 */
import { LynxComponentPreview } from "../../../components/lynx-example/preview";
import type { PreviewSafeAreaInsets } from "../../../components/lynx-example/preview-lifecycle";
import { LynxComponentQRCode } from "../../../components/lynx-example/qr-code";
import type { LynxExampleName } from "../../../lib/lynx-examples/manifest-schema";

export interface LynxExamplePanelProps {
  example: LynxExampleName;
  webUrl: string;
  bundlePath: string;
  height?: number;
  safeAreaInsets?: PreviewSafeAreaInsets;
}

export function LynxExamplePanel(props: LynxExamplePanelProps) {
  return (
    <div className="@container">
      <div className="flex flex-col @xl:flex-row">
        <div className="min-w-0 flex-1">
          <LynxComponentPreview
            url={props.webUrl}
            example={props.example}
            height={props.height}
            safeAreaInsets={props.safeAreaInsets}
          />
        </div>
        <aside
          aria-label="Lynx Explorer에서 열기"
          className="flex shrink-0 flex-col items-center justify-center border-0 border-t border-solid border-stroke-neutral-muted @xl:w-[220px] @xl:border-t-0 @xl:border-l"
        >
          <LynxComponentQRCode name={props.example} bundlePath={props.bundlePath} />
        </aside>
      </div>
    </div>
  );
}
