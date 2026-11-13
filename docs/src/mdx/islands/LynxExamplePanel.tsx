/**
 * Lynx 예제 island(S3 최소 probe). 미리보기만 그린다(QR은 Phase 3).
 * `components/lynx-example/preview.tsx`를 그대로 쓴다: hydrate 뒤 보이면 `@lynx-js/web-core/client`를 lazy import한다.
 * unmount(ClientRouter 이동)는 Astro `astro:unmount` → React root unmount → `<lynx-view>` 제거로 이어진다.
 */
import { LynxComponentPreview } from "../../../components/lynx-example/preview";

export interface LynxExamplePanelProps {
  webUrl: string;
  example: `lynx/${string}/${string}`;
  height?: number;
  safeAreaInsets?: { left: number; right: number };
}

export function LynxExamplePanel(props: LynxExamplePanelProps) {
  return (
    <LynxComponentPreview
      url={props.webUrl}
      example={props.example}
      height={props.height}
      safeAreaInsets={props.safeAreaInsets}
    />
  );
}
