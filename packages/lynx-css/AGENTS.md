# packages/lynx-css

## 디렉토리 개요

**Lynx 플랫폼 전용 CSS 변수와 Recipe를 제공**하는 패키지. `@seed-design/css`의 Lynx 타겟을 독립 패키지로 분리한 것. 대부분의 파일은 **자동 생성**되므로 직접 수정 금지.

## 파일 작성 컨벤션

| 경로 | 생성 원천 | 수정 가능 |
|------|-----------|-----------|
| `vars/` | `rootage/*.yaml` | **X** |
| `recipes/*.css` | `lynx-qvism-preset/src/recipes/*.ts` | **X** (단, 아래 수동 예외 제외) |
| `recipes/progress-circle.css` | 수동 recipe | **O** |
| `*.css` (루트) | lynx-qvism-preset | **X** |
| `qvism.config.mjs` | - | **O** |
| `package.json` | - | **O** |

## 코드 작성 컨벤션

원천 파일의 스타일을 변경할 때:
1. 토큰 → `packages/rootage/*.yaml` 수정
2. 자동 생성 Recipe → `packages/lynx-qvism-preset/src/recipes/*.ts` 수정
3. 원천 파일을 수정한 경우 `bun generate:all` 실행

`recipes/progress-circle.css`처럼 수동 관리 예외를 수정할 때는 해당 파일을 직접 변경하고 생성 원천은 수정하지 않는다.

### 수동 관리 recipe (qvism 자동 생성 제외)

Lynx 플랫폼 제약으로 qvism recipe에서 자동 생성할 수 없는 컴포넌트는 수동으로 관리한다. 수동 recipe는 `bun generate:all`의 대상에서 제외되어야 하며, 이 파일을 직접 수정한다.

| Recipe | 제외 이유 | 웹과의 차이 |
|--------|-----------|-------------|
| `progress-circle` | Lynx에서 SVG(`stroke-dasharray`) 미지원 | 웹: SVG + CSS 애니메이션, Lynx: clip-path + JS `requestAnimationFrame` 애니메이션 |

수동 recipe 파일에는 `TODO` 주석이 포함되어 있으며, Lynx의 해당 기능 지원 시 qvism 자동 생성으로 전환한다.

### css 패키지와의 차이

- Lynx 전용 recipe/preset source에서 Web과 다른 CSS를 직접 작성한다.
- CSS attribute 선택자 후처리에 의존하지 않고 Lynx에서 사용할 class selector를 source에 명시한다.
- slot 분리가 필요하면 qvism core 확장 대신 `packages/lynx-qvism-preset`에서 `defineSlotRecipe`로 모델링한다.
