# packages/lynx-css

## 디렉토리 개요

**Lynx 플랫폼 전용 CSS 변수와 Recipe를 제공**하는 패키지. `@seed-design/css`의 Lynx 타겟을 독립 패키지로 분리한 것. 대부분의 파일은 **자동 생성**되므로 직접 수정 금지.

## 파일 작성 컨벤션

| 경로 | 생성 원천 | 수정 가능 |
|------|-----------|-----------|
| `vars/` | `rootage/*.yaml` | **X** |
| `recipes/` | `qvism-preset/src/recipes/*.ts` | **X** |
| `*.css` (루트) | qvism-preset | **X** |
| `qvism.config.mjs` | - | **O** |
| `package.json` | - | **O** |

## 코드 작성 컨벤션

스타일 변경이 필요하면:
1. 토큰 → `packages/rootage/*.yaml` 수정
2. Recipe → `packages/qvism-preset/src/recipes/*.ts` 수정
3. `bun generate:all` 실행

### css 패키지와의 차이

- Lynx 전용 PostCSS 파이프라인 사용 (`postcssEngaged`, `postcssLynxCompat`)
- CSS attribute 선택자를 Lynx 호환 클래스명으로 매핑 (예: `user-color-scheme="dark"` → `.seed-user-color-scheme-dark`)
- `deriveSlots`, `extraVariants`가 루트 config에서 직접 적용됨 (targets가 아닌 최상위 레벨)
