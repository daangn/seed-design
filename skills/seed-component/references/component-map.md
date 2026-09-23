# 컴포넌트 경로 조회

SEED 저장소 자체를 단일 원천으로 삼아 한 컴포넌트의 연결 지도를 만든다. 정적 카탈로그나 외부 서버를 사용하지 않는다. 스크립트는 현재 체크아웃을 읽기만 하며 같은 파일 상태에서는 같은 JSON을 반환한다.

## 실행

저장소 안에서 컴포넌트 하나를 PascalCase나 kebab-case로 지정한다. 한 번에 한 컴포넌트만 조회하고, 여러 컴포넌트가 필요하면 각각 실행한다.

```bash
bun skills/seed-component/scripts/component-map.ts ProgressCircle
bun skills/seed-component/scripts/component-map.ts action-button
```

## 결과 읽기

- `component`: 입력을 정규화한 이름과 탐색 상태
- `platforms`: 실제 표면이 발견된 `react`, `lynx` 플랫폼
- `rootage`: 직접 수정하는 Rootage 원천
- `recipeSources`: React와 Lynx Recipe 원천
- `generatedOutputs`: Rootage, CSS, 변수 생성물. 직접 수정하지 않는다.
- `headless`: 플랫폼별 Headless 원천
- `implementations`: React와 Lynx Styled UI 구현
- `packageExports`: 컴포넌트 barrel에서 패키지 루트까지 이어지는 공개 export
- `registry`: Registry 구현과 등록 파일
- `docs`: 공통, React, Lynx 문서
- `examples`: 문서 예제와 저장소 예제 앱의 vendored 표면
- `tests`: 단위 테스트와 Storybook story
- `ambiguities`: 정확한 이름을 찾지 못했을 때 다시 조회할 후보

`component.state`는 다음 셋 중 하나다.

- `matched`: 정확한 컴포넌트 표면을 찾음
- `ambiguous`: 정확한 표면은 없지만 이름이 겹치는 후보가 있음
- `not-found`: 정확한 표면과 후보를 모두 찾지 못함

## 절차

1. 대상 컴포넌트 맵을 한 번 조회한다.
2. 필요한 배열의 경로를 직접 읽어 실제 책임과 공개 API를 확인한다. 맵 결과만으로 동작을 추측하지 않는다.
3. `generatedOutputs`는 수정 대상에서 제외하고 대응하는 Rootage 또는 Recipe 원천을 찾는다.
4. `ambiguous`면 `ambiguities[].candidate`의 정확한 이름으로 다시 실행한다.
5. 경로 조회만 요청받았다면 확인한 경로와 상태를 반환하고 끝낸다.

## 탐색 범위

스크립트는 다음 표면만 탐색한다.

- `packages/rootage`, `packages/qvism-preset`, `packages/lynx-qvism-preset`
- `packages/css`, `packages/lynx-css`
- `packages/react-headless`, `packages/lynx-react-headless`
- `packages/react`, `packages/lynx-react`
- `packages/stackflow`의 공개 컴포넌트와 primitive
- `docs/content`, `docs/registry`, `docs/stories`, `docs/examples`
- `examples`

심링크와 빌드·캐시 디렉터리는 따라가지 않는다. 지원 표면이 새로 생기면 정적 결과 파일을 추가하지 말고 `scripts/component-map.ts`의 탐색 범위를 갱신한다.
