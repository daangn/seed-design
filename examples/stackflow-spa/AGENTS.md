# examples/stackflow-spa

## 디렉토리 개요

`seed-design/ui/*` snippet을 실제 앱 형태로 소비해보는 Stackflow SPA 예제다. 문서용 snippet API가 실제 소비자 코드에서 자연스럽게 동작하는지 검증하는 역할도 함께 맡는다.

## 파일 작성 컨벤션

- 앱 코드와 vendored snippet 코드를 분리한다. 앱 코드는 `src/activities/`, `src/components/`에 두고, vendored snippet은 `src/seed-design/ui/` 아래에 둔다.
- snippet 관련 변경이 있으면 `src/seed-design/ui/` 경로를 source of truth로 직접 확장하지 말고, registry 쪽 변경과 함께 동기화한다.
- 예제 파일명은 시나리오 중심의 `PascalCase` 또는 기존 activity 네이밍을 유지한다.

## 코드 작성 컨벤션

- `src/seed-design/ui/`는 generated snippet의 vendored copy로 취급한다. registry snippet API가 바뀌면 이 경로도 같이 업데이트한다.
- snippet이 존재하는 컴포넌트는 direct package import보다 `seed-design/ui/*` consumption을 우선한다.
- snippet 변경 후에는 이 예제 앱 build를 확인하여 실제 소비자 코드가 깨지지 않았는지 검증한다.
- vendored snippet을 앱 코드에서 임시로 우회 수정하기보다, 가능한 한 `docs/registry/ui/`의 public snippet contract를 먼저 바로잡고 여기로 내려보낸다.
