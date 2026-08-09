# 릴리즈 파이프라인 구현 리뷰

작성일: 2026-08-10
대상: `dev` / `minor` / `major` package release와 Rootage CDN
상태: 로컬 구현과 회귀 검증 완료, live rollout 미실행

## 1. 최종 결론

현재 작업 트리는 처음부터 모든 승격 시나리오를 자동화하는 대신, 다음 최소 운영 범위에 집중한다.

| branch | 지원하는 버전 | npm dist-tag |
| --- | --- | --- |
| `dev` | patch stable | `latest` |
| `minor` | minor beta | `beta` |
| `major` | major beta | `beta` |

일상 사용자는 changeset이 포함된 일반 `dev` PR만 만든다. 이후의 lane 동기화, Version Packages PR 생성, 사람 승인, npm·Git tag·Rootage 게시와 알림은 자동화가 담당한다.

`minor`·`major`의 stable 승격과 prerelease 상태 전환은 이번 범위에서 제거했다. 해당 기능을 위한 workflow, marker, state, queue 분기와 구현도 함께 제거했으므로 “보이지 않지만 동작하는 기능”은 남기지 않았다.

로컬 최종 판정은 다음과 같다.

- release automation test: **161 passed, 0 failed, 996 assertions**
- Rootage CDN test: **75 passed, 0 failed, 239 assertions**
- 두 private workspace typecheck: 통과
- `bun generate:all`: 통과, 추가 source diff 없음
- `bun release:verify`: **15/15 통과**, 검증 전후 source snapshot 동일
- `bun release:doctor`: **9 pass, 4 warning, 0 error**
- 최종 handoff용 로컬 commit만 생성; push, workflow dispatch, npm·Git tag·Cloudflare/R2 production mutation은 수행하지 않음

따라서 현재 코드는 리뷰 가능한 상태지만, GitHub branch protection, environment, npm trusted publisher와 실제 queue를 확인하는 live rollout은 별도 단계다.

## 2. 무엇을 줄였는가

### Workflow

release workflow는 12개에서 8개로 줄었다.

- stable promotion workflow 제거
- prerelease transition workflow 제거
- sync drain, trusted merge, blocker alert의 세 workflow를 `release-sync.yml` 하나로 통합

남은 8개는 단순 단계 나누기가 아니라 서로 다른 trigger 또는 권한 경계다.

| workflow | 사람이 이해할 책임 | 분리 이유 |
| --- | --- | --- |
| `release-bootstrap.yml` | 최초 lane 생성 | 전용 bootstrap token과 one-time 절차 |
| `release-activation.yml` | Rootage, sync, dry-run·production mode 전환 | 운영 state PR만 생성 |
| `release-sync.yml` | FIFO drain, merge, blocker alert | 같은 sync 도메인은 job 권한으로 통합 가능 |
| `release-packages.yml` | Version Packages PR 생성 | tokenless planner와 Git writer 분리 |
| `release-pr-validation.yml` | generated PR exact-head 검증 | untrusted 실행과 status write job 격리 |
| `release-publish.yml` | npm, tag, Rootage, receipt | OIDC와 Git write를 job 단위로 분리 |
| `release-notification.yml` | 완료된 publish 알림 | Slack 실패가 publish 결과를 바꾸지 않도록 격리 |
| `release-e2e.yml` | 로컬과 같은 read-only gate | production credential과 분리 |

Publish, validation, notification을 더 합치면 파일 수는 줄지만 credential 또는 실패 의미가 섞인다. 현재 8개가 최소 안전 경계다.

### TypeScript

평면 `scripts/release`를 private workspace [`tools/release-automation`](./tools/release-automation)으로 옮겼다.

첫 구조 변경 PR만 현재 dev에 배포된 구 validator를 통과할 수 있도록 `scripts/release/cli.ts`에 좁은 호환 entrypoint를 남겼다. 일반 dev migration PR만 허용하고 generated PR, release state 변경과 Changeset 삭제는 거부한다. 새 validator가 실제 activation PR을 성공적으로 검증한 뒤 이 shim과 인접 legacy module/test를 제거하는 후속 PR이 rollout의 일부다.

| 구분 | 이전 | 현재 | 변화 |
| --- | ---: | ---: | ---: |
| non-test TypeScript | 42 files / 10,054 LOC | 39 files / 8,429 LOC | 3 files / 1,625 LOC 감소 |
| test TypeScript | 21 files / 6,695 LOC | 20 files / 5,933 LOC | 1 file / 762 LOC 감소 |

