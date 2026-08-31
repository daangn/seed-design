---
"@seed-design/cli": major
---

`docs`가 `list`, `search`, `read` 세 하위 명령으로 나뉩니다. CLI 파서를 Optique으로 교체합니다.

`docs`는 지금까지 한 이름 아래 성격이 다른 두 계약을 담고 있었습니다. 주소를 넣으면 문서 본문이 나오고, 카테고리를 넣으면 경로 목록이 나왔습니다. 둘 다 stdout으로 나가기 때문에, 파이프로 받는 쪽은 지금 받은 것이 문서인지 목록인지 내용을 뜯어보지 않고는 알 수 없었습니다. 이제 무엇이 돌아올지가 인자의 모양이 아니라 명령 이름으로 정해집니다.

```sh
seed-design docs list                                  # 최상위 목록
seed-design docs list react/                           # 그 아래 한 단계
seed-design docs search action-button                  # 이름으로 주소 찾기
seed-design docs read /react/components/action-button  # 그 문서의 내용
```

`docs`만 입력하면 하위 명령 안내를 stderr로 내보내고 종료 코드 `1`로 끝납니다. 뒤에 붙은 값을 주소로 해석하지 않습니다.

## 주소 문법

세 명령이 같은 주소 문법을 공유하고, 슬래시 두 개가 무엇을 뜻하는지 정합니다.

| 형태 | 뜻 | 결과 |
| ---- | -- | ---- |
| `/react/components/action-button` | 고정 주소. 경로 전체와 완전히 일치 | 0개 또는 1개 |
| `action-button` | 꼬리 질의. 경로의 마지막 조각들과 일치 | 0개 이상 |
| `react/` | 범위. 그 아래 전부 | 0개 이상 |

앞의 슬래시가 고정 주소와 짧게 친 이름을 가릅니다. 문서 경로 51개가 다른 문서 경로의 꼬리라서, `components/bottom-sheet`처럼 그 자체로 완전한 경로도 꼬리 규칙만으로는 여러 문서에 걸립니다.

뒤의 슬래시는 컨테이너와, 같은 자리에 있는 문서를 가릅니다. `/react`는 React 카테고리의 개요 문서이고, `react/`는 그 카테고리가 담고 있는 것들입니다.

두 슬래시는 서로 독립입니다. 범위도 주소와 똑같이 짧게 칠 수 있어서, `stackflow/`는 `/react/stackflow`에 닿고 `/stackflow/`는 최상위에 그 이름의 컨테이너가 있어야 합니다.

`docs read`는 주소가 여러 문서를 가리키면 그중 하나를 고르지 않고 후보를 stderr에 나열한 뒤 종료 코드 `1`로 끝냅니다. 잘못된 문서를 조용히 받아서 그것을 근거로 작업하는 것이 가장 나쁜 결과이기 때문입니다.

## 이전 명령에서 옮겨오기

| 지금까지 | 앞으로 |
| -------- | ------ |
| `seed-design docs` | `seed-design docs list` |
| `seed-design docs react` | `seed-design docs list react/` |
| `seed-design docs react/components/action-button` | `seed-design docs read /react/components/action-button` |
| `seed-design docs react/overview` | `seed-design docs read /react` |
| `seed-design docs-search action-button` | `seed-design docs search action-button` |

**동작 변경**: 하위 명령 없는 형태를 남겨 두지 않았습니다. 무엇을 요청하는지가 이름에 드러나지 않는 호출을 없애는 것이 이 변경의 목적이라서, 하위 호환을 위해 예전 형태를 유지하면 그 목적이 사라집니다.

**동작 변경**: `docs-search`가 `docs search`로 바뀌고, 별칭을 남기지 않습니다.

**동작 변경**: `docs search`의 stdout에 한 줄에 주소 하나씩만 나갑니다. 주소 옆에 붙던 제목과 `(deprecated)` 표시가 사라집니다. 찾은 개수는 이전처럼 stderr로 나갑니다.

**동작 변경**: `docs read`가 뒤 슬래시로 끝나는 범위 주소를 거부합니다. 컨테이너에는 본문이 없고, 그 아래 문서가 마침 하나뿐이라고 해서 그것을 답하면 사이트가 자라는 순간 같은 입력이 다른 뜻이 됩니다. `docs list`로 그 아래를 보세요.

**동작 변경**: telemetry 이벤트 이름이 `seed_cli.docs`와 `seed_cli.docs-search`에서 `seed_cli.docs-list`, `seed_cli.docs-search`, `seed_cli.docs-read` 셋으로 바뀝니다. 이 이름으로 만든 대시보드가 있으면 함께 고쳐주세요.

**동작 변경**: 세 명령 모두 `--cwd`를 받지 않습니다. 어떤 문서를 답할지 정할 때 작업 디렉토리와 프로젝트 설정 파일을 읽지 않으므로, 같은 입력은 어디서 실행하든 같은 문서를 가리킵니다. telemetry 수집 여부는 이전과 같이 실행한 디렉토리의 `seed-design.json`을 따릅니다.

**동작 변경**: 공백으로 나눠 쓴 경로를 한 경로로 합치지 않습니다. `docs react components action-button`처럼 쓰던 입력은 `docs read /react/components/action-button`으로 바꿔주세요.

## 파서 교체

명령을 나누려면 공백으로 나뉜 하위 명령을 지원하는 파서가 필요해서, `cac`을 Optique으로 교체했습니다. 함께 고쳐지는 것이 둘 있습니다.

**동작 변경**: 존재하지 않는 명령을 넣으면 종료 코드 `1`로 끝납니다. 이전에는 아무것도 출력하지 않고 `0`으로 끝나서, 종료 코드만 보는 쪽에서는 실패가 성공으로 읽혔습니다.

**동작 변경**: 값의 후보가 정해진 옵션이 그 밖의 값을 거부합니다. `--framework svelte`와 `--on-diff rename`은 이제 파서 단계에서 실패합니다. 이전에는 아무 문자열이나 통과했습니다.

파서가 바뀌면서 도움말과 사용법 출력의 모양도 달라집니다. 하위 명령마다 자기 옵션만 보여주므로 `seed-design docs read --help`에 다른 하위 명령의 옵션이 섞이지 않습니다. `Usage:`와 `Error:` 접두어는 파서가 영어로 출력하고, 그 뒤의 문구는 한국어입니다.
