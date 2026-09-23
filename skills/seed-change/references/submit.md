# 변경 제출

사용자가 제출을 명시적으로 요청했을 때만 이 절차를 따른다. [변경 계획](impact-plan.md)의 `targetBranch`, `targetRef`, `prBase`를 하나의 계약으로 사용한다. 기준 브랜치는 읽기만 하고 현재 feature 브랜치만 바꾼다. 포함 파일·commit, push, PR 생성·base 변경은 각각 별도 승인 단위다. 앞 단계의 승인이 다음 단계의 승인이 되지 않는다.

## 1. 제출 전 상태 고정

1. 현재 브랜치, 작업 트리, feature HEAD, 현재 upstream을 기록한다.
2. 현재 브랜치가 `dev`, `minor`, `major`면 중단한다. 기준 브랜치에서 직접 제출하지 않는다.
3. `origin/dev`, `origin/minor`, `origin/major`를 가져온다.
4. 현재 feature 브랜치를 만든 기존 기준 브랜치와 분기 SHA를 확정한다. upstream, reflog, 세 기준 브랜치와의 fork point, 커밋 그래프를 함께 확인한다. 가장 가까운 merge base라는 이유만으로 고르거나 같은 SHA의 브랜치 이름을 합치지 않는다.
5. 기존 기준 브랜치를 `--base-ref`로 넘겨 `change-plan.ts`를 다시 실행한다. 최초 계획에서 확정한 `--lane`과 `--bump` 또는 `--no-release`도 그대로 넘긴다. `targetBranch`, `targetRef`, `prBase` 중 하나라도 `unknown`이거나 서로 다르면 리베이스하지 않는다.
6. 선택한 대상 기준 브랜치 이름과 SHA를 함께 기록한다. SHA가 같더라도 이름을 바꾸지 않는다.

기존 기준 브랜치가 하나로 확정되지 않거나, 분기 SHA 이후 목록에 현재 작업이 아닌 lane 커밋이 섞여 있으면 중단한다. `targetRef`는 옮겨 갈 기준이고 기존 분기 SHA인 `oldBase`는 옮길 커밋의 경계이므로 서로 다를 수 있다.

## 2. 커밋과 리베이스

커밋되지 않은 변경이 있으면 자동 stash와 `git rebase --autostash`를 쓰지 않는다. 현재 요청에서 포함 파일과 커밋이 명시 승인됐으면 그 범위만 stage·commit하고, 아니면 포함·제외 파일과 메시지를 보여주고 확인받는다. 커밋 메시지는 영어 Conventional Commits 형식을 사용한다.

리베이스 전에 `oldBase..HEAD`의 커밋 목록을 보여주어 현재 작업만 이동하는지 확인한다. target ref가 기록한 SHA에서 움직이지 않았는지도 다시 확인한다. feature 커밋에 merge commit이 있으면 보존 방식을 임의로 정하지 않고 중단한다.

확인한 feature 브랜치에서 다음 명령으로 기존 기준 뒤의 커밋만 새 기준으로 옮긴다.

```bash
git rebase --onto <targetRef> <oldBase>
```

단순 `git rebase <targetRef>`는 사용하지 않는다. 서로 갈라진 release lane 사이에서 기존 lane 커밋까지 재생할 수 있기 때문이다. `dev`, `minor`, `major` 로컬 브랜치로 전환하거나 그 브랜치를 수정하지 않는다.

충돌이 나면 양쪽 파일과 기준 브랜치의 의도를 직접 읽는다. 현재 작업 범위 안에서 확실히 해결할 수 있는 충돌만 처리한다. 근거가 부족하면 `git rebase --abort`로 원래 상태를 복구하고 멈춘다.

## 3. 재검증

리베이스가 끝나면 `targetRef`가 새 HEAD의 ancestor인지 확인하고, 옮겨진 커밋 목록이 리베이스 전 feature 커밋과 대응하는지 대조한다. 그다음 최초 계획에서 확정한 옵션은 유지하고 `--base-ref`만 `targetRef`로 바꿔 다시 실행한다.

```bash
bun skills/seed-change/scripts/change-plan.ts --base-ref <targetRef> --lane <minor|major|none> --bump <patch|minor|major>
bun skills/seed-change/scripts/change-plan.ts --base-ref <targetRef> --lane <minor|major|none> --no-release
```

`--bump`와 `--no-release` 중 최초에 확정한 하나만 사용한다. 최초 계획에서 `--lane`을 확정하지 않았다면 새 값을 임의로 추가하지 않는다. 계획이 제안한 생성, 집중 테스트, build, 수동 검증을 순서대로 실행한다. 실패나 새로운 `unknown`을 성공으로 보고하지 않는다.

## 4. push

push가 현재 요청에서 명시 승인되지 않았다면 push 직전에 확인을 받는다.

- 원격 feature 브랜치가 없으면 일반 push를 사용한다.
- 원격 브랜치가 있고 리베이스로 SHA가 바뀌었으면 원격 SHA를 다시 읽는다. 사용자가 확인한 뒤 아래처럼 정확한 ref와 예상 SHA를 지정한다.

  ```bash
  git push --force-with-lease=refs/heads/<feature>:<expected-remote-sha> origin HEAD:refs/heads/<feature>
  ```

원격 SHA가 예상값과 다르면 push하지 않고 최신 상태에서 다시 계획한다. `--force`나 예상 SHA가 없는 lease는 사용하지 않는다.

## 5. PR base

PR 생성 또는 기존 PR base 변경이 현재 요청에서 명시 승인되지 않았다면 직전에 확인을 받는다. push 승인은 PR 승인이 아니다.

- 새 PR은 `gh pr create --base <prBase> --head <feature>`처럼 base와 head를 명시한다.
- 기존 PR의 base가 다르면 리베이스와 검증을 먼저 끝낸 뒤 `gh pr edit --base <prBase>`로 바꾼다.
- PR 제목은 영어 Conventional Commits 형식을 사용한다.

완료 뒤 PR의 `baseRefName`, `headRefName`, head SHA를 다시 읽는다. 작업 전후 feature SHA, 기준 브랜치 이름과 SHA, 검증 결과, 실제 PR base를 함께 보고한다.
