# 패키지 릴리즈 가이드

이 문서는 SEED Design의 현재 패키지 릴리즈 운영 방법을 설명한다. 일상 개발자는 Changeset을 포함한 일반 PR만 만들면 되고, 릴리즈 브랜치 동기화와 게시 준비는 GitHub Actions가 담당한다.

현재 변경의 감사 결과와 검증 증거는 [릴리즈 파이프라인 구현 리뷰](./RELEASE-PIPELINE-REVIEW.md)를, 내부 구조와 보안 경계는 [저장소 기술 문서](./TECH.md)와 [Release Automation 기술 문서](./tools/release-automation/TECH.md)를 참고한다.

## 1. 5분 개요

현재 운영하는 릴리즈 라인은 세 개다.

| 브랜치 | 용도 | 버전 증가 | npm dist-tag |
| --- | --- | --- | --- |
| `dev` | 일상 개발과 stable 릴리즈 | patch | `latest` |
| `minor` | 다음 minor 버전의 사전 릴리즈 | minor | `beta` |
| `major` | 다음 major 버전의 사전 릴리즈 | major | `beta` |

```text
일반 PR
   |
   v
  dev  ------> minor
   |              |
   +----------> major
                  ^
                  |
                minor
```

- 모든 일반 변경은 `dev`로 보낸다.
- `dev`에 merge된 변경은 자동으로 `minor`와 `major`에 순서대로 동기화된다.
- `minor`에 추가된 변경은 `major`에도 동기화된다.
- 각 브랜치에는 별도의 Version Packages PR이 열린다.
- Version Packages PR은 사람이 검토하고 merge해야 실제 게시가 시작된다.

`minor`와 `major`는 현재 항상 `beta`다. stable 패키지는 `dev`에서만 게시한다.

두 prerelease lane이 npm의 같은 `beta` dist-tag를 사용하므로 마지막으로 게시된 lane version이 `beta`를 가리킨다. 검토와 소비에서는 tag 이름만 보지 말고 package의 exact version과 대상 lane을 함께 확인한다.

## 2. 일상 개발자가 할 일

일상적인 변경에는 다음 네 단계만 필요하다.

1. `dev`에서 작업 브랜치를 만든다.
2. 변경한 패키지의 Changeset을 추가한다.
3. 변경 경로의 테스트와 생성을 실행한다.
4. base가 `dev`인 일반 PR을 만들고 평소와 같이 리뷰받아 merge한다.

Changeset은 저장소 루트에서 만든다.

```sh
bun changeset
```

현재 `dev` 정책은 stable patch이므로 일반 변경의 bump는 `patch`를 선택한다. 자동 동기화가 같은 변경을 `minor`와 `major` 정책에 맞게 정규화한다.

PR을 올리기 전에는 변경한 패키지의 전용 테스트와 다음 생성을 실행한다.

```sh
bun generate:all
```

일상 개발자는 다음 작업을 하지 않는다.

- `minor` 또는 `major`에 직접 PR을 만들거나 push하기
- bot이 만든 동기화 PR이나 Version Packages PR을 직접 수정하기
- package version, changelog 또는 Changesets 사전 릴리즈 상태를 손으로 고치기
- 로컬에서 production publish 또는 tag push 실행하기

## 3. PR merge 뒤의 자동 흐름

일반 PR이 `dev`에 merge되면 다음 과정이 자동으로 이어진다.

1. **동기화**

   Release lane synchronization이 source PR을 FIFO 순서로 `minor`와 `major`에 반영한다. 자동 생성 PR은 현재 head에서 검증된 뒤 merge된다.

2. **Version Packages PR**

   변경이 쌓인 각 브랜치에 `changeset-release/<lane>` PR이 열리거나 갱신된다. 이 PR에는 게시될 version과 changelog가 들어 있다.

3. **사람의 승인**

   담당자가 Version Packages PR을 검토하고 직접 merge한다. bot merge는 게시 승인으로 인정되지 않는다.

