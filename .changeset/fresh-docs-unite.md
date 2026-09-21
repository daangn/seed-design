---
"@seed-design/cli": major
"@seed-design/docs-mcp": major
---

(BREAKING CHANGE: CLI의 기존 `docs` 호출을 `docs list`, `docs search`, `docs read`로 변경하고, 제거된 MCP 도구와 바뀐 `get_doc` 인자를 사용하는 설정·프롬프트를 갱신해야 합니다.) CLI와 Docs MCP에서 문서를 검색하고 읽는 방법을 정리합니다.

## CLI

### 문서 조회

기존 대화형 `docs` 명령을 세 하위 명령으로 나눕니다.

- `seed-design docs list`: 모든 문서를 주소순으로 출력합니다. `seed-design docs list react`처럼 섹션을 지정하면 그 섹션의 문서만 나열합니다.
- `seed-design docs search "액션 버튼"`: 문서의 제목·본문을 검색해 관련도 순으로 최대 20개 문서를 출력합니다.
- `seed-design docs read /react/components/action-button`: 링크 대신 Markdown 본문을 stdout에 출력합니다. `--raw`는 제거합니다.

목록과 검색 결과는 주소를 첫 필드로 두고 제목·설명·deprecated 여부를 한 줄에 표시합니다. 이 주소를 `docs read`에 그대로 넘깁니다. 검색 결과의 `#앵커`를 읽으면 해당 문서 전체를 반환합니다.

| 기존 호출 | 변경할 호출 |
| --- | --- |
| `seed-design docs` | `seed-design docs list` |
| `seed-design docs react/components/action-button --raw` | `seed-design docs read /react/components/action-button` |
| `seed-design docs components/action-button --framework react` | `seed-design docs read /react/components/action-button` |
| `seed-design docs react components action-button` | `seed-design docs read /react/components/action-button` |

문서 명령의 `--cwd`와 `--framework`를 제거하고 프로젝트 설정과 무관하게 사이트 경로를 사용합니다. `/components/action-button`은 디자인 스펙, `/react/components/action-button`은 React 구현 문서입니다. `/react`는 개요 문서입니다. 주소는 고쳐 읽지 않고 목록·검색 결과에 출력된 그대로만 받습니다. 앞 슬래시가 없거나 뒤 슬래시가 붙은 주소, `action-button` 같은 짧은 이름은 없는 주소로 보고 비슷한 주소를 안내합니다.

문서 인덱스에 있는 주소만 읽습니다. 기존 버전별 changelog 주소는 제거하며, 패키지별 변경 이력은 GitHub 저장소에 있는 각 패키지의 `CHANGELOG.md`에서 확인합니다. 기존 스니펫 링크 출력은 제거하며, 스니펫은 `seed-design add ui:action-button`처럼 설치합니다.

검색 색인을 디스크에 캐시하고 변경 여부를 확인해 재사용합니다. `SEED_CACHE_DIR`로 캐시 위치를 지정할 수 있습니다.

### 자동화 실행

- 종료 코드 `1`은 `compat`의 비호환 판정, `docs search`의 검색 결과 없음, `docs list`에 지정한 섹션 없음에 사용합니다. 잘못된 명령·옵션·주소, 네트워크·설정·파일 처리 실패는 `2`로 구분합니다. 종료 코드 `1`만 실패로 처리하던 스크립트는 갱신해야 합니다.
- `docs`와 `compat`은 결과를 stdout에, 오류·건수·검사 대상·해결 안내를 stderr에 출력합니다. `compat`은 비호환 보고가 있을 때만 stdout을 출력합니다. 모든 명령의 오류 상세와 텔레메트리 수집 안내를 stderr로 옮깁니다.
- stdin 또는 stdout이 터미널이 아니면 질문을 띄우지 않습니다. `init`은 `-y`, `add`는 항목 인자, `add-all`은 레지스트리 인자 또는 `--all`을 지정해야 합니다. 설정 파일이 없으면 `seed-design init -y`를 먼저 실행합니다.
- `add --include-deprecated`로 deprecated 항목 추가를 명시하고, `add`·`add-all`의 `--on-diff overwrite|backup|skip`으로 기존 파일 처리 방식을 지정할 수 있습니다. 비대화형 실행에서 처리 방식을 지정하지 않은 충돌 파일은 보존하고 나머지 작업 후 `2`로 종료합니다.

### 기타 변경

