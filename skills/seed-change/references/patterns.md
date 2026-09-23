# Changeset 메시지 작성 규칙

패키지별 bump는 [version-matrix.md](version-matrix.md)로 먼저 확정한다. 이 문서는 확정된 bump를 소비자가 이해할 한국어 메시지로 쓰는 방법만 다룬다.

## 기본 문장

- 변경 결과를 첫 문장에 쓴다. 작업 과정이나 파일 목록으로 시작하지 않는다.
- 메시지는 `~합니다` 체로 쓴다. 기존 CHANGELOG와 같은 말투다.
- 컴포넌트명, prop, 타입, 명령어, export 경로는 백틱으로 감싼다.
- 사용자가 해야 할 일이 있으면 정확한 교체 대상과 명령을 적는다.
- 내부 리팩터링, 생성 스크립트 실행, import 정리처럼 소비자에게 필요 없는 내용은 뺀다.
- 한 changeset에는 하나의 사용자 변화만 담는다.

## bump별 구조

### `major`

첫 줄을 `(BREAKING CHANGE: …)`로 시작한다. 괄호 안에는 변경 설명이 아니라 사용자가 해야 할 마이그레이션을 쓴다.

```text
(BREAKING CHANGE: `PageBanner.TextContent`를 `PageBanner.Content`로 변경해야 합니다.) Page Banner의 슬롯 이름을 정리합니다.

- `PageBanner.TextContent`를 제거합니다.
- `PageBanner.Body`를 사용해 본문 스타일을 지정합니다.
```

마이그레이션 방법이 없으면 제거된 기능과 대체 수단이 없다는 사실을 적는다. `minor`나 `patch`에는 `BREAKING CHANGE` 접두사를 쓰지 않는다. 예외로 Lynx `0.x` 패키지가 breaking change를 `minor`로 배포할 때는 접두사를 붙인다(version-matrix「Lynx `0.x`」, 선례: `packages/lynx-react/CHANGELOG.md` 0.3.0).

### `minor`

기존 사용법을 유지한 채 무엇을 새로 쓸 수 있는지 쓴다. 선택적으로 최신화해야 하는 Registry snippet은 설치 방법을 함께 적는다.

```text
Content Placeholder 컴포넌트를 추가합니다.

- `npx @seed-design/cli@latest add ui:content-placeholder`로 Registry 컴포넌트를 설치할 수 있습니다.
```

### `patch`

잘못됐던 동작과 고쳐진 결과를 한 문장으로 잇는다.

```text
Checkbox가 비활성 상태에서 잘못된 접근성 값을 전달하던 문제를 수정합니다.
```

여러 수정이 같은 원인과 사용자 결과를 공유할 때만 짧은 제목 아래 불릿을 쓴다.

```text
Text Field의 오류 상태 표시를 수정합니다.

- 오류 메시지가 있을 때 접근성 설명을 올바르게 연결합니다.
- 오류 상태 색상이 Recipe와 일치하도록 수정합니다.
```

자동 dependency 전파 때문에 patch changeset이 필요하지만 사용자 변화가 없으면 다음처럼 쓴다. 이 표현을 일반 내부 작업에 changeset을 더하는 근거로 쓰지 않는다.

```text
(사용자 변경사항 없음) 내부 의존성을 호환되는 버전으로 갱신합니다.
```

## 여러 패키지

하나의 기능이 CSS, wrapper, Headless 패키지에 함께 반영되면 한 changeset에 묶는다. 패키지마다 bump가 달라도 같은 사용자 변화면 한 파일에 둘 수 있다. 서로 독립적인 버그 수정과 기능 추가는 파일을 나눈다.

```text
---
"@seed-design/css": minor
"@seed-design/react": minor
---

Content Placeholder 컴포넌트를 추가합니다.
```

## Registry snippet

snippet만 바뀐 경우의 bump 판단은 [version-matrix.md](version-matrix.md)「Registry snippet」을 따른다. 공개 패키지에 새 기능을 추가하고 snippet이 그 기능을 쓰는 경우에만 그 changeset 메시지에서 최신 설치 방법을 안내한다.

```text
Bottom Sheet에 드래그로 닫는 기능을 추가합니다.

- `npx @seed-design/cli@latest add ui:bottom-sheet`로 최신 Registry 컴포넌트를 설치하면 사용할 수 있습니다.
```

재설치가 필요한 `major`라면 마이그레이션 문장에 재설치를 함께 적는다.

```text
(BREAKING CHANGE: Bottom Sheet Registry 컴포넌트를 다시 설치하고 `snapPoints` 사용처를 수정해야 합니다.) Bottom Sheet의 snap point API를 변경합니다.
```

## 파일 형식

```text
---
"@seed-design/패키지명": patch|minor|major
---

한국어 메시지
```

- 위치는 `.changeset/<형용사-명사-동사>.md`다. 파일명은 기존 파일과 겹치지 않는 영어 소문자 세 단어로 만든다.
- 패키지명은 쌍따옴표로 감싼다.
- frontmatter와 메시지 사이에 빈 줄 하나를 둔다.

## 피해야 할 표현

- breaking change를 `minor`로 분류하지 않는다 → `major`로 쓴다. 예외는 version-matrix「Lynx `0.x`」 정책뿐이고, 이때도 `BREAKING CHANGE` 접두사와 마이그레이션 안내를 쓴다.
- "코드를 개선했습니다", "파일을 이동했습니다"처럼 사용자 영향이 드러나지 않는 문장을 쓰지 않는다 → 소비자가 겪는 변화를 쓴다.
- 커밋 메시지나 PR 설명을 그대로 복사하지 않는다.
- dependency가 바뀌었다는 이유만으로 소비 패키지의 공개 변화를 추측하지 않는다.
- 로컬 peer range 수정이 끝났다거나 현재 작업에서 peer 하한을 고치라고 쓰지 않는다 → peer 검토 대상은 최종 보고에 남긴다(version-matrix「peer dependency 후속 처리」).
