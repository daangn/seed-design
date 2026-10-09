---
id: lynx-spread-dataset-removal
description: Lynx 컴포넌트·예제에서 spread나 조건부 prop으로 넘긴 `data-*`를 빼거나 `undefined`로 바꿨는데 tap handler의 `event.currentTarget.dataset`·native 속성에 이전 값이 남을 때, 또는 SEED 컴포넌트에 native props 전달을 열면서 dataset 제거 동작을 판정·문서화할 때 읽는다. 잔존이 SEED가 아니라 ReactLynx spread와 Lynx engine의 dataset 병합에서 온다는 원천·기기 근거와 대응 방법을 다룬다. `style` key 잔존은 lynx-inline-style-key-set을 본다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**"]
status: active
related: ["lynx-inline-style-key-set"]
verified_at: "2026-10-07"
---

# spread에서 뺀 `data-*`는 native dataset에 남는다

## 교훈과 다음 행동

- spread 객체에서 `data-*` key를 빼거나 값을 `undefined`로 바꿔도 native dataset의 이전 값은 지워지지 않는다. SEED 컴포넌트와 raw `<view {...props}>`가 같다 → SEED에서 보정하지 않는다.
- 값을 지워야 하면 같은 key에 다른 값(예: `""`)을 계속 보낸다. 빈 문자열은 이전 값을 덮어쓴다. 요소를 다시 만들어도 되면 `key`로 remount한다.
- 같은 key의 값 교체(`"a"` → `"b"`)는 정상 반영된다. `id`·`className`·`style` 등 다른 속성의 제거에는 적용하지 않는다.
- `@lynx-js/react/testing-library`의 `__SetDataset`도 `Object.assign`으로 병합하므로 테스트에서도 잔존이 재현된다. 제거 단언이 필요하면 `data-*` 대신 `accessibility-label` 같은 일반 속성을 쓴다. 테스트 mock은 `id` 제거를 문자열 `"null"`로 보인다.

## 발생 근거와 적용 조건

- 원천(2026-10-07): `@lynx-js/react` 0.123.3 `runtime/lib/snapshot/snapshot/spread.js`의 `updateSpread`는 새 spread의 `data-*`만 모아 `__SetDataset(element, dataset)`을 부르고, 사라진 `data-*` key는 "collected below" 주석 뒤 아무것도 하지 않는다(0.117.0도 같다). lynx-family/lynx develop `8688964`의 `FiberSetDataset` → `Element::SetDataset` → `AttributeHolder::SetDataSet`은 전달받은 key만 `(*data_set_)[key] = val`로 쓰고 기존 key를 지우지 않는다.
- 테스트 환경: `@lynx-js/react` 0.117.0 `testing-library/dist/env/vitest.js`의 `__SetDataset(e, dataset)`은 `Object.assign(e.dataset, dataset)`이다.
- 기기 확인(DES-2682): 실제 iPhone iOS 26.6 PlayLynx(Lynx SDK 1.4.0), agent-lynx 0.14.2, `examples/lynx-spa` dev bundle의 임시 예제. `MannerTempBadge`와 raw `<view>`에 같은 spread를 주고 `bindtap`에서 `event.currentTarget.dataset`을 표시했다. `data-probe` `"a"` → `"b"`는 둘 다 `{"probe":"b"}`, key 제거와 `undefined`는 둘 다 `{"probe":"b"}`로 남았고, `""`를 보내자 둘 다 `{"probe":""}`가 됐다.

## 변경 이력

- 2026-10-07: DES-2682 native host props 공개 중 원천과 iPhone 기기로 확인해 기록했다.
