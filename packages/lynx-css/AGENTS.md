# packages/lynx-css

Lynx용 CSS 변수·Recipe를 배포하는 `@seed-design/lynx-css` 패키지다. 대부분 `packages/rootage/`와 `packages/lynx-qvism-preset/`에서 생성되므로 스타일 변경은 그 원천에서 시작한다(`packages/lynx-qvism-preset/AGENTS.md`).

## 검증

- 런타임 토큰 생성 변경 → `bun test packages/lynx-css/scripts/runtime-tokens.test.ts packages/lynx-css/scripts/runtime-tokens.integration.test.ts`로 생성기와 공개 토큰 값의 일치를 검사한다.

## 규칙

### 런타임 토큰

- `vars/runtime.{mjs,d.ts}`는 기존 `vars` exports에서 파생하는 경량 조회 데이터다. 직접 고치지 않고 `bun --filter @seed-design/lynx-css generate:runtime-tokens`로 갱신한다. `rootage:generate`는 토큰과 component spec 생성 뒤 이 명령을 실행한다.
- 소비자가 설치한 CSS 버전의 토큰을 읽어야 하므로 React 패키지에 조회 데이터 사본을 넣지 않는다. 값과 타입은 같은 CSS 패키지의 `vars/runtime`에서 제공한다.

### 수동 Recipe: progress-circle

- `recipes/progress-circle.{css,mjs,d.ts}`는 qvism이 만들지 않는 수동 Recipe다. Lynx가 SVG `stroke-dasharray`를 지원하지 않아 고정 clip-path로 링을 그린다. Indeterminate는 반원·cap의 transform을 `Element.animate`로 보간하고, determinate는 Main Thread에서 pie sector를 갱신한다.
- 스타일을 바꿀 때 → 이 세 파일을 직접 고친다. `packages/lynx-qvism-preset/`에 대응 Recipe를 만들지 않는다. preset의 `src/recipes.ts`에 없으므로 `bun qvism:generate`가 이 파일을 덮어쓰거나 지우지 않는다.
- `.gitattributes`의 `packages/lynx-css/recipes/**`는 생성물 표시이고, 이 세 파일만 `-linguist-generated` 예외로 뺐다. `git check-attr`는 `unset`을 반환하므로 `.claude/hooks/generated-files-guard.ts`가 편집을 막지 않는다. `biome.json`·`.coderabbit.yaml`의 `packages/lynx-css/recipes/**` 제외는 그대로라 formatter·리뷰 대상이 아니다 → 고친 뒤 다른 slot의 형식에 직접 맞춘다.
- 파일 첫 줄의 `TODO`는 Lynx가 SVG를 지원하면 qvism Recipe로 옮기고 세 파일을 지운다는 표시다. 그 전까지 유지한다.

### 표시되지 않은 생성물: scale-feedback

- `scale-feedback/`은 `bun qvism:generate`의 마지막 단계인 `scripts/generate-scale-feedback.mjs`가 Rootage duration·timing-function 토큰으로 만든다. `.gitattributes`에 없어 `git check-attr`는 `unspecified`를 반환하지만 생성물이다 → 직접 고치지 않고 스크립트나 토큰을 고친 뒤 `bun qvism:generate`를 실행한다.
