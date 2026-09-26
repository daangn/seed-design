# packages/css

웹 CSS 변수·Recipe를 배포하는 `@seed-design/css` 패키지다. 대부분 `packages/rootage/`와 `packages/qvism-preset/`에서 생성되고, 아래 손으로 쓰는 모듈만 이 패키지가 원천이다.

## 규칙

손으로 쓰는 원천은 `theming/`, `breakpoints/`, `scale-feedback/`, `qvism.config.mjs`다. 생성 명령은 이 경로를 만들지도 고치지도 않는다.

- `theming/` 수정 → `.mjs`, `.cjs`, `.d.ts`를 함께 맞춘다.
- `breakpoints/`, `scale-feedback/` 수정 → `.mjs`와 `.d.ts`를 함께 맞춘다.
- `scale-feedback/`의 class·값 이름은 소비자 CSS가 직접 참조하는 공개 API다. 이름을 바꾸면 changeset에 breaking 여부를 밝히고, `SCALE_FEEDBACK_CLASS_NAME`은 `packages/qvism-preset/src/utils/scale-feedback.ts`의 같은 값도 고친다. 둘을 대조하는 검사가 없다.
- `theming/`의 inline script template literal 안에는 주석을 쓰지 않는다. 문자열 그대로 모든 페이지에 실린다 → 설명은 template literal 밖에 쓴다.
- 생성된 스타일을 바꿔야 함 → 토큰은 `packages/rootage/`, Recipe는 `packages/qvism-preset/src/recipes/`를 고치고 루트 `AGENTS.md`「생성」을 따른다.