4. **게시**

   Release publish가 승인된 항목을 오래된 순서대로 처리한다. npm package, package Git tag, 필요한 Rootage artifact를 일치시키고 완료 상태를 기록한다.

5. **알림**

   production 게시가 완료되면 Release Notification이 changelog를 바탕으로 알림을 보낸다. 알림 실패는 이미 성공한 package 게시를 되돌리지 않는다.

### Version Packages PR 검토 체크리스트

- 작성자가 `github-actions[bot]`인가?
- base가 의도한 `dev`, `minor`, `major` 중 하나인가?
- head가 정확히 `changeset-release/<base>`인가?
- version과 changelog가 실제 변경에 맞는가?
- 현재 PR head에서 `Validate release lane`이 성공했는가?
- 게시되어서는 안 되는 package나 예상하지 못한 파일이 포함되지 않았는가?

검토가 끝나면 사람이 merge한다. 게시 완료 여부는 PR 댓글이 아니라 merge commit의 `seed-release/publish` status로 판단한다.

## 4. 현재 구조의 첫 dry-run 롤아웃

현재 `dev`의 `control.json`은 기존 운영 상태인 `production`을 유지한다. 이 대규모 구조 변경과 운영 mode 변경을 같은 PR에 섞지 않고, 새 trusted validator가 `dev`에 들어온 뒤 별도 activation PR로 전환한다.

이 절은 **이미 세 lane을 운영 중인 현재 저장소**를 위한 절차다. 새 환경을 처음 만드는 경우에는 이 절 대신 5절을 사용한다.

### A. Maintenance window와 구조 변경

1. 현재 closed Version Packages PR, merge SHA, `seed-release/publish` receipt를 대조해 publish queue의 예상 항목을 기록한다. 설명할 수 없는 미처리 항목이 있으면 먼저 원인을 확인한다.
2. GitHub Actions에서 **Release publish** workflow를 disable하고, 실행 중이거나 queued인 Release publish run을 모두 취소한 뒤 종료될 때까지 기다린다. Workflow disable만으로 이미 승인된 production run은 멈추지 않는다.
3. active·queued Release publish run이 0개임을 확인한 뒤 이 구조 변경 PR을 `dev`에 merge한다. 이 첫 PR에는 현재 dev validator가 호출할 수 있는 임시 `scripts/release/cli.ts` 호환 entrypoint가 포함된다.
4. 새 **Release automation activation**과 **Release lane PR validation** workflow가 `dev`에 반영됐는지 확인한다.

### B. dry-run canary

1. `dev` ref에서 **Release automation activation**의 `enable-dry-run`을 실행한다.
2. 생성된 activation PR이 `.github/release/control.json`의 `mode`만 `production`에서 `dry-run`으로 바꾸는지 확인한다. 기존 마이그레이션 필드인 `freeze: null`이 함께 제거되는 것은 정상이다.
3. activation PR의 현재 head에서 **새 dev validator가 기록한** `Validate release lane`이 성공한 뒤 사람이 merge한다.
4. `dev`의 `control.json`이 `dry-run`이고 active production publish run이 0개인지 확인한 다음 **Release publish** workflow를 다시 enable한다.
5. 작은 테스트 Changeset 하나를 `dev`에 merge하고 `minor`·`major` sync가 완료될 때까지 기다린다.
6. 세 lane의 Version Packages PR을 각각 current-head check와 diff를 검토한 뒤 사람이 merge한다. 각 merge마다 `seed-release/publish` description이 `:dry-run`으로 끝나고 npm version, Git tag, Rootage production object가 생성되지 않았는지 확인한다.
7. 새 validator가 실제 PR에서 성공한 증거를 확보했으므로, 임시 `scripts/release/cli.ts`와 legacy validation module/test만 제거하는 후속 PR을 만들고 새 validator로 검증해 merge한다.

dry-run receipt는 해당 Version Packages merge의 terminal 처리 기록이다. 나중에 production으로 바꿔도 같은 version을 다시 게시하지 않으므로, production live 검증에는 반드시 새 Changeset을 사용한다.

