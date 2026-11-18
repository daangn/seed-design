---
id: lynx-host-engine-version
description: PlayLynx·Lynx Go 같은 host에서 Lynx 컴포넌트를 검증하고 결과에 엔진 버전을 남기거나, 기기 결과를 문서 `compatibility.lynx.engine`·최소 엔진 판단의 근거로 쓸 때 읽는다. agent-lynx client 정보의 `sdkVersion`(예: `1.4.0`, `0.0.1`)을 Lynx Engine 버전으로 오인하지 않고, 소유 session에서 `SystemInfo.engineVersion`을 읽어 기록하는 방법을 다룬다. 빌드 대상 `engineVersion` 설정이나 host 앱 자체의 버전 관리에는 적용하지 않는다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "docs/content/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["lynx-drag-gesture-cdp", "lynx-go-android-real-touch"]
verified_at: "2026-10-06"
---

# 기기 결과의 엔진 버전은 host sdkVersion이 아니라 SystemInfo.engineVersion으로 기록한다

## 교훈과 다음 행동

- agent-lynx client 정보에 보이는 `sdkVersion`은 host 앱·디버그 연결 쪽 값이다. Lynx Engine 버전이 아니다.
- 소유한 Card의 session에서 `bunx agent-lynx evaluate 'JSON.stringify(SystemInfo)' --client <client> --session <session>`을 실행하고 `engineVersion`을 기록한다. 같은 결과의 `platform`과 OS 버전도 함께 남긴다.
- 문서의 `compatibility.lynx.engine`이나 최소 엔진 판단에 기기 결과를 쓸 때는 이 값을 근거로 쓴다. 다른 학습 기록에 적힌 "Lynx SDK 1.4.0"은 host 값일 수 있으므로, 엔진 버전 근거로 재사용하기 전에 다시 확인한다.

## 발생 근거와 적용 조건

- DES-2708(Lynx PullToRefresh) 환경 준비에서 agent-lynx 0.14.2로 확인했다. client 정보의 `sdkVersion`은 `1.4.0` 또는 `0.0.1`이었다. 소유 session의 `SystemInfo.engineVersion`은 iOS 26.5 시뮬레이터 PlayLynx(`com.karrot.playlynx`)에서 `4.1`, Android Galaxy SM-F971N Lynx Go(`com.funcs.io.lynx.go`)에서 `4.0`이었다.
- 피할 패턴: client 목록의 버전 필드를 엔진 버전으로 보고 문서 호환성 하한이나 동작 차이의 원인으로 쓰는 것.

## 변경 이력

- 2026-10-06: DES-2708 Phase A 환경 준비에서 기록했다.
