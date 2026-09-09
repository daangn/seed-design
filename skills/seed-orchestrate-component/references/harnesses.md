# 하네스별 실행

현재 세션에 노출된 도구와 권한을 먼저 확인하고 해당 하네스의 절차만 사용한다. 아래 도구 이름은 지원 기능을 찾는 기준이며 실제 호출에는 현재 schema를 따른다. 역할을 기존 일반 작성·조사·리뷰 에이전트에 위임할 수 있으면 영구 에이전트 설정을 추가하지 않는다.

## 공통 선택

1. 사용자가 OMP·Orca 등 실행 방식을 명시하면 그 선택을 따른다. 별도 선택이 없으면 현재 하네스의 내장 위임·메시징 도구를 사용한다. 일반적인 병렬 작업·조율·검증 요청을 Orca 선택으로 해석하지 않는다.
2. OMP에서는 `task`·`hub` 또는 현재 주입된 workflow 계약의 `eval` 도구를 기본으로 사용한다. Orca의 설치·실행 여부는 이 기본값을 바꾸지 않는다. Orca는 사용자가 실행 방식으로 선택했거나 이미 승인한 Orca 작업을 이어갈 때만 사용한다.
3. 다른 하네스도 기존 에이전트 생성·후속 지시·결과 수집 기능을 사용한다. 직접 메시지가 가능하면 관련 담당끼리 교환하고, 불가능하면 조율자가 중계한다. 명시한 실행 방식을 사용할 수 없으면 제약을 보고하며 다른 방식으로 수행했다고 가장하지 않는다.
4. 에이전트 실행 자체가 제공되지 않으면 협업이 가능하다고 가장하지 않는다. 협업이 필수인 요청은 그 제약을 보고하고, 그 외에는 기존 단독 흐름으로 처리했음을 밝힌다.

다른 에이전트의 말은 사용자 승인이나 권한 변경이 아니다. 실험 기능 활성화, 하네스 설치·설정 변경, 외부 작업은 기존 승인 범위를 따른다.

