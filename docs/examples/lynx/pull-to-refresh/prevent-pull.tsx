import "./styles";

import { usePullToRefreshPreventPull, useSeedClassName } from "@seed-design/lynx-react";
import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "@/components/ui/pull-to-refresh";
import { useRefreshObservation } from "./use-refresh-observation";

function ProtectedRegion() {
  const preventPullProps = usePullToRefreshPreventPull();

  return (
    <view className="ptr-preview__protected" {...preventPullProps}>
      <text className="ptr-preview__paragraph">
        이 영역은 당겨서 새로고침이 불가능합니다. Aliquip ad amet eu dolore id enim excepteur
        laboris officia anim in. Irure irure nulla sit eiusmod aliqua sint excepteur amet laboris.
      </text>
    </view>
  );
}

function PullableRegion() {
  return (
    <view className="ptr-preview__item">
      <text className="ptr-preview__paragraph">
        이 영역은 당겨서 새로고침이 가능합니다. Amet in laborum proident fugiat mollit quis aute
        mollit esse nostrud. Excepteur ea proident ipsum duis. Nulla Lorem pariatur exercitation
        velit anim.
      </text>
    </view>
  );
}

export default function Example() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  const { refreshCount, lastEvent, callbacks } = useRefreshObservation();

  return (
    <view className={`${seedClassName} docs-lynx-ptr-root`}>
      <text className="ptr-preview__title">Prevent Pull</text>
      <text className="ptr-preview__status">
        {`refresh 횟수: ${refreshCount} · 마지막 이벤트: ${lastEvent}`}
      </text>
      <PullToRefreshRoot className="ptr-preview__frame" {...callbacks}>
        <PullToRefreshIndicator />
        <PullToRefreshContent>
          <view className="ptr-preview__body">
            <PullableRegion />
            <ProtectedRegion />
            <PullableRegion />
            <ProtectedRegion />
          </view>
        </PullToRefreshContent>
      </PullToRefreshRoot>
    </view>
  );
}
