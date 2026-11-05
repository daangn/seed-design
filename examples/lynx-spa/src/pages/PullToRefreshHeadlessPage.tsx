import { useState } from "@lynx-js/react";
import {
  PullToRefresh,
  usePullToRefreshContext,
  usePullToRefreshPreventPull,
} from "@seed-design/lynx-react-pull-to-refresh";

function Status({ refreshCount }: { refreshCount: number }) {
  const { state } = usePullToRefreshContext();
  return (
    <text style={{ fontSize: "14px" }}>{`state: ${state} · refresh 횟수: ${refreshCount}`}</text>
  );
}

function ProtectedRegion() {
  const preventPullProps = usePullToRefreshPreventPull();
  return (
    <view {...preventPullProps} style={{ padding: "16px", backgroundColor: "#ffe4e4" }}>
      <text>이 영역과 자식에서 시작한 당김은 새로고침하지 않습니다.</text>
    </view>
  );
}

type Host = "scroll-view" | "list-container" | "list";
const HOSTS: Host[] = ["scroll-view", "list-container", "list"];

export function PullToRefreshHeadlessPage() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [host, setHost] = useState<Host>("scroll-view");

  async function onPtrRefresh() {
    "background only";
    setRefreshCount((count) => count + 1);
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
  }

  function toggleDisabled() {
    "background only";
    setDisabled((value) => !value);
  }

  function nextHost() {
    "background only";
    setHost((value) => HOSTS[(HOSTS.indexOf(value) + 1) % HOSTS.length] ?? "scroll-view");
  }

  return (
    <view
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
        gap: "12px",
        backgroundColor: "#ffffff",
        color: "#222222",
      }}
    >
      <text style={{ fontSize: "18px", fontWeight: "600" }}>PullToRefresh (Headless)</text>
      <text>
        SEED CSS 없이 Root·Indicator·Content와 공개 context를 사용합니다. 최상단에서 아래로
        당겨보세요.
      </text>
      <view bindtap={toggleDisabled} style={{ padding: "12px", backgroundColor: "#e8e8e8" }}>
        <text>{`disabled: ${JSON.stringify(disabled)} · 탭해서 변경`}</text>
      </view>
      <view bindtap={nextHost} style={{ padding: "12px", backgroundColor: "#e8e8e8" }}>
        <text>{`Content host: ${host} · 탭해서 변경`}</text>
      </view>
      <PullToRefresh.Root
        disabled={disabled}
        onPtrRefresh={onPtrRefresh}
        style={{ width: "100%", height: "400px", border: "1px solid #888888" }}
      >
        <PullToRefresh.Indicator
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#e8efff",
          }}
        >
          {({ value }) => (
            <text>{value === undefined ? "새로고침 중" : "아래로 당긴 뒤 놓으세요"}</text>
          )}
        </PullToRefresh.Indicator>
        {host === "scroll-view" ? (
          <PullToRefresh.Content style={{ width: "100%", height: "100%" }}>
            <view
              style={{ display: "flex", flexDirection: "column", padding: "16px", gap: "16px" }}
            >
              <Status refreshCount={refreshCount} />
              <ProtectedRegion />
              {Array.from({ length: 12 }, (_, index) => (
                <view key={index} style={{ padding: "20px", backgroundColor: "#f1f1f1" }}>
                  <text>{`${index + 1}. 일반 영역에서 당기면 새로고침합니다.`}</text>
                </view>
              ))}
            </view>
          </PullToRefresh.Content>
        ) : (
          // 기본 list는 iOS에서 intercept가 native 스크롤에 연결되지 않아 list-container와 비교용으로 둡니다.
          <PullToRefresh.ListContent
            key={host}
            custom-list-name={host}
            style={{ width: "100%", height: "100%" }}
          >
            <list-item item-key="status" style={{ padding: "16px 16px 8px" }}>
              <Status refreshCount={refreshCount} />
            </list-item>
            <list-item item-key="protected" style={{ padding: "8px 16px" }}>
              <ProtectedRegion />
            </list-item>
            {Array.from({ length: 40 }, (_, index) => (
              <list-item key={index} item-key={`item-${index}`} style={{ padding: "8px 16px" }}>
                <view style={{ padding: "20px", backgroundColor: "#f1f1f1" }}>
                  <text>{`${index + 1}. ${host}에서 당기면 새로고침합니다.`}</text>
                </view>
              </list-item>
            ))}
          </PullToRefresh.ListContent>
        )}
      </PullToRefresh.Root>
    </view>
  );
}
