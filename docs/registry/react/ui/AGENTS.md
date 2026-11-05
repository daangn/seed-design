# docs/registry/react/ui

문서와 CLI registry가 함께 쓰는 user-facing React snippet이다. 사용자가 복사해 고쳐 쓰는 공개 표면이라 내부 예시 코드보다 API 안정성과 사용성을 먼저 판단한다. `examples/stackflow-spa/src/seed-design/ui/`에 vendored copy가 있다.

## 작업 절차

### snippet을 추가하거나 API를 바꿀 때

1. `skills/seed-component/references/api-design.md`의 「API 설계 9원칙」「[Snippet] Children composition vs convenience prop 판단 기준」「Snippet 작성 패턴」「[Snippet] Export naming」으로 wrapper 형태, prop, export 이름을 정한다.
2. snippet 하나를 파일 하나에 쓴다. 새 파일은 `docs/registry/react/registry-ui.ts`에 등록한다.
3. `bun docs:generate` 후 `docs/public/__registry__/react/ui/<name>.json`이 의도대로 바뀌었는지 확인한다.
4. 같은 파일이 `examples/stackflow-spa/src/seed-design/ui/`에 있으면 `examples/stackflow-spa/AGENTS.md`「Snippet 동기화」대로 맞춘다. 앱 코드에서 우회하지 않고 이 폴더의 contract를 먼저 고친다.

## 규칙

- `"use client"` 여부, 공개 prop type, 최상위 export가 한 파일 안에서 드러나게 쓴다.
- 다른 registry 파일은 `seed-design/...` alias 대신 상대 경로로 import한다. alias import는 registry 생성이 실패한다.
