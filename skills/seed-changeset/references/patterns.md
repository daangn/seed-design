# Changeset 메시지 작성 규칙

먼저 [version-matrix.md](version-matrix.md)로 패키지별 bump를 확정한다. 이 문서는 확정된 bump를 소비자가 이해할 수 있는 한국어 메시지로 쓰는 방법만 다룬다.

## 기본 문장

- 변경 결과를 첫 문장에 쓴다. 작업 과정이나 파일 목록으로 시작하지 않는다.
- `~합니다` 체를 사용한다.
- 컴포넌트명, prop, 타입, 명령어, export 경로는 백틱으로 감싼다.
- 사용자가 해야 할 일이 있으면 정확한 교체 대상과 명령을 적는다.
- 내부 리팩터링, 생성 스크립트 실행, import 정리처럼 소비자에게 필요 없는 내용은 생략한다.
- 한 changeset에는 하나의 사용자 변화만 담는다.

## bump별 구조

### `major`

첫 줄을 `(BREAKING CHANGE: …)`로 시작한다. 괄호 안에는 변경 설명이 아니라 사용자가 해야 할 마이그레이션을 쓴다.

```text
(BREAKING CHANGE: `PageBanner.TextContent`를 `PageBanner.Content`로 변경해야 합니다.) Page Banner의 슬롯 이름을 정리합니다.

- `PageBanner.TextContent`를 제거합니다.
- `PageBanner.Body`를 사용해 본문 스타일을 지정합니다.
```

마이그레이션 방법이 없으면 제거된 기능과 대체 수단이 없다는 사실을 명시한다. `minor`나 `patch`에는 `BREAKING CHANGE` 접두사를 쓰지 않는다.

### `minor`

기존 사용법을 유지한 채 무엇을 새로 사용할 수 있는지 쓴다. 선택적으로 최신화해야 하는 Registry snippet은 설치 방법을 함께 적는다.

```text
Content Placeholder 컴포넌트를 추가합니다.

- `npx @seed-design/cli@latest add ui:content-placeholder`로 Registry 컴포넌트를 설치할 수 있습니다.
```

### `patch`

잘못됐던 동작과 수정된 결과를 한 문장으로 연결한다.

```text
Checkbox가 비활성 상태에서 잘못된 접근성 값을 전달하던 문제를 수정합니다.
```

여러 수정이 같은 원인과 사용자 결과를 공유할 때만 짧은 제목 아래 불릿을 사용한다.

```text
Text Field의 오류 상태 표시를 수정합니다.

- 오류 메시지가 있을 때 접근성 설명을 올바르게 연결합니다.
- 오류 상태 색상이 Recipe와 일치하도록 수정합니다.
```

자동 dependency 전파 때문에 patch changeset이 필요하지만 사용자 변화가 없다면 다음처럼 쓴다.

```text
(사용자 변경사항 없음) 내부 의존성을 호환되는 버전으로 갱신합니다.
```

이 표현을 일반적인 내부 작업에 changeset을 추가하는 근거로 사용하지 않는다.

## 여러 패키지

하나의 기능이 CSS, wrapper, Headless 패키지에 함께 반영되면 한 changeset에 묶는다.

```text
---
"@seed-design/css": minor
"@seed-design/react": minor
---

Content Placeholder 컴포넌트를 추가합니다.
```

패키지마다 bump가 달라도 같은 사용자 변화라면 한 파일에 둘 수 있다. 서로 독립적인 버그 수정과 기능 추가는 별도 파일로 나눈다.

실제 소비 패키지와 Version Changes PR의 peer dependency 검토 대상은 최종 보고에 남긴다. 현재 changeset 메시지에 로컬 peer range 수정이 끝났다고 쓰지 않는다.

## Registry snippet

Registry 파일만 바뀌었다면 changeset을 만들지 않는다. snippet은 npm 패키지가 아니며, 이미 복사된 코드도 자동으로 갱신되지 않는다.

같은 작업에서 공개 패키지에 새 기능을 추가하고 snippet이 그 기능을 소비한다면 공개 패키지의 실제 API 영향으로 bump를 정한다. 이 경우에만 해당 changeset 메시지에서 최신 설치 방법을 안내할 수 있다.

```text
Bottom Sheet에 드래그로 닫는 기능을 추가합니다.

- `npx @seed-design/cli@latest add ui:bottom-sheet`로 최신 Registry 컴포넌트를 설치하면 사용할 수 있습니다.
```

재설치가 필요하다는 사실만으로 `major`가 되지는 않는다. 기존 설치 조합을 깨는 공개 패키지 계약 변경이 있을 때만 해당 패키지를 `major`로 분류하고, 마이그레이션 과정에 재설치가 필요하면 함께 안내한다.

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

- 파일 위치는 `.changeset/<형용사-명사-동사>.md`다.
- 파일명은 충돌하지 않는 영어 소문자 세 단어로 만든다.
- 패키지명은 쌍따옴표로 감싼다.
- frontmatter와 메시지 사이에 빈 줄 하나를 둔다.

## 피해야 할 표현

- breaking change를 `minor`로 분류하지 않는다. Lynx 패키지도 같다.
- “코드를 개선했습니다”, “파일을 이동했습니다”처럼 사용자 영향이 드러나지 않는 문장을 쓰지 않는다.
- 커밋 메시지나 PR 설명을 그대로 복사하지 않는다.
- dependency가 바뀌었다는 이유만으로 소비 패키지의 공개 변화까지 추측하지 않는다.
- 현재 작업에서 peer dependency 하한을 수정하라고 안내하지 않는다. 이 작업은 Version Changes PR의 후속 검토다.