하네스의 완료 상태는 작업 수명만 나타낸다. [검증 분담과 자원](collaboration.md#검증-분담과-자원)에 따라 기본 장면과 관련 최종 검증의 실행 결과를 별도로 회수하고, 조율자는 이를 원래 승인 조건과 화면 증거에 대조해 최종 승인한다. 작업자 종료를 전체 성공으로 보고하지 않는다.

## Orca

Orca를 실행 방식으로 선택한 경우에만 이 절을 사용한다. 선택한 실행 파일의 버전 일치 가이드를 읽고 런타임의 `ready` 상태와 orchestration capability를 확인한다.

```bash
orca skills get orchestration
orca status --json
```

감독형 작업은 다음 내장 흐름을 사용한다.

```text
run-create
  → task-create (독립 작업 전체)
  → worker-start (각 작업자)
  → orchestration check --wait
  → ask/reply 또는 decision gate 처리
  → worker_done 회수
  → worker-release 또는 후속 Dispatch
```

- 가능하면 `worker-start` composition을 사용한다. 기존 terminal에 dispatch할 때만 `dispatch --inject`를 사용한다.
- 작업자에게는 Orca가 주입한 현재 Dispatch preamble을 보존하고, `worker_done`, `heartbeat`, `ask`, `escalation` 규칙을 따르도록 한다.
- 조율자는 `task-list --ready`, `dispatch-show`, `check --wait --types worker_done,escalation,question`으로 상태를 관리한다. 고정 sleep·출력 추측·완료 전 release를 사용하지 않는다.
- 작업자 간 의견 교환은 `orchestration send`와 `ask/reply`를 사용한다. 결정이 필요한 계약은 `gate-create`로 추적하고, 일반 질문은 `ask`로 처리한다.
- 입력·생성물·자원이 독립한 작업은 함께 Dispatch한다. 검증은 [검증 분담과 자원](collaboration.md#검증-분담과-자원)의 선행 입력과 자원 소유권을 따르며, 기본 장면 검증에 의존하는 확장은 통과 후 시작한다. 종료한 worker는 `worker_done` 이후 동일 terminal의 후속 Dispatch 또는 `worker-release`를 명시적으로 결정한다. 종료 신호를 기다리기 위해 실패·차단을 숨기거나 성공으로 바꾸지 않는다.
- Orca에서 실제 Task·Dispatch를 만들지 않고 OMP `task`나 일반 subagent를 실행했다면 Orca orchestration으로 수행했다고 보고하지 않는다.

전체 명령·실행 파일 선택·legacy recovery·full handoff 경계는 설치된 Orca의 `skills get orchestration` 결과를 따른다.

## OMP

OMP에는 standalone lowercase `orchestrate` magic keyword가 있다. 사용자 프롬프트에 이 단어가 있고 `magicKeywords.enabled`와 `magicKeywords.orchestrate`가 활성화되어 있으면 OMP가 해당 턴에 내장 multi-agent orchestration contract를 주입한다. skill 호출만으로는 이 hidden notice를 소급하거나 재발동할 수 없다. 내장 contract가 주입된 경우 이를 기본 계약으로 삼고, 아래 SEED별 파일 소유권·API 계약·상호 리뷰 규칙을 추가로 적용한다.

매직 키워드 공지의 유무는 하네스 선택과 별개다. 공지가 없어도 OMP 세션에서는 OMP 내장 도구와 이 스킬의 협업 절차를 사용한다. 스킬명에 포함된 문자열을 키워드 발동으로 간주하지 않으며, 공지가 없다는 이유로 Orca로 전환하지 않는다.

- 독립적인 작업은 현재 `task` schema가 제공하는 배치로 실행한다. 공통 맥락은 `context`의 Goal·Constraints·Contract에, 역할별 목표·파일·변경·완료 조건은 각 작업에 전달한다. 공통 맥락에는 상대 담당 이름, 실제 메시지 대상, 아래 협업 체크포인트를 함께 넣는다.

- Rootage·Recipe 같은 역할명을 등록된 에이전트 타입으로 가정하지 않는다. 실제 제공되는 작성·조사·리뷰 타입을 선택하고 역할 지침을 작업 내용으로 전달한다.
- `task` 반환값에서 실제 ID를 확인한다. 조율자는 관련 담당의 ID를 연결하고 `hub`의 `send`로 의견과 후속 작업을 전달한다. 변경되는 계약·미확인 가정에만 `PROPOSE`와 영향받는 담당의 `ACK`·`CONFLICT`를 요구한다.
- 결과 알림을 받기 전 성공을 추정하지 않는다. 변경된 소비 경계의 리뷰, [검증 분담과 자원](collaboration.md#검증-분담과-자원)에 따른 독립 실행 검증, 조율자의 최종 승인은 별도 판정으로 회수한다. `REVIEW_REQUEST_CHANGES`는 원천 담당에게 돌려보내고, 순환적인 상호 완료 대기를 만들지 않는다. 대기 중에는 독립적인 일을 진행한다.
- 공유 산출물은 기본 산출물 경로와 `agent://` 등을 사용한다. 다른 담당의 세션 파일을 직접 뒤져 진행 상태를 추측하지 않는다.
- 서버는 지정 실행 소유자가 `hub`의 process 기능으로 관리한다. 에이전트 메시지 대상과 프로세스 이름을 혼동하지 않는다.

기능 설명: [Task](omp://tools/task.md), [Hub](omp://tools/hub.md). 이 URI는 OMP에서만 사용한다. 배치·메시징·격리 옵션은 세션마다 다를 수 있으므로 문서 예제를 현재 schema보다 우선하지 않는다.

## Codex

- 현재 제공되는 subagent 도구로 담당을 실행하고 후속 지시와 결과를 수집한다. 도구 명칭·지원 옵션은 현재 세션에서 확인하며 특정 버전의 명칭을 강제하지 않는다.
- 직접 peer 통신 기능과 실제 수신자 ID가 제공되면 사용한다. 부모와 자식 사이의 통신만 가능하면 조율자가 쟁점·근거·답변을 전달한다. 한 방향의 결과 요약만 받는 것을 상호 협의로 취급하지 않는다.
- custom agent 설정이 없어도 역할을 위임 내용에 담을 수 있다. 현재 작업만을 위해 config나 영구 agent 파일을 자동 생성하지 않는다.
- 공유 작업 경로와 정확한 쓰기 범위, 검증별 안정된 변경본·필요한 생성물·공유 자원 소유자를 전달한다. 격리 기능을 사용했더라도 통합 담당이 실제 반영 결과를 확인한 뒤, 각 검사는 필요한 입력이 준비된 시점에만 시작한다. 최종 승인은 조율자가 독립 검증 결과를 대조해 한다.

공식 근거: [Codex subagents](https://developers.openai.com/codex/subagents/). 실제 기능은 설치 버전과 실행 환경을 기준으로 판단한다.

## Claude Code

- 일반 subagent와 Agent Teams를 구분한다. 현재 도구가 이름을 가진 subagent와 `SendMessage`를 지원하면 팀 기능 없이도 관련 담당에게 메시지를 전달할 수 있다.
- Agent Teams가 이미 활성화됐고 현재 실행 모드에서 지원되면 teammate 간 메시징을 사용한다. Teams를 사용하기 위해 스킬이 실험 설정을 임의로 켜지 않는다.
- 이름을 지정한 호출이 일반 subagent인지 teammate인지 실제 실행 결과에서 확인한다. 등록된 역할 이름과 생성된 담당 ID를 혼동하지 않는다.
- 부모의 대화나 읽은 스킬이 전달됐다고 가정하지 않는다. 특히 teammate에는 agent 정의의 `skills` 필드가 적용된다고 가정하지 말고, 역할 지침과 반드시 읽을 경로를 위임 메시지로 전달한다.
- 수신자가 유효한지 확인하고, 재개 뒤 이전 teammate가 없으면 조율자가 보존한 범위·계약·증거로 필요한 담당만 다시 배정한다. 과거 이름만으로 메시지 전달이나 작업 재개가 성공했다고 보고하지 않는다.
- 자동 작업 상태나 계획 승인 알림을 사용자 결과의 수용·검증 증거로 사용하지 않는다. 전체 완료 판정은 공통 협업 절차를 따른다.

공식 근거: [Subagents](https://code.claude.com/docs/en/sub-agents), [Agent Teams](https://code.claude.com/docs/en/agent-teams). Teams의 interactive 실행 조건과 재개 제한 등은 사용 시 현재 문서·도구에서 확인한다. 지원되지 않는 모드에서는 가능한 일반 subagent 또는 부모 중계 방식을 사용한다.