### C. 선택적 production 전환

1. dry-run 기록, registry·tag·Rootage 상태, environment와 npm trusted publisher 설정을 검토해 별도의 go/no-go 결정을 내린다.
2. go인 경우에만 `enable-production` activation PR을 만들고 exact 상태 전이와 required check를 검토해 merge한다.
3. **새** 작은 Changeset으로 production canary를 진행하고 npm, tag, Rootage, durable production receipt를 순서대로 확인한다.

`enable-dry-run`은 새로 authorize되는 publish를 검증 전용으로 바꾸며, 이미 실행 중인 production run을 취소하는 긴급 kill switch는 아니다. Sync activation과 Rootage readiness는 초기화하지 않으므로 production으로 돌아갈 때 bootstrap이나 `enable-sync`를 다시 실행하지 않는다.

## 5. 최초 1회 설정

이 절차는 새 저장소 환경에서 `minor`와 `major`를 처음 만들 때만 수행한다. 이미 운영 중인 브랜치를 초기화하거나 덮어쓰는 용도로 사용하지 않는다.

현재 저장소처럼 이미 세 lane이 있는 환경에는 이 절을 사용하지 않고 4절의 migration 절차를 따른다.

### 사전 조건

- 저장소를 처음 provision할 때 `.github/release/control.json`은 `mode: "dry-run"`, `rootageContractReady: false`이고 `.github/release/lanes.json`의 `sync.activation`은 `null`이어야 한다. 이는 기존 production 저장소를 되돌리는 activation 작업이 아니라 최초 baseline 설정이다.
- `dev`가 stable 상태이고 미처리 Changeset과 열린 `dev` Version Packages PR이 없다.
- Rootage 게시 계약과 production 환경 설정이 준비되어 있다.
- `npm-production` GitHub environment는 보호된 `dev`만 허용하고 필요한 reviewer를 요구한다.
- npm trusted publisher도 같은 `npm-production` environment에 연결되어 있다.
- bootstrap용 token과 branch protection을 설정할 관리자가 준비되어 있다.

### 실행 순서

1. 위의 dry-run·Rootage 미준비·sync 비활성 baseline을 확인한 뒤, `dev` ref에서 **Release automation activation**을 열고 `enable-rootage-contract`를 실행한다.
2. 생성된 activation PR을 검토하고 merge한다.
3. 일반 PR merge를 잠시 멈추고 `dev` ref에서 **Release lanes bootstrap**을 한 번 실행한다.
4. workflow가 만든 `minor`와 `major` 브랜치에 다음 보호 규칙을 설정한다.

   - merge 전에 최신 base 반영 요구
   - required check로 `Validate release lane` 요구
   - 대화 해결 요구
   - force push와 branch 삭제 차단

5. 자동 생성된 `minor`와 `major` bootstrap PR이 각각 `beta` 상태만 추가하는지 확인하고 merge한다.
6. `dev` ref에서 **Release automation activation**의 `enable-sync`를 실행하고 생성된 PR을 merge한다.
7. `bun release:verify`와 Release automation E2E가 통과하는지 확인한다.
8. 작은 테스트 Changeset 하나로 `dev` → `minor`/`major` sync를 확인하고 세 Version Packages PR을 검토·merge해 dry-run receipt와 외부 write 0건을 확인한다.
9. 외부 environment와 npm trusted publisher 설정을 다시 확인하고 별도 go 결정을 내린 뒤 `enable-production`을 실행해 생성된 PR을 merge한다.
10. **새** 테스트 Changeset으로 production Version Packages PR을 검토·merge하고 npm, tag, Rootage와 production receipt를 확인한다.

bootstrap이 기존 브랜치 또는 변경된 baseline을 발견해 실패하면 강제로 재실행하지 않는다. 현재 `dev`, `minor`, `major`의 SHA와 Changesets 상태를 먼저 확인한다.

## 6. 로컬 검증

