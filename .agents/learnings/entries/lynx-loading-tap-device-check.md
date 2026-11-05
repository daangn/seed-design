---
id: lynx-loading-tap-device-check
description: Lynx 버튼의 loading·disabled 중 tap 차단을 PlayLynx 기기에서 agent-lynx로 검증하거나, tap이 `Ref @eN is covered`·`is not visible`로 거부될 때 읽는다. absolute loading overlay가 덮은 버튼에서 실제로 전달되는 tap 대상을 고르고, loading 종료 시각으로 차단 여부를 판정하는 방법을 다룬다. 단위 테스트의 tap 차단 검증에는 적용하지 않는다.
scope: ["packages/lynx-react/**", "packages/lynx-react-headless/**", "docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
related: ["iphone-lan-asset-prefix"]
---

# loading 중 tap 차단은 overlay의 자식 ref와 시간 창으로 기기에서 확인한다

## 교훈과 다음 행동

- 첫 tap 뒤 snapshot을 다시 찍고, 버튼 root 바로 아래에서 `{hidden}`이 아닌 loading indicator view를 탭한다. root 자손이므로 tap은 버튼으로 전달된다.
- tap 명령의 반환을 tap 시각으로 보지 않는다. 첫 tap 직후 loading 상태를 먼저 확인하고, 두 번째 tap이 loading 구간 안에 있었는지 경계 시각으로 판정한다.
- 차단 여부는 loading 종료 시각으로 판정한다. 예제의 loading이 2초면 첫 tap 기준 2~3초 사이에 CDP `DOM.getDocument`로 root class의 `loading_true|false`를 읽는다. 차단됐으면 `loading_false`, 차단되지 않았으면 두 번째 tap 기준 2초까지 `loading_true`다.

## 발생 근거와 적용 조건

- DES-2612에서 ActionButton loading 예제의 재탭을 검증하려고 loading 전 snapshot의 root ref를 탭했다. `agent-lynx` 0.14.2는 absolute loading indicator가 덮은 ref를 `Ref @eN is covered`로 거부했고, 다음 시도에서는 `{hidden}` 노드를 골라 `is not visible`로 실패했다.
- 영향: 두 번째 tap이 전달되지 않아 차단 여부를 판정할 수 없는 실행이 두 번 생겼다. loading indicator view를 탭한 실행에서 재탭 차단을 확인했다.
- 피할 패턴: loading 전 ref를 재사용하거나 snapshot 트리의 마지막 ref를 기계적으로 고르는 것.
- 위험: 거부된 tap을 "차단됨"으로 오판한다.

## 변경 이력

- 2026-09-28: DES-2612 작업의 `AGENT_LEARNINGS.md` 항목을 이관했다. 실행 속도 같은 개인 환경 정보는 제외했다.
