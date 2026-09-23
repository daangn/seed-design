# packages/lynx-css

Lynx용 CSS 변수·Recipe를 배포하는 `@seed-design/lynx-css` 패키지다. 대부분 `packages/rootage/`와 `packages/lynx-qvism-preset/`에서 생성되므로 스타일 변경은 그 원천에서 시작한다(`packages/lynx-qvism-preset/AGENTS.md`).

## 규칙

### 수동 Recipe: progress-circle

- `recipes/progress-circle.{css,mjs,d.ts}`는 qvism이 만들지 않는 수동 Recipe다. Lynx가 SVG `stroke-dasharray`를 지원하지 않아 웹(SVG + CSS 애니메이션)과 달리 clip-path + JS `requestAnimationFrame` 애니메이션으로 구현한다.
- 스타일을 바꿀 때 → 이 세 파일을 직접 고친다. `packages/lynx-qvism-preset/`에 대응 Recipe를 만들지 않는다. preset의 `src/recipes.ts`에 없으므로 `bun qvism:generate`가 이 파일을 덮어쓰거나 지우지 않는다.
- `.gitattributes`의 `packages/lynx-css/recipes/**`가 이 파일도 생성물로 표시한다. `git check-attr`는 `set`을 반환하고 `.claude/hooks/generated-files-guard.ts`가 Write·Edit를 막는다 → 우회하지 않고, 수동 예외라는 근거(이 절)를 사용자에게 밝혀 `.gitattributes` 예외 추가나 수정 방법을 확인받는다.
- 파일 첫 줄의 `TODO`는 Lynx가 SVG를 지원하면 qvism Recipe로 옮기고 세 파일을 지운다는 표시다. 그 전까지 유지한다.

### 표시되지 않은 생성물: scale-feedback

- `scale-feedback/`은 `bun qvism:generate`의 마지막 단계인 `scripts/generate-scale-feedback.mjs`가 Rootage duration·timing-function 토큰으로 만든다. `.gitattributes`에 없어 `git check-attr`는 `unspecified`를 반환하지만 생성물이다 → 직접 고치지 않고 스크립트나 토큰을 고친 뒤 `bun qvism:generate`를 실행한다.
