# 컴포넌트 경로 조회

현재 체크아웃을 단일 원천으로 삼아 한 컴포넌트의 원천·생성물·구현·Registry·문서·예제·테스트 경로를 JSON으로 돌려준다. 정적 카탈로그나 외부 서버를 쓰지 않고 파일을 읽기만 하며, 같은 파일 상태에서는 같은 결과를 낸다.

## 절차

1. 컴포넌트 하나를 PascalCase나 kebab-case로 지정해 실행한다. 여러 컴포넌트가 필요하면 각각 실행한다.

   ```bash
   bun skills/seed-component/scripts/component-map.ts ProgressCircle
   bun skills/seed-component/scripts/component-map.ts action-button
   ```

2. `component.state`로 분기한다.
   - `matched` → 정확한 컴포넌트 표면을 찾았다. 3단계로 간다.
   - `ambiguous` → 정확한 표면은 없고 이름이 겹치는 후보가 있다. `ambiguities[].candidate`의 정확한 이름으로 다시 실행한다.
   - `not-found` → 정확한 표면도 후보도 없다. 신규 구현이면 그대로 입력으로 쓰고, 아니면 이름을 확인한다.
3. 필요한 배열의 경로를 직접 읽어 실제 책임과 공개 API를 확인한다. 맵 결과만으로 동작을 추측하지 않는다.
4. `generatedOutputs`의 경로는 고치지 않는다 → 대응하는 `rootage` 또는 `recipeSources` 원천을 고친다.
5. 경로 조회만 요청받았으면 확인한 경로와 상태를 반환하고 끝낸다.

## 결과 필드

플랫폼별 경로 필드는 `react`·`lynx` 배열을 가진다. `generatedOutputs`와 `docs`는 `shared` 배열도 가지고, `rootage`는 플랫폼 구분 없는 단일 배열이다.

- `component`: 입력(`input`), 정규화 이름(`kebab`, `pascal`), `state`
- `platforms`: 실제 표면이 발견된 `react`, `lynx`
- `rootage`, `recipeSources`, `headless`: 직접 수정하는 Rootage·Recipe·Headless 원천
- `generatedOutputs`: Rootage·CSS·변수 생성물
- `implementations`, `packageExports`: React·Lynx Styled UI 구현과 컴포넌트 barrel에서 패키지 루트까지의 공개 export
- `registry`, `docs`: Registry 구현·등록 파일, 공통·React·Lynx 문서
- `examples`, `tests`: 문서 예제와 저장소 예제 앱의 vendored 표면, 단위 테스트와 Storybook story
- `ambiguities`: 정확한 이름을 못 찾았을 때 다시 조회할 후보와 그 경로

## 탐색 범위

탐색 대상은 `skills/seed-component/scripts/component-map.ts`의 `SCAN_ROOTS`다.

- Rootage·Recipe 원천: `packages/rootage`, `packages/qvism-preset`, `packages/lynx-qvism-preset`
- 생성 CSS: `packages/css`, `packages/lynx-css`
- Headless: `packages/react-headless`, `packages/lynx-react-headless`
- 구현: `packages/react`, `packages/lynx-react`, `packages/stackflow`의 공개 컴포넌트와 primitive
- 문서·예제: `docs/content`, `docs/registry`, `docs/stories`, `docs/examples`, `examples`

심링크와 빌드·캐시 디렉터리(`dist`, `lib`, `node_modules`, `.next`, `storybook-static` 등)는 따라가지 않는다. 지원 표면이 새로 생기면 정적 결과 파일을 추가하지 않는다 → `SCAN_ROOTS`와 경로 패턴을 갱신한다.
