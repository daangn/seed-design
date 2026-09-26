# 하네스별 실행

현재 세션에 노출된 도구와 권한을 먼저 확인하고 해당 하네스 절만 따른다. 아래 도구 이름은 기능을 찾는 기준이다. 실제 호출 인자는 현재 schema를 따른다. 역할을 기존 일반 작성·조사·리뷰 에이전트에 위임할 수 있으면 영구 에이전트 설정을 추가하지 않는다.

## 공통 선택

1. 사용자가 OMP·Orca 등 실행 방식을 명시하면 그것을 따른다. 명시가 없으면 현재 하네스의 내장 위임·메시징 도구를 쓴다. 병렬 작업·조율·검증 요청을 Orca 선택으로 해석하지 않는다.
2. OMP에서는 `task`·`hub` 또는 현재 주입된 workflow 계약의 `eval` 도구가 기본이다. Orca가 설치·실행 중이어도 기본값은 바뀌지 않는다. Orca는 사용자가 실행 방식으로 골랐거나 이미 승인한 Orca 작업을 이어갈 때만 쓴다.
3. 다른 하네스도 기존 에이전트 생성·후속 지시·결과 수집 기능을 쓴다. 담당끼리 직접 메시지를 보낼 수 있으면 직접 교환하고, 없으면 조율자가 중계한다.
4. 명시한 실행 방식을 쓸 수 없으면 제약을 보고한다. 다른 방식으로 수행해 놓고 명시한 방식이었다고 보고하지 않는다.
5. 에이전트 실행 자체가 없으면 협업이 가능한 척하지 않는다. 협업이 필수인 요청은 제약을 보고하고, 그 밖에는 단독 흐름으로 처리했다고 밝힌다.