- `init --default`를 제거합니다. `init --yes` 또는 `init -y`로 변경해야 합니다. 이미 폐기된 `add --all`·`add -a`도 제거하며, 전체 추가에는 `add-all`을 사용합니다.
- `compat`의 `-c`·`--component`와 `-r`·`--registry`를 제거합니다. 검사할 항목은 `add`와 같이 `seed-design compat ui:action-button ui:alert-dialog`처럼 레지스트리를 포함해 인자로 지정해야 하며, `action-button`처럼 레지스트리를 생략한 이름은 거부합니다. `-c`는 다른 명령과 같이 `--cwd`의 짧은 이름이 되므로, `compat -c action-button`을 그대로 실행하면 `action-button`을 작업 디렉터리로 해석합니다.
- `compat`의 항목 인자와 `--seedReactVersion` 값을 고쳐 읽지 않습니다. 앞뒤 공백을 제거하거나 가운데 공백을 `-`로 바꾸지 않으며, 빈 `--seedReactVersion`은 지정하지 않은 것으로 보지 않고 지원하지 않는 버전으로 거부합니다.
- 여러 단어로 된 옵션의 camelCase·kebab-case 표기를 유지하며, `--seedReactVersion`에 지정한 버전이 실제로 적용되도록 수정합니다.
- `--version`이 실행한 프로젝트 대신 CLI 자체 버전을 표시합니다. `--help`, `--version`, 문서 명령을 `package.json`이 없는 디렉터리에서도 사용할 수 있습니다.
- 기존 파일과 내용이 다를 때 대화형 선택의 기본값을 백업으로 변경합니다.
- 의존성 설치 실패 시 실행 명령·종료 코드·패키지 매니저의 오류 내용을 기본 출력에 포함합니다. 의존성 설치를 생략한 이유는 `package.json` 선언 기준으로 안내하고, 설정·텔레메트리 안내의 문서 주소를 수정합니다.

## Docs MCP

- `search_docs({ query: "액션 버튼" })`를 추가합니다. CLI와 같은 색인·검색 로직을 사용해 관련 문서를 최대 20개 반환합니다. 결과에는 주소·제목·설명·deprecated 여부가 포함됩니다.
- `get_doc`의 `section` 인자를 제거하고, `path`에 목록·검색 결과에 출력된 주소를 그대로 받습니다. 검색 주소 `/react/components/action-button#usage`는 `get_doc({ path: "/react/components/action-button#usage" })`로 읽으며, 앵커는 무시하고 전체 본문을 반환합니다. `/react` 같은 섹션 개요도 `get_doc({ path: "/react" })`로 읽습니다.
- `list_docs`와 `get_doc`은 사이트의 문서 인덱스에서 최신 섹션·문서 목록을 읽습니다. 디자인 스펙·파운데이션·패턴·업데이트·시작하기 섹션도 조회할 수 있습니다. `list_docs`는 `search_docs`와 같은 형식으로 주소·제목·설명·deprecated 여부를 표시하고, `section`을 생략하면 모든 문서를 나열합니다. `category` 필터를 제거합니다.
- `get_doc`은 인덱스에 있는 문서의 주소와 정확히 같을 때만 읽습니다. 앞 슬래시가 없는 경로, `.txt`·`.md`가 붙은 경로, `action-button` 같은 짧은 이름은 찾지 못한 것으로 답하므로 목록에 표시되는 주소로 바꿔야 합니다.
- `discover_seed_docs`와 `get_full_docs`를 제거합니다. `search_docs` 또는 `list_docs`로 문서를 찾고 필요한 문서를 `get_doc`으로 읽도록 설정·프롬프트를 변경해야 합니다.
- `list_icons`, `search_icons`, `get_icon_details`를 제거합니다. 아이콘은 [아이콘 라이브러리](https://seed-design.io/foundations/iconography/library)에서 확인합니다.
- `get_rootage`는 인덱스에 등록된 리소스 경로만 조회하도록 제한합니다. 경로는 앞 슬래시까지 인덱스와 같아야 하며, 빈 `path`는 인덱스를 반환하지 않고 찾지 못한 것으로 답합니다.
- `SEED_DOCS_BASE_URL` 환경 변수로 문서 사이트를 지정할 수 있습니다. 문서·검색·rootage 요청에 30초 제한을 적용하고, 검색 색인은 캐시해 30분마다 재검증합니다.
- 공개 함수 `initializeTools`가 `Promise<void>` 대신 `void`를 반환합니다. `.then()`을 연결한 코드는 직접 호출하거나 `await initializeTools(server)`로 변경해야 합니다.

## 검색 및 문서 서버

검색은 `ActionButton`·`action-button`·`action button`처럼 이름의 표기가 달라도 찾을 수 있습니다. 한글 형태소 분석은 지원하지 않으므로 `액션버튼` 대신 `액션 버튼`처럼 띄어 씁니다.

별도 문서 서버를 사용하는 경우 새 문서 인덱스(`categories[].items[]`, `docUrl`, `llmsUrl`)와 `/api/search.json` 검색 색인을 함께 제공해야 합니다. 문서 본문은 인덱스의 `llmsUrl`을 따라 읽습니다.