현재 non-test 수치에는 package의 38개 파일과 첫 rollout 뒤 제거할 5줄짜리 legacy shim 1개가 포함된다. 현재 구조는 다음과 같다.

```text
tools/release-automation/
├── README.md / TECH.md / AGENTS.md
├── package.json / tsconfig.json
├── bin/
│   └── control.ts
└── src/
    ├── core/        config, marker, GitHub와 status 공통 계약
    ├── setup/       bootstrap, activation
    ├── lane/        Version Packages read-plan과 trusted writer
    ├── sync/        FIFO, tree, worker, merge, alert
    ├── validation/  generated PR trusted validation
    ├── publish/     authorize, artifact, npm, tag, receipt, notification input
    ├── local/       doctor, verify, tarball dry-run
    └── workflows/   YAML 권한·trigger 계약 테스트
```

`tools/*`는 이 저장소에서 독립 실행·검증되는 private 도구를 두는 기존 관례다. 새 package도 `private: true`, `0.0.0`, ESM, 인접 `*.test.ts`, README/TECH/AGENTS 분리, 공개 `bin`/build 산출물 없음이라는 같은 형태를 따른다. Workspace와 lockfile에도 `@seed-design/release-automation`을 등록했다.

Rootage CDN은 별도 credential과 배포 수명주기를 가지므로 [`tools/rootage-cdn`](./tools/rootage-cdn)에 유지한다. Release package는 npm 게시 전에 Rootage archive 계약을 검증하고, 검증된 입력만 reusable Rootage workflow로 전달한다.

## 3. 현재 자동 흐름

```text
일반 dev PR + changeset
        |
        v
      dev merge
        |
        +---- FIFO sync ----> minor beta
        |                       |
        +--------------------> major beta
                                ^
                                |
                              minor

각 lane 변경
  -> tokenless Version plan
  -> trusted writer가 Version Packages PR 생성/갱신
  -> trusted dev validator가 exact head status 기록
  -> 사람이 Version Packages PR merge
  -> immutable package artifact build
  -> npm OIDC publish
  -> exact Git tag reconcile
  -> applicable Rootage publish
  -> durable publish status
  -> 별도 notification workflow
```

사람용 일상 절차와 장애 복구는 [RELEASING.md](./RELEASING.md)가 source of truth다. 구현 내부의 import와 권한 규칙은 [Release Automation TECH](./tools/release-automation/TECH.md)에 있다.

## 4. 핵심 신뢰·복구 계약

### Generated PR

- generated branch가 자기 validator를 제공하지 않는다.
- `dev` workflow가 bot, same-repository, exact ref/head SHA, marker와 current control SHA를 먼저 확인한다.
- sync source diff, target base, trusted `dev` control-plane overlay와 최종 Git tree를 재구성한다.
- status write job은 checkout이 없고, lane code를 실행하는 read-only job과 runner state를 공유하지 않는다.
- merge 직전에 current PR head/base/direct parent와 validation receipt를 다시 확인한다.

`control.json`의 `freeze`는 런타임 상태와 정책에서 제거했다. 다만 현재 `dev`에 남은 `freeze: null`을 구조 변경 PR에서 직접 고치지 않기 위해 parser와 schema가 이 값만 마이그레이션 입력으로 허용한다. 첫 `enable-dry-run` activation PR이 상태 파일을 다시 쓸 때 필드는 제거되며, non-null 값은 계속 거부한다.

### Version Packages

- lane lifecycle은 write credential이 없는 planner에서만 실행한다.
- writer는 trusted `dev` helper만 실행하고 lane code를 실행하지 않는다.
- exact base/control/tree/patch, package version, workspace dependency, `bun.lock`과 Rootage generated version을 재검증한다.
- `dev` stable과 `minor`·`major` beta만 허용한다. non-`dev` stable은 fail-closed다.

### Publish

- bot이 만든 same-repository exact Version Packages PR을 사람이 merge한 경우만 승인한다.
- npm OIDC job은 immutable tarball만 게시하고 source lifecycle을 실행하지 않는다.
- partial retry는 registry `gitHead`, artifact integrity와 requested dist-tag가 모두 일치하는 기존 version만 건너뛴다.
- 누락 Git tag는 승인 merge SHA에만 만들고, 다른 commit을 가리키는 tag는 덮어쓰지 않는다.
- PR 댓글이 아니라 exact merge commit의 durable status를 완료 source of truth로 사용한다.
- 알림 실패는 publish workflow 결론과 FIFO checkpoint를 무효화하지 않는다.

