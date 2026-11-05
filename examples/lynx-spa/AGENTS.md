# examples/lynx-spa

Rspeedy 기반 Lynx SPA 예제 앱이다. Lynx native 기본 장면 검증에 쓰이고, `dev`·`build`가 `docs/scripts/lynx-examples/prepare-workspace.ts`를 먼저 실행한다.

## 검증

- 변경 후 → `bun --filter lynx-spa typecheck`와 `bun --filter lynx-spa build`
- 개발 서버 → `bun lynx:dev`, 빌드 결과 미리보기 → `bun --filter lynx-spa preview`, Rspeedy 설정 확인 → 이 디렉터리에서 `bunx rspeedy inspect`
- 패키지의 `check`·`format` script는 이 앱 전체를 다시 쓴다 → 실행하지 말고 변경한 파일만 `bun biome format --write <파일>`로 맞춘다.

## 규칙

- Lynx intrinsic element(`<view>`, `<text>` 등)는 런타임 변수로 치환하지 않고 리터럴 JSX로 쓴다.
- `VariantTable`(`src/components/variant-table.tsx`)의 아이콘 색상·타이밍을 고칠 때만 `docs/content/lynx/hooks/use-icon-color.mdx`의 근거를 확인한다. 근거 없이 timer 재시도나 색상 token 예외를 넣지 않는다 → 근거가 없으면 원인을 보고한다.
- Lynx·Rspeedy 동작이 불확실하면 그 부분의 공식 문서만 확인한다.
