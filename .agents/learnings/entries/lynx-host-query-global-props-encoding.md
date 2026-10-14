---
id: lynx-host-query-global-props-encoding
description: 문서 Lynx 예제의 QR·`lynx://open?url=` 링크나 bundle URL query(`example` 등)로 Lynx Explorer에서 특정 예제를 바로 열려는데 예제 picker가 뜨거나, `lynx.__globalProps`에 들어온 query 값이 `lynx%252F…`처럼 인코딩된 채로 남을 때 읽는다. host가 URL query를 global props로 옮기며 남기는 인코딩 깊이 차이와, `docs/examples/lynx/standalone.tsx`의 예제 ID 정규화 기준을 다룬다. query를 아예 적용하지 않는 Lynx Go는 lynx-go-android-real-touch를 본다.
scope: ["docs/examples/lynx/**", "docs/components/lynx-example/**", "examples/lynx-spa/**"]
status: active
related: ["lynx-explorer-evaluate-control", "lynx-go-android-real-touch"]
verified_at: "2026-10-14"
---

# Lynx Explorer는 URL query를 인코딩된 global prop으로 넘길 수 있다

## 교훈과 다음 행동

- QR payload에 query가 있어도 bundle이 받는 값은 host마다 다르다. 먼저 기기에서 `lynx.__globalProps`와 `lynx.getNativeApp().__pageUrl`을 evaluate로 함께 읽어 실제 입력을 확인한다.
- global prop 값을 그대로 ID로 확정하지 않는다. `standalone.tsx`처럼 `decodeURIComponent`를 값이 더 바뀌지 않을 때까지 최대 두 번 적용해 정규화한다. 인코딩되지 않은 Web 값, 한 번 인코딩된 값, 두 번 인코딩된 값이 같은 ID가 된다.
- QR URL 형식(`<bundle>?example=…&fullscreen=true`)을 바꿔 해결하지 않는다. payload는 정상이었고 원인은 수신 쪽 해석이었다.

## 발생 근거와 적용 조건

- 증상: 문서 미리보기 옆 QR을 Lynx Explorer로 스캔하면 예제가 바로 열리지 않고 picker가 표시됐다. 스크린샷 QR 디코딩 결과에는 `?example=lynx%2Faccordion%2Fvalue-changes&fullscreen=true`가 있었다.
- 관찰: iOS 26.5 시뮬레이터, LynxExplorer(`com.lynx.LynxExplorer`, SDK 1.4.0)에서 같은 URL을 열자 `globalProps.example`은 `lynx%252Faccordion%252Fvalue-changes`(두 번 인코딩)였고 `__pageUrl`에는 원래 query가 그대로 있었다. 기존 코드는 global prop을 우선 확정해 URL fallback을 타지 않았고, 일치하는 ID가 없어 picker를 띄웠다.
- 참고: `lynx-family/lynx` 저장소 `explorer/` 소스(2026-09-29 revision)의 Android legacy `QueryMapUtils`는 `http`로 시작하지 않는 값을 decode하지 않고 global props로 넘긴다(한 번 인코딩). Android 기기에서는 확인하지 않았다.

## 변경 이력

- 2026-10-14: QR 예제가 바로 렌더링되지 않는 문제를 iOS 시뮬레이터에서 재현·수정하며 기록했다.
