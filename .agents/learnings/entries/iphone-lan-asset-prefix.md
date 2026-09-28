---
id: iphone-lan-asset-prefix
description: lynx-spa의 문서 예제를 iPhone PlayLynx에서 검증할 때 main bundle은 열리지만 lazy bundle 요청이 실패하거나, production bundle의 ASSET_PREFIX를 정할 때 읽는다. 기기에서 접근 가능한 절대 asset URL 조건과 전후 bundle 크기 비교에 섞이는 prefix 차이를 다룬다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["isolated-regression-baselines"]
---

# iPhone의 lazy bundle 검증에는 접근 가능한 절대 asset URL이 필요하다

## 교훈과 다음 행동

- iPhone PlayLynx에서 lazy 문서 예제를 검증할 때는 `examples/lynx-spa/lynx.config.ts`의 `output.assetPrefix`와 기기에서의 asset URL 접근 가능 여부를 확인한다. production build의 `ASSET_PREFIX`에는 기기에서 접근 가능한 절대 URL을 지정하고 main·lazy bundle을 모두 확인한다.
- `ASSET_PREFIX="<기기에서 접근 가능한 asset URL>/" bun --filter lynx-spa build`로 만든 `examples/lynx-spa/dist`를 해당 URL에서 제공한다. 서버 실행 도구·호스트·포트는 팀의 현재 검증 환경에 맞춘다. 전후 bundle byte 비교에서는 prefix 문자열 길이도 맞춰 주소 차이가 크기 차이에 섞이지 않게 한다.

## 발생 근거와 적용 조건

- 상황: 개발 호스트에서만 해석되는 dev URL과 기본 production build(asset prefix `/`)를 iPhone PlayLynx에서 열었다.
- 영향: main bundle은 로드됐지만 lazy bundle 요청이 실패해 문서 예제 장면이 열리지 않았고, 서버 방식을 다시 정해야 했다.
- 피할 패턴: 개발 호스트에서 URL이 열리거나 main bundle이 로드된다는 이유만으로 기기의 lazy 요청도 성공한다고 판단하는 것.
- 위험: 기기의 DNS·네트워크 조건과 상대 경로 해석이 개발 호스트와 다르면 lazy 예제만 실패할 수 있다. 이 사건을 모든 iOS 기기·네트워크의 도메인 지원 여부로 일반화하지 않는다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: description의 선택 맥락을 보강하고 개인 호스트명·하네스 의존 서버 절차를 제거했다. 저장소의 asset prefix 설정과 당시 lazy 요청 실패 조건은 보존했다. 기기 재검증은 하지 않았다.
