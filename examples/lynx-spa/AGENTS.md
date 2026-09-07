# examples/lynx-spa

## 디렉토리 개요

Rspeedy 기반 Lynx SPA 예제 앱이다. `src/`에서 실제 화면과 컴포넌트 사용 예를 관리하고, 프로젝트 루트의 Rspeedy·TypeScript 설정으로 개발·빌드한다.

## 파일 작성 컨벤션

- 화면과 예제 코드는 `src/` 아래에 기능별로 배치한다.
- 컴포넌트 파일과 설정 파일은 기존 디렉터리의 명명·export 패턴을 따른다.
- 새 의존성이나 빌드 설정이 필요하면 먼저 현재 `package.json`과 Rspeedy 설정을 확인한다.

## 코드 작성 컨벤션

- Lynx intrinsic element(`<view>`, `<text>` 등)는 런타임 변수로 치환하지 않고 리터럴 JSX로 작성한다.
- 기존 예제와 동일한 패키지 import 및 `@seed-design/lynx-*` 사용 패턴을 우선한다.
- VariantTable의 아이콘 색상이나 타이밍을 수정할 때만 `docs/content/lynx/hooks/use-icon-color.mdx`의 관련 근거를 확인한다. 근거 없이 timer 재시도나 색상 token 예외를 추가하지 않는다.
- Lynx·Rspeedy 동작이 불확실할 때 관련 공식 문서를 확인한다. 모든 작업에서 문서 전체를 사전 열람할 필요는 없다.

## 검증

- 개발 서버: `bun run dev`
- 배포 빌드: `bun run build`
- 결과 미리보기: `bun run preview`
- 설정 확인이 필요할 때: `bunx rspeedy inspect`
- 변경 후에는 `bun run check`와 `bun run build`를 실행한다.