저장소 루트에서 다음 두 명령을 사용한다.

```sh
bun release:doctor
bun release:verify
```

### `bun release:doctor`

설정, Bun 버전, Git branch와 ref, upstream 차이, worktree 상태를 빠르게 진단한다.

- `ready`: 로컬 기준으로 진행 가능
- `warning`: 내용을 확인하고 설명할 수 있어야 함
- `error`: 다음 릴리즈 작업 전에 해결해야 함

credential이나 production write는 사용하지 않는다. 평소에는 먼저 이 명령을 실행한다.

### `bun release:verify`

CI와 같은 build, generate, test, package dry-run을 실행하고 검증 전후 source 상태가 달라지지 않았는지 확인한다. 릴리즈 자동화나 Rootage 관련 코드를 바꿨을 때 반드시 실행한다.

이 명령도 production에는 쓰지 않지만 저장소의 build와 test 코드는 실행한다. production credential을 export하지 않은 검토된 worktree에서 사용한다.

`--skip-setup`은 의존성 준비가 끝난 CI용 옵션이다. 일반 로컬 검증에서는 사용하지 않는다.

도구의 소스와 추가 개발 명령은 [`tools/release-automation`](./tools/release-automation/README.md)에 정리되어 있다.

## 7. GitHub workflow

| 표시 이름 | 파일 | 실행 시점 | 역할 |
| --- | --- | --- | --- |
| Release lanes bootstrap | [`release-bootstrap.yml`](./.github/workflows/release-bootstrap.yml) | 최초 1회, `dev`에서 수동 | `minor`와 `major`를 같은 baseline에서 만들고 beta 설정 PR 생성 |
| Release automation activation | [`release-activation.yml`](./.github/workflows/release-activation.yml) | 최초 설정 또는 mode 전환 시 `dev`에서 수동 | Rootage 계약, 동기화, dry-run·production mode의 exact 상태 전이 PR 생성 |
| Release lane synchronization | [`release-sync.yml`](./.github/workflows/release-sync.yml) | PR merge, 주기 실행, `dev` 수동 복구 | FIFO 동기화 PR 생성, 재검증, merge, blocker 알림 |
| Release lane PR validation | [`release-pr-validation.yml`](./.github/workflows/release-pr-validation.yml) | 릴리즈 브랜치 PR 변경 시 자동 | 현재 PR head를 검증하고 `Validate release lane` status 기록 |
| Release Version PR | [`release-packages.yml`](./.github/workflows/release-packages.yml) | branch 변경, 주기 실행, `dev` 수동 복구 | 브랜치별 Version Packages PR 생성 또는 갱신 |
| Release publish | [`release-publish.yml`](./.github/workflows/release-publish.yml) | Version Packages PR merge, 주기 실행, `dev` 수동 복구 | 승인된 package 게시, tag와 Rootage 반영, 완료 status 기록 |
| Release Notification | [`release-notification.yml`](./.github/workflows/release-notification.yml) | 성공한 publish가 내부 호출 | 게시 결과를 다시 확인한 뒤 changelog 알림 전송 |
| Release automation E2E | [`release-e2e.yml`](./.github/workflows/release-e2e.yml) | 자동화 관련 PR, 필요 시 수동 | production write 없이 `bun release:verify` 실행 |

수동 복구 workflow는 항상 `dev` ref에서 실행한다. Release Notification은 publish가 전달한 검증된 입력을 사용하므로 사람이 직접 시작하지 않는다.

## 8. 실패 복구

먼저 다음 정보를 기록한다.

- 실패한 workflow와 run URL
- 대상 브랜치와 PR 번호
- 현재 PR head SHA
- 마지막으로 성공한 required check
- merge commit의 `seed-release/publish` status
- `bun release:doctor` 결과

### 동기화 PR이 멈춤

