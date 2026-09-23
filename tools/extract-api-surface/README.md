# extract-api-surface

지정한 workspace 패키지의 공개 API 표면을 추출한다. 변경이 breaking change인지 판단할 근거를 PR에서 바로 보이게 하는 것이 목적이다.

## 사용법

```sh
bun extract-api-surface @seed-design/react                           # 현재 작업 트리의 표면
bun extract-api-surface @seed-design/react @seed-design/css          # 여러 패키지
bun extract-api-surface --format json @seed-design/react             # 구조화된 출력
bun extract-api-surface --root <dir> @seed-design/react              # 다른 checkout의 표면
bun extract-api-surface --out-dir <dir> @seed-design/react           # 패키지별 <dir>/<패키지 이름>.txt 파일로 저장
bun extract-api-surface $(bun .github/scripts/api-surface-packages.ts)  # CI처럼 public 패키지 전체
```

다른 workspace 패키지에서 온 타입은 대상 패키지가 `package.json`에 선언한 workspace 의존성(`dependencies`·`peerDependencies`·`devDependencies`)을 따라 소스에서 읽는다.

저장소 소스의 import 중 하나라도 해석되지 않으면 목록을 출력하고 exit 1로 멈춘다. 해석되지 않은 import에서 흘러나온 타입은 오류 없이 `any`가 되어 표면이 조용히 틀어지기 때문이다. 의존성을 설치하지 않은 경우도 이 규칙으로 잡힌다.

## 표면에 담기는 것

- `package.json`의 `exports` 각 subpath. `types`가 `lib/`·`dist/`를 가리키면 대응하는 `src/` 파일을 읽는다. wildcard는 실제 파일로 펼친다.
- import는 그 파일이 속한 패키지의 tsconfig `paths`(예: `packages/figma`의 `@/*`)로 해석하고, tsconfig가 포함하는 ambient 선언(`declare module "*.webp"` 등)도 함께 읽는다.
- `types`가 없는 export(CSS·JSON 등)는 대상 파일 목록만, `bin`은 명령 이름만 기록한다.
- 컴포넌트는 props를, 타입은 멤버를 `extends`·`Omit`·intersection까지 펼쳐 기록한다. 다른 workspace 패키지에서 온 멤버에는 `[패키지]`를 붙인다.
- 저장소 밖 패키지(`@types/react` 등)에서 온 멤버는 `...@types/react (280)`처럼 패키지별 개수로 줄인다. `Omit`으로 속성을 빼거나 기반 요소가 바뀌면 개수가 달라진다.
- JSDoc 설명과 `@default`·`@deprecated`는 멤버 아래에 `// ` 줄로 따로 기록해, 타입 변경과 문서 변경이 서로 다른 diff 줄로 나오게 한다.
- 같은 entrypoint에서 이미 기술한 심볼의 다른 이름(`SidePanelBody`와 `SidePanel.Body`)은 `alias` 한 줄로 기록한다.

타입 이름은 선언이 있는 파일의 import 방식을 따라 출력되므로(`ReactNode`와 `React.ReactNode`), import 방식만 바꿔도 diff가 생길 수 있다.

## 개발

```sh
bun --filter @seed-design/extract-api-surface test
bun --filter @seed-design/extract-api-surface typecheck
```
