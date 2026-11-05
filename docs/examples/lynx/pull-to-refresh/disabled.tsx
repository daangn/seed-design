import "./styles";

import { useState } from "@lynx-js/react";

import {
  PullToRefreshContent,
  PullToRefreshIndicator,
  PullToRefreshRoot,
} from "@/components/ui/pull-to-refresh";
import { Switch } from "@/components/ui/switch";
import { useRefreshObservation } from "./use-refresh-observation";

export default function Example() {
  const [disabled, setDisabled] = useState(false);
  const { refreshCount, lastEvent, callbacks } = useRefreshObservation();

  function onCheckedChange(checked: boolean) {
    "background only";
    setDisabled(checked);
  }

  return (
    <view className="ptr-preview">
      <text className="ptr-preview__title">Disabled</text>
      <text className="ptr-preview__status">
        {`disabled: ${JSON.stringify(disabled)} · refresh 횟수: ${refreshCount} · 마지막 이벤트: ${lastEvent}`}
      </text>
      <PullToRefreshRoot className="ptr-preview__frame" disabled={disabled} {...callbacks}>
        <PullToRefreshIndicator />
        <PullToRefreshContent>
          <view className="ptr-preview__body">
            <view className="ptr-preview__disabled-row">
              <text className="ptr-preview__label">Disabled</text>
              <Switch
                checked={disabled}
                onCheckedChange={onCheckedChange}
                accessibility-label="Disabled"
              />
            </view>
          </view>
        </PullToRefreshContent>
      </PullToRefreshRoot>
    </view>
  );
}