1. **Release lane synchronization**의 실패 job과 blocker 댓글을 확인한다.
2. bot PR에 직접 commit하거나 marker를 고치지 않는다.
3. 일시적인 검증 실패이고 head가 바뀌지 않았다면 실패한 run을 다시 실행한다.
4. queue 처리가 누락되었으면 `dev` ref에서 Release lane synchronization의 `drain`을 실행한다.
5. blocker를 다시 수집하려면 같은 workflow의 `alert`를 실행한다.

자동으로 해결할 수 없는 충돌은 target 브랜치에 별도의 일반 PR로 해결한다. 그 PR을 merge한 뒤 source PR에 다음 maintainer 명령을 남기고 기존 draft sync PR을 닫는다.

```text
/release-sync skip target=<minor|major> reason=manual-conflict-resolution evidence=#<target-PR>
```

### Version Packages PR이 없거나 오래됨

1. 기존 PR의 base, head와 현재 branch SHA를 비교한다.
2. bot PR을 직접 수정하거나 branch를 강제 push하지 않는다.
3. `dev` ref에서 **Release Version PR**을 실행하고 `all` 또는 필요한 정확한 lane을 선택한다.
4. 새 head에서 `Validate release lane`이 성공한 뒤 다시 검토한다.

### 릴리즈 PR 검증이 실패함

1. PR head가 실패한 run 이후 바뀌었는지 확인한다.
2. head가 같으면 실패한 run을 재실행한다.
3. head가 달라졌거나 자동 생성 PR의 provenance가 오래되었으면 기존 PR을 닫고 해당 생성 workflow로 새 PR을 만든다.
4. status나 PR body를 사람이 복사해 성공처럼 보이게 만들지 않는다.

### publish가 중간에 실패함

1. npm, Git tag, Rootage 중 어디까지 완료됐는지 Release publish summary에서 확인한다.
2. `dev` ref에서 **Release publish**를 다시 실행한다.
3. 재실행은 이미 일치하는 결과를 확인하고 누락된 단계만 이어간다.
4. 기존 tag가 다른 commit을 가리키거나 npm 결과가 승인 merge와 다르면 자동 수정하지 말고 릴리즈 담당자에게 escalation한다.

로컬 publish, raw registry publish, 강제 tag 변경으로 복구하지 않는다.

### 알림만 실패함

`seed-release/publish` status가 성공이면 package 릴리즈는 완료된 것이다. 알림 실패 때문에 Version Packages PR을 다시 merge하거나 package를 다시 게시하지 않는다. publish run과 notification run URL을 릴리즈 담당자에게 전달해 신뢰된 publish 기록에서 알림만 다시 요청한다.

### 최초 설정이 실패함

- baseline이 바뀌었다면 일반 PR merge를 계속 멈추고 세 브랜치의 exact SHA를 확인한다.
- 이미 존재하는 `minor` 또는 `major`를 삭제하거나 덮어쓰지 않는다.
- 두 bootstrap PR이 모두 merge되기 전에는 동기화를 활성화하지 않는다.
- 외부 environment, npm trusted publisher 또는 branch protection을 확인하지 못했다면 production을 활성화하지 않는다.

## 9. 현재 지원하지 않는 범위

다음 기능은 현재 구현되어 있지 않으며 대응하는 운영 workflow도 없다.

- `minor` 또는 `major`의 stable 승격
- `beta`에서 `rc`, `alpha` 또는 stable로 바꾸는 사전 릴리즈 상태 전환
- `dev` 이외 브랜치에서 stable package를 게시하는 흐름
- 임의의 dist-tag나 별도 장기 릴리즈 라인
- 자동화 PR의 의미 충돌을 사람이 같은 PR에서 직접 해결하는 흐름
- npm에 게시된 버전의 자동 삭제 또는 덮어쓰기

따라서 현재 stable 소비자는 항상 `latest`를 가리키는 `dev` patch 릴리즈를 사용한다. `minor`와 `major`는 `beta` 검증용으로만 운영한다.

지원 범위를 넓히려면 별도의 설계, 보안 검토, workflow 구현과 로컬 검증 계약이 먼저 필요하다.
