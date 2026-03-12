# packages/css

## 디렉토리 개요

**CSS 변수와 Recipe를 제공**하는 패키지. 대부분의 파일은 **자동 생성**되므로 직접 수정 금지.

## 파일 작성 컨벤션

| 경로 | 생성 원천 | 수정 가능 |
|------|-----------|-----------|
| `vars/` | `rootage/*.yaml` | **X** |
| `recipes/` | `qvism-preset/src/recipes/*.ts` | **X** |
| `*.css` (루트) | qvism-preset | **X** |
| `qvism.config.mjs` | - | **O** |

## 코드 작성 컨벤션

스타일 변경이 필요하면:
1. 토큰 → `packages/rootage/*.yaml` 수정
2. Recipe → `packages/qvism-preset/src/recipes/*.ts` 수정
3. `bun generate:all` 실행
