# AGENTS.md — packages/lynx-react-headless

## 디렉토리 개요

Lynx 플랫폼용 headless 패키지 모음. `@seed-design/react-headless/*`의 Lynx 대응으로, 컴포넌트별로 개별 npm 패키지(`@seed-design/lynx-react-*`)로 배포한다. 상태/이벤트/로직만 담당하고, 스타일드 UI는 상위의 `packages/lynx-react`가 이 훅들을 소비한다.

## 책임 경계

| 넣는 것 | 넣지 않는 것 |
|---|---|
| 상태(useState), controlled/uncontrolled, press/tap, context, render props, 이벤트 핸들러 | recipe/className/token, native `<view>`/`<image>`/`<text>` JSX |

- native tag JSX는 Lynx 컴파일러의 파일-스코프 정적 분석(BackgroundSnapshot) 때문에 **최종 렌더 컴포넌트(`lynx-react`) 파일 안에 literal로** 작성해야 한다. 따라서 headless는 native JSX를 렌더하지 않고 hook/context/핸들러만 제공한다.
- 웹 DOM API(`img.complete`, `naturalWidth`, attribute selector 등)에 의존하지 않는다. Lynx 이벤트(`bindload`/`binderror` 등)로 상태를 만든다.

## 파일 작성 컨벤션

- 패키지: `packages/lynx-react-headless/<component>/` (npm name `@seed-design/lynx-react-<component>`)
- 훅: `src/use<Name>.ts`, 배럴: `src/index.ts`에서 `export * from "./<file>"`
- 빌드: `bunchee` (ESM), peer `@lynx-js/react` / `@lynx-js/types`
- 새 패키지 추가 시 루트 `package.json`의 `workspaces`에 `packages/lynx-react-headless/*`가 포함돼 있는지 확인

## 코드 작성 컨벤션

- `any` / `as unknown` 금지, type import는 `type` 키워드 사용
- React API는 `@lynx-js/react`에서 import한다 (`react` 아님)
- 안정 콜백이 필요하면 `@lynx-js/lynx-ui-common`의 `useMemoizedFn`을 사용한다 (lynx-react 훅과 동일 패턴)
