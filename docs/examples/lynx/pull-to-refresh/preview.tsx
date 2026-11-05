import "./styles";

import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "@/components/ui/pull-to-refresh";
import { PARAGRAPH, useRefreshObservation } from "./use-refresh-observation";

export default function Example() {
  const { refreshCount, lastEvent, callbacks } = useRefreshObservation();

  return (
    <view className="ptr-preview">
      <text className="ptr-preview__title">Pull To Refresh</text>
      <text className="ptr-preview__hint">
        최상단에서 아래로 당겨보세요. 짧게 당기면 취소되고, 충분히 당긴 뒤 놓으면 1초 동안
        새로고침합니다.
      </text>
      <text className="ptr-preview__status">
        {`refresh 횟수: ${refreshCount} · 마지막 이벤트: ${lastEvent}`}
      </text>
      <PullToRefreshRoot className="ptr-preview__frame" {...callbacks}>
        <PullToRefreshIndicator />
        <PullToRefreshContent>
          <view className="ptr-preview__body">
            {Array.from({ length: 8 }, (_, index) => (
              <view key={index} className="ptr-preview__item">
                <text className="ptr-preview__paragraph">{`${index + 1}. ${PARAGRAPH}`}</text>
              </view>
            ))}
          </view>
        </PullToRefreshContent>
      </PullToRefreshRoot>
    </view>
  );
}
