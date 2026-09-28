---
id: iphone-lan-asset-prefix
description: iPhone PlayLynx에서 Lynx 문서 예제·lazy bundle을 검증하거나 LAN ASSET_PREFIX와 portless 접속을 조사할 때 읽는다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["isolated-regression-baselines"]
---

# iPhone 검증 bundle은 절대 LAN ASSET_PREFIX로 빌드한다

## 교훈과 다음 행동

- 실기기 native 검증과 전후 비교는 같은 길이의 LAN origin을 절대 prefix로 넣은 production build로 한다.
- `ASSET_PREFIX=http://<LAN IP>:<4자리 port>/ bun --filter lynx-spa build` → hub process로 `examples/lynx-spa/dist`를 같은 port에서 정적 서빙한다 → `http://<LAN IP>:<port>/main.lynx.bundle?example=lynx%2F<component>%2F<scenario>`. 기준과 변경본의 port 자릿수를 맞추면 bundle byte 비교에 prefix 차이가 섞이지 않는다.

## 발생 근거와 적용 조건

- 상황: lynx-spa의 portless dev URL(`*.ette.test`)과 기본 production build(asset prefix `/`)를 iPhone PlayLynx에서 열었다.
- 영향: main bundle은 로드됐지만 lazy bundle 요청이 실패해 문서 예제 장면이 열리지 않았고, 서버 방식을 다시 정해야 했다.
- 피할 패턴: 실기기 lazy 예제 검증에 `.test` 도메인 dev server나 상대 asset prefix build를 쓰는 것.
- 위험: iOS 기기는 `.test` 호스트와 schema 없는 `/lazy-bundle/...` 경로를 불러오지 못한다. main bundle 로드 성공만 보고 환경이 정상이라고 오판한다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