### Rootage

- immutable object와 completion manifest, stable pointer를 순서대로 기록한다.
- pointer CAS, Worker deploy, route POST/DELETE의 response loss를 current external state와 재조정한다.
- smoke 실패 시 자신이 만든 exact pointer ETag, Worker version, route ID/pattern만 보상한다.
- concurrent owner 변경을 발견하면 자동 rollback 대신 fail-closed한다.
- fixed production URL과 exact Worker version header를 함께 검증한다.

## 5. 요청한 PR 검토 결과

| PR | 검토한 역할 | 최종 판단과 반영 |
| --- | --- | --- |
| [#1926](https://github.com/daangn/seed-design/pull/1926) | multi-lane release core | lane/config/FIFO 기반은 유지했다. self-validation, stale head/base, FIFO liveness, write-token 실행 경계를 보강하고 promotion 분기는 제거했다. |
| [#1927](https://github.com/daangn/seed-design/pull/1927) | Rootage CDN | immutable object 모델은 유지했다. strict input, 공통 production lock, pointer/deploy/route ownership과 smoke/rollback을 보강했다. |
| [#1929](https://github.com/daangn/seed-design/pull/1929) | Storybook 인접 변경 | release core와 직접 결합하지 않았다. 최종 전체 저장소 테스트로 회귀를 확인했다. |
| [#1932](https://github.com/daangn/seed-design/pull/1932) | lane bootstrap | exact current `dev` baseline, config/pre-only tree, initialVersions, stale baseline과 enable-sync readiness를 검증한다. |
| [#1933](https://github.com/daangn/seed-design/pull/1933) | activation | boolean 변경만 신뢰하지 않고 bootstrap readiness와 허용된 exact state change를 PR validation에 결속했다. |
| [#1947](https://github.com/daangn/seed-design/pull/1947) | Lynx test 안정성 | release 전용 로직과 분리하고 최종 repository gate에서 함께 검증했다. |
| [#1948](https://github.com/daangn/seed-design/pull/1948) | publish trigger 격리 | strict event/ref, Version identity, human merger와 validation/publish receipt까지 확장했다. |
| [#1952](https://github.com/daangn/seed-design/pull/1952) | Version marker timing | 범용 markerless 호환은 historical replay를 열어 제거했다. 정상 흐름은 explicit exact marker를 요구하고, 이미 게시된 #1943/#1950/#1955만 exact one-time recovery allowlist로 격리했다. |
| [#1953](https://github.com/daangn/seed-design/pull/1953) | detached tag push | 새 tag push뿐 아니라 partial publish retry에서 누락 tag를 exact merge SHA로 reconcile하도록 확장했다. |

PR 감사에서 발견한 문제는 최신 작업 트리의 코드와 회귀 테스트 기준으로 닫았다. 이 문서는 실제 GitHub workflow run이나 production mutation이 성공했다는 증거가 아니라, merge 전 로컬 구현 리뷰다.

## 6. 로컬 검증 증거

### 통과

```text
bun --filter @seed-design/release-automation test
  161 pass / 0 fail / 996 assertions

bun --filter @seed-design/rootage-cdn test
  75 pass / 0 fail / 239 assertions

bun --filter @seed-design/release-automation typecheck
bun --filter @seed-design/rootage-cdn typecheck
bun generate:all
git diff --check
bun release:doctor
bun release:verify
```

`bun release:verify`는 다음 15단계를 모두 통과했다.

1. frozen dependency install
2. ecosystem build
3. workspace link refresh
4. package build
5. Rootage build
6. release/Rootage scenario tests
7. Biome
8. diff check
9. release automation typecheck
10. Rootage CDN typecheck
11. Wrangler dry-run
12. generate all
13. full repository tests
14. generate determinism recheck
15. actual package tarball dry-run

첫 기본 실행은 Codex sandbox가 Bun temp directory write를 차단해 1단계 전에 실패했다. 같은 명령을 승인된 sandbox 밖에서 다시 실행해 15/15가 통과했으므로 코드 실패로 분류하지 않았다.

Doctor의 4개 warning은 다음과 같이 설명된다.

- local Bun 1.3.12, CI 기준 1.3.13
- 현재 작업 branch가 release lane이 아님
- 현재 branch에 upstream이 없음
- 의도한 대규모 dirty worktree

### 별도 참고

`bun lint:knip`은 저장소 전역의 unused files 1,368건을 보고해 실패했다. 대부분 이번 release 범위 밖이며, 새 workspace entrypoint는 `knip.json`에 등록했다. 이 전역 결과는 이번 범위에서 정리하지 않았으므로 Knip을 최종 release gate에 포함하지 않았고 성공으로 보고하지 않는다.

## 7. 리뷰 권장 순서

1. [RELEASING.md](./RELEASING.md)에서 사람이 사용하는 흐름과 미지원 범위를 확인한다.
2. [Release Automation README](./tools/release-automation/README.md)와 [TECH](./tools/release-automation/TECH.md)에서 domain/workflow 경계를 확인한다.
3. `.github/release/lanes.json`, `control.json`과 schema에서 현재 정책과 state를 확인한다.
4. `src/core`, `src/lane/pull-policy.ts`, `src/validation`에서 generated PR trust root를 확인한다.
5. `src/sync`와 `release-sync.yml`에서 FIFO, current head/base/tree와 job permissions를 확인한다.
6. `src/publish`와 `release-publish.yml`에서 artifact, OIDC, tag, receipt 분리를 확인한다.
7. `tools/rootage-cdn`과 세 Rootage workflow에서 pointer/deploy/route recovery를 확인한다.
8. 구현 옆 `*.test.ts`에서 spoof, stale state, partial retry와 response-loss 거부 사례를 먼저 읽는다.

## 8. Rollout 전에 사람이 확인할 것

- `dev`, `minor`, `major` branch protection과 required `Validate release lane`
- force push와 deletion 차단, conversation resolution, 최신 base 요구
- `npm-production`, `rootage-production`, `rootage-preview` environment의 branch와 reviewer 정책
- npm trusted publisher가 exact repository/workflow/environment에 연결되었는지
- repository의 현재 Version Packages PR과 publish durable status가 queue 예상과 일치하는지
- #1943/#1950/#1955 one-time recovery가 더 이상 필요 없어진 뒤 allowlist 제거 일정
- 구조 변경 merge 전 `Release publish`를 disable하고 active·queued production run을 0개로 만든다. Merge 뒤 새 `dev` 코드로 `enable-dry-run` activation PR을 생성·검증·merge한 다음 workflow를 다시 enable한다.
- `control.json`은 이 PR에서 기존 `production` 상태를 그대로 유지한다. mode 전환을 구조 변경과 같은 diff에 섞지 않는 것이 의도된 rollout 경계다.

상세한 queue preflight, legacy shim 제거, dry-run·production canary 순서는 [RELEASING.md의 첫 dry-run 롤아웃](./RELEASING.md#4-현재-구조의-첫-dry-run-롤아웃)을 source of truth로 삼는다. 이 작업에서는 activation dispatch나 live 실행을 하지 않았다.

## 9. 의도적으로 남긴 범위

- stable 승격과 prerelease 상태 전환: 미지원
- sync conflict를 같은 bot PR에서 사람이 수정: 미지원, 별도 target PR과 exact skip receipt 사용
- bootstrap 전체 workflow 재실행 중복: failed job만 재실행하는 운영 규칙 유지
- stable pointer CAS 직후 process hard crash: 자동 journal 없음; retry/smoke와 수동 exact rollback으로 복구하는 P2 운영 잔여
- GitHub ruleset, environment, npm trusted publisher: 코드 밖의 운영 설정
- live npm/R2/Cloudflare 검증: rollout 단계에서 수행

제거한 promotion/transition과 분리 전 sync workflow는 `/tmp/seed-design-release-pipeline-review/` 아래에 복구 참고용으로만 보관했다. `/tmp`는 비영속적이며 source of truth가 아니다. 기능을 다시 도입할 때는 그대로 복사하지 말고 별도 설계와 보안 리뷰를 거친다.

## 10. Git 상태

초기에는 사용자의 기존 index를 보존했지만, 마지막 요청에서 다음 세션 handoff를 위해 현재 작업을 commit하도록 명시적으로 승인받았다. 따라서 기존 `README.md`, `package.json` staged snapshot과 최신 working tree를 다시 대조한 뒤 이 문서, `HANDOFF.md`, release/Rootage 구현 전체를 하나의 최종 local commit으로 정리한다.

Remote push는 수행하지 않는다. Commit 뒤 `git status --short`가 비어 있어야 하며, 다음 세션은 [`HANDOFF.md`](./HANDOFF.md)에서 시작한다.
