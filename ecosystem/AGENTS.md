# ecosystem

생성 파이프라인의 실행 도구 workspace다. `rootage/`·`qvism/`은 Rootage YAML과 qvism Recipe를 산출물로 바꾸고, `figma-extractor/`는 Figma REST 데이터를 추출하며, `postcss-engaged/`·`postcss-responsive/`는 `packages/qvism-preset`이 쓰는 PostCSS plugin이다.

## 검증

- 생성 로직 변경 → `bun ecosystem:build` 후 영향받는 생성 명령을 실행하고 `git diff`로 산출물 변화를 확인한다. 단계별 명령은 `ARCHITECTURE.md`「생성 파이프라인」에 있다.
- `postcss-engaged/`·`postcss-responsive/` 변경 → 같은 방식으로 빌드한 뒤 `bun qvism:generate`로 `packages/css/recipes/` 결과를 확인한다. `:--engaged` 전개를 바꾸면 웹 Recipe 전체의 interactive 상태가 바뀐다.

## 규칙

- `rootage/`·`qvism/`은 `core/`(파싱·변환·출력 문자열 생성)와 `cli/`(실행 진입점·옵션 파싱·파일 쓰기)로 나눈다. 변환 로직은 `core/`에 두고 `core/`의 테스트로 검증한다.
- 생성 결과가 틀림 → 산출물을 고치지 않고 `core/` 로직이나 `packages/`의 원천을 고친다.
- `figma-extractor/`는 루트 `bun figma:sync`와 `packages/figma`의 `sync-entities`가 쓴다. 실행에는 `FIGMA_PERSONAL_ACCESS_TOKEN`과 file key가 필요하다 → 실행 전에 사용자에게 확인한다.