실험 기능 활성화, 하네스 설치·설정 변경, 외부 작업은 기존 승인 범위를 따른다. 하네스의 완료 상태는 작업 수명일 뿐이다 → 기본 장면과 최종 검증 결과는 [검증 분담과 자원](collaboration.md#검증-분담과-자원)에 따라 별도로 회수하고, 조율자가 승인 조건·화면 증거와 대조해 승인한다.

## Orca

Orca를 실행 방식으로 고른 경우에만 이 절을 쓴다. 선택한 실행 파일의 버전 일치 가이드를 읽고 런타임의 `ready` 상태와 orchestration capability를 확인한다.

```bash
orca skills get orchestration
orca status --json
```

감독형 작업의 기본 흐름:

```text
run-create
  → task-create (독립 작업 전체)
  → worker-start (각 작업자)
  → orchestration check --wait
  → ask/reply 또는 decision gate 처리
  → worker_done 회수
  → worker-release 또는 후속 Dispatch
```

- 가능하면 `worker-start` composition을 쓴다. 기존 terminal에 dispatch할 때만 `dispatch --inject`를 쓴다.
- 작업자에게 Orca가 주입한 현재 Dispatch preamble을 보존하게 하고 `worker_done`, `heartbeat`, `ask`, `escalation` 규칙을 따르게 한다.
- 조율자는 `task-list --ready`, `dispatch-show`, `check --wait --types worker_done,escalation,question`으로 상태를 본다. 고정 sleep, 출력 추측, 완료 전 release를 쓰지 않는다.
- 작업자 간 의견 교환은 `orchestration send`와 `ask/reply`로 한다. 결정이 필요한 계약은 `gate-create`로 추적하고, 일반 질문은 `ask`로 처리한다.
- 입력·생성물·자원이 독립한 작업은 함께 Dispatch한다. 기본 장면 검증에 의존하는 확장은 통과 뒤 시작한다.
- `worker_done` 뒤에는 같은 terminal에 후속 Dispatch를 할지 `worker-release`할지 명시적으로 정한다. 종료 신호를 받으려고 실패·차단을 숨기거나 성공으로 바꾸지 않는다.
- Orca Task·Dispatch를 만들지 않고 OMP `task`나 일반 subagent를 실행했다면 Orca orchestration으로 수행했다고 보고하지 않는다.

전체 명령, 실행 파일 선택, legacy recovery, full handoff 경계는 설치된 Orca의 `orca skills get orchestration` 결과를 따른다.

## OMP

OMP에는 standalone lowercase `orchestrate` magic keyword가 있다. 사용자 프롬프트에 이 단어가 있고 `magicKeywords.enabled`와 `magicKeywords.orchestrate`가 켜져 있으면 OMP가 그 턴에 내장 multi-agent orchestration contract를 주입한다.

- Skill 호출로는 이 hidden notice를 소급하거나 다시 발동할 수 없다. Skill 이름에 든 문자열도 키워드 발동이 아니다.
- contract가 주입됐으면 그것을 기본 계약으로 삼고, 이 Skill의 SEED 파일 소유권·API 계약·상호 리뷰 규칙을 더한다.
- 공지가 없어도 OMP 세션에서는 OMP 내장 도구와 이 Skill의 협업 절차를 쓴다. 공지가 없다고 Orca로 전환하지 않는다.

진행:

- 독립 작업은 현재 `task` schema의 배치로 실행한다. 공통 맥락은 `context`의 Goal·Constraints·Contract에 넣고, 역할별 목표·파일·변경·완료 조건은 각 작업에 넣는다. 공통 맥락에는 상대 담당 이름, 실제 메시지 대상, [협업 체크포인트](collaboration.md#3-1-계약-검토와-결과-승인)를 함께 넣는다.
- Rootage·Recipe 같은 역할명을 등록된 에이전트 타입으로 가정하지 않는다 → 실제 제공되는 작성·조사·리뷰 타입을 고르고 역할 지침을 작업 내용으로 전달한다.
- `task` 반환값에서 실제 ID를 확인한다. 조율자는 관련 담당의 ID를 서로 알려 주고 `hub`의 `send`로 의견과 후속 작업을 전달한다. `PROPOSE`와 `ACK`·`CONFLICT`는 변경되는 계약·미확인 가정에만 요구한다.
- 결과 알림을 받기 전에 성공을 추정하지 않는다. 소비 경계 리뷰, 독립 실행 검증, 조율자의 최종 승인은 각각 별도 판정으로 회수한다. `REVIEW_REQUEST_CHANGES`는 원천 담당에게 돌려보낸다. 순환적인 상호 완료 대기를 만들지 않고, 기다리는 동안 독립적인 일을 진행한다.
- 공유 산출물은 기본 산출물 경로와 `agent://` 등을 쓴다. 다른 담당의 세션 파일을 뒤져 진행 상태를 추측하지 않는다 → `hub`로 직접 묻는다.
- 서버는 지정 실행 소유자가 `hub`의 process 기능으로 관리한다. 에이전트 메시지 대상과 프로세스 이름을 혼동하지 않는다.

기능 설명: [Task](omp://tools/task.md), [Hub](omp://tools/hub.md). 이 URI는 OMP에서만 쓴다. 배치·메시징·격리 옵션은 세션마다 다를 수 있으므로 문서 예제보다 현재 schema를 따른다.

## Codex

- 현재 제공되는 subagent 도구로 담당을 실행하고 후속 지시와 결과를 수집한다. 도구 이름·옵션은 현재 세션에서 확인하고 특정 버전의 이름을 강제하지 않는다.
- 직접 peer 통신과 실제 수신자 ID가 있으면 그것을 쓴다. 부모-자식 통신만 가능하면 조율자가 쟁점·근거·답변을 전달한다. 한 방향으로 결과 요약만 받은 것을 상호 협의로 취급하지 않는다.
- custom agent 설정이 없어도 역할을 위임 내용에 담는다. 현재 작업만을 위해 config나 영구 agent 파일을 자동 생성하지 않는다.
- 공유 작업 경로, 정확한 쓰기 범위, 검증별 안정된 변경본·필요한 생성물·공유 자원 소유자를 전달한다.
- 격리 기능을 썼어도 통합 담당이 실제 반영 결과를 확인한 뒤, 각 검사는 필요한 입력이 준비된 시점에만 시작한다. 최종 승인은 조율자가 독립 검증 결과를 대조해 한다.

공식 근거: [Codex subagents](https://developers.openai.com/codex/subagents/). 실제 기능은 설치 버전과 실행 환경으로 판단한다.

## Claude Code

- 일반 subagent와 Agent Teams를 구분한다. 현재 도구가 이름 있는 subagent와 `SendMessage`를 지원하면 Teams 없이도 관련 담당에게 메시지를 보낼 수 있다.
- Agent Teams가 이미 켜져 있고 현재 실행 모드에서 지원되면 teammate 간 메시징을 쓴다. Teams를 쓰려고 실험 설정을 임의로 켜지 않는다 → 사용자에게 묻거나 일반 subagent·부모 중계로 진행한다.
- 이름을 지정한 호출이 일반 subagent인지 teammate인지 실제 실행 결과로 확인한다. 등록된 역할 이름과 생성된 담당 ID를 혼동하지 않는다.
- 부모의 대화나 읽은 Skill이 전달됐다고 가정하지 않는다. 특히 teammate에 agent 정의의 `skills` 필드가 적용된다고 가정하지 말고, 역할 지침과 반드시 읽을 경로를 위임 메시지에 넣는다.
- 수신자가 유효한지 확인한다. 재개 뒤 이전 teammate가 없으면 조율자가 보존한 범위·계약·증거로 필요한 담당만 다시 배정한다. 과거 이름만으로 메시지 전달이나 재개가 성공했다고 보고하지 않는다.
- 자동 작업 상태나 계획 승인 알림을 사용자 결과의 수용·검증 증거로 쓰지 않는다. 전체 완료 판정은 [협업 절차](collaboration.md#6-변경과-완료-판정)를 따른다.

공식 근거: [Subagents](https://code.claude.com/docs/en/sub-agents), [Agent Teams](https://code.claude.com/docs/en/agent-teams). Teams의 interactive 실행 조건과 재개 제한은 쓸 때 현재 문서·도구에서 확인한다. 지원되지 않는 모드에서는 일반 subagent 또는 부모 중계를 쓴다.
