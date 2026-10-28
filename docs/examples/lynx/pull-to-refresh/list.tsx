import "./styles";

import {
  PullToRefreshIndicator,
  PullToRefreshListContent,
  PullToRefreshRoot,
} from "@/components/ui/pull-to-refresh";
import { useRefreshObservation } from "./use-refresh-observation";

const ITEMS = Array.from({ length: 30 }, (_, index) => `item-${index + 1}`);

export default function Example() {
  const { refreshCount, lastEvent, callbacks } = useRefreshObservation();

  return (
    <view className="ptr-preview">
      <text className="ptr-preview__title">List</text>
      <text className="ptr-preview__status">
        {`refresh 횟수: ${refreshCount} · 마지막 이벤트: ${lastEvent}`}
      </text>
      <PullToRefreshRoot className="ptr-preview__frame" {...callbacks}>
        <PullToRefreshIndicator />
        <PullToRefreshListContent>
          {ITEMS.map((item, index) => (
            <list-item key={item} item-key={item} className="ptr-preview__list-item">
              <view className="ptr-preview__item">
                <text className="ptr-preview__paragraph">
                  {`${index + 1}번 항목 · refresh ${refreshCount}회`}
                </text>
              </view>
            </list-item>
          ))}
        </PullToRefreshListContent>
      </PullToRefreshRoot>
    </view>
  );
}
