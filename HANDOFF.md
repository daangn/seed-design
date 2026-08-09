# Release Pipeline Handoff

작성일: 2026-08-10
대상 브랜치: `refactor-release-pipeline`
목적: 이전 대화나 작업 로그 없이 다음 세션이 릴리즈 파이프라인 작업을 안전하게 이어간다.

## 1. 새 세션이 가장 먼저 할 일

다음 순서를 지킨다.

1. 이 문서를 끝까지 읽는다.
2. [`RELEASING.md`](./RELEASING.md)에서 사람의 현재 운영 절차를 읽는다.
3. [`RELEASE-PIPELINE-REVIEW.md`](./RELEASE-PIPELINE-REVIEW.md)에서 구현 범위와 감사 결과를 읽는다.
4. [`tools/release-automation/TECH.md`](./tools/release-automation/TECH.md)와 [`tools/rootage-cdn/TECH.md`](./tools/rootage-cdn/TECH.md)에서 권한·복구 경계를 확인한다.
5. 아래 명령으로 checkout 상태를 확인한다.

   ```sh
   git status --short
   bun release:doctor
   ```

6. 코드 변경 전 사용자에게 한 번에 질문 하나만 한다. 첫 질문은 8절의 prerelease exit 의미 확인이다.

GitHub workflow dispatch, PR merge, npm publish, Git tag push, Cloudflare/R2 mutation은 이 문서를 읽었다는 이유만으로 실행하지 않는다. 별도 사용자 승인이 필요하다.

## 2. 확정된 사용자 결정

- 기본 package release lane은 `dev`, `minor`, `major` 세 개다.
- 일상 개발자는 Changeset을 포함한 일반 `dev` PR만 만든다.
- 현재 최소 운영 정책은 다음과 같다.

  | lane | version policy | npm dist-tag |
  | --- | --- | --- |
  | `dev` | patch stable | `latest` |
  | `minor` | minor prerelease | `beta` |
  | `major` | major prerelease | `beta` |

- 복잡한 stable promotion과 prerelease transition은 초기 최소 범위에서 제거했다.
- Release 구현은 평면 `scripts/release`가 아니라 private workspace인 `tools/release-automation`에서 관리한다.
- 사람용 로컬 명령은 `bun release:doctor`, `bun release:verify` 두 개뿐이다. 실제 publish를 실행하던 루트 `bun release` alias는 제거했다.
- 현재 rollout은 곧바로 production을 실행하지 않고 dry-run으로 운영 기록을 먼저 쌓는다.
- 기존 `control.json`의 mode 변경은 이 구조 변경과 같은 PR에 넣지 않는다.
- 이번 핸드오프 커밋 뒤 다음 기능이 필요하다.

  1. `workflow_dispatch` 기반 lane별 prerelease enter/exit 운영
  2. release package 간 peer dependency 하한 자동 갱신
  3. `tools/rootage-cdn`과 `tools/release-automation`의 중요한 불변식·복구 경계 주석 보강

## 3. 현재 구현 구조

### Workflow 8개

| 파일 | 책임 |
| --- | --- |
| `.github/workflows/release-bootstrap.yml` | 최초 `minor`·`major` 생성과 beta bootstrap PR |
| `.github/workflows/release-activation.yml` | Rootage readiness, sync, dry-run·production mode 상태 PR |
| `.github/workflows/release-sync.yml` | FIFO drain, trusted validation 후 merge, blocker alert |
| `.github/workflows/release-pr-validation.yml` | trusted `dev` 기준 exact-head PR 검증과 status 기록 |
| `.github/workflows/release-packages.yml` | tokenless Version plan과 trusted writer |
| `.github/workflows/release-publish.yml` | immutable artifact, npm OIDC, Git tag, Rootage, durable receipt |
| `.github/workflows/release-notification.yml` | 성공한 production receipt 기반 Slack 알림 |
| `.github/workflows/release-e2e.yml` | production write 없는 로컬 동등 검증 |

제거된 `release-promotion.yml`, `release-transition.yml`, split sync merge/alert workflow를 그대로 복구하지 않는다. 현재 권한 경계와 신뢰 모델을 우회한다.

### `tools/release-automation`

```text
bin/control.ts         workflow control entrypoint
src/core/              config, marker, GitHub/status 공통 계약
src/setup/             bootstrap과 activation 상태 전이
src/lane/              Version Packages plan/write 검증
src/sync/              FIFO, tree reconstruction, worker/merge/alert
src/validation/        generated PR과 migration validator
src/publish/           승인, artifact, npm, tag, Rootage input, receipt, notification
src/local/             doctor, verify, package tarball dry-run
src/workflows/         workflow 권한·trigger 계약 테스트
```

GitHub write token, npm OIDC, Cloudflare/R2 credential은 서로 다른 job 또는 workflow에 둔다. Credential을 가진 job에서 lane/source code lifecycle을 실행하지 않는 것이 핵심 불변식이다.

### Rootage CDN

`tools/rootage-cdn`은 release automation과 합치지 않는다. 별도 credential과 public route/deploy/pointer 복구 수명주기를 가진다.

현재 구현은 immutable version object, completion manifest, stable pointer CAS, Worker version smoke, route POST/DELETE와 deployment response-loss reconciliation을 포함한다. Concurrent owner가 바뀌면 자동 보상하지 않고 fail-closed한다.

## 4. 이번 커밋에서 완료한 핵심

- 요청된 PR #1926, #1927, #1929, #1932, #1933, #1947, #1948, #1952, #1953을 release core, publish, Rootage 관점에서 교차 감사했다.
- Self-validating generated branch를 제거하고 trusted `dev` workflow가 exact ref/SHA를 검증하게 했다.
- Sync validation의 status writer와 untrusted lane-code 실행을 runner/job 단위로 분리했다.
- Version Packages를 tokenless planner와 trusted writer로 분리했다.
- Publish를 immutable build artifact, npm OIDC, Git tag writer, Rootage, receipt와 알림으로 분리했다.
- Partial publish retry에서 registry `gitHead`, integrity, dist-tag와 Git tag를 reconcile한다.
- Rootage pointer/deploy/route ambiguous write와 smoke 실패를 소유권 기반으로 복구한다.
- Workflow를 12개에서 8개로 줄이고 sync 세 workflow를 하나로 합쳤다.
- `scripts/release` 구현을 private `@seed-design/release-automation` workspace로 옮기고 domain별로 나눴다.
- Stable promotion과 기존 transition 구현을 제거했다.
- `enable-dry-run` activation operation을 추가했다.
- Activation operation 이름, 상태 파일, readiness 요구를 exhaustive spec으로 묶고 workflow options와 계약 테스트로 exact 비교한다.
- `freeze` 런타임 정책을 제거했다. 현재 dev의 `freeze: null`만 migration input으로 읽고 새 activation writer는 이를 다시 쓰지 않는다.
- 로컬 publish 오실행을 막기 위해 root `bun release` script를 제거했다.
- 사람용 운영 문서와 상세 구현 리뷰 문서를 추가했다.

## 5. 현재 `control.json`과 rollout 상태

`.github/release/control.json`은 이 구조 변경 전 `dev`와 byte-exact 동일하게 유지했다.

```json
{
  "$schema": "./control.schema.json",
  "schemaVersion": 1,
  "mode": "production",
  "rootageContractReady": true,
  "freeze": null
}
```

중요: 코드에 `enable-dry-run`이 있어도 아직 dispatch하거나 merge하지 않았다. npm, Git tag, Cloudflare/R2 production mutation도 실행하지 않았다.

### 왜 legacy shim이 남아 있는가

현재 `dev`에 배포된 구 PR validator는 PR merge tree에서 다음 경로를 실행한다.

```text
bun scripts/release/cli.ts validate-pr --event "$GITHUB_EVENT_PATH"
```

따라서 구조 변경 PR에서 이 경로를 바로 삭제하면 새 validator가 dev에 들어가기 전에 required check가 끊긴다. 이를 위해 다음 두 파일을 임시로 유지한다.

- `scripts/release/cli.ts`
- `tools/release-automation/src/validation/legacy-pr-validation.ts`와 인접 테스트

이 validator는 일반 `dev` migration PR만 허용하고 generated PR, release state 변경, Changeset 삭제를 거부한다.

삭제 조건은 “새 dev validator가 실제 activation PR의 current head에 `Validate release lane` success를 기록함”이다. 조건을 확인하기 전에 삭제하지 않는다.

### 첫 rollout 요약

정확한 체크리스트는 [`RELEASING.md` 4절](./RELEASING.md#4-현재-구조의-첫-dry-run-롤아웃)을 따른다.

1. 기존 Version PR과 durable receipt queue를 대조한다.
2. Release publish workflow를 disable한다.
3. 이미 active/queued인 production publish run을 취소하고 0개가 될 때까지 기다린다.
4. 이 구조 변경을 merge한다.
5. `enable-dry-run` activation PR을 새 validator로 검증·merge한다.
6. mode가 dry-run이고 active production run이 0인지 확인한 뒤 publish workflow를 다시 enable한다.
7. 새 Changeset으로 세 lane dry-run Version PR을 각각 검토·merge한다.
8. `:dry-run` receipt와 npm/tag/Rootage external write 0건을 확인한다.
9. Legacy shim 제거 PR을 새 validator로 검증·merge한다.
10. 별도 go 결정 뒤 `enable-production`, 그리고 또 다른 새 Changeset으로 production canary를 진행한다.

Workflow disable은 이미 authorize된 run을 멈추지 않는다. `enable-dry-run`도 in-flight production run의 kill switch가 아니다.

Dry-run receipt는 해당 Version merge의 terminal 처리다. Production으로 돌아가도 같은 version은 다시 게시하지 않으므로 production canary에는 새 Changeset이 필요하다.

## 6. 현재 검증 증거

최종 핸드오프 커밋 전 확인한 결과는 다음과 같다.

```text
bun --filter @seed-design/release-automation test
  161 pass / 0 fail / 996 assertions

bun --filter @seed-design/rootage-cdn test
  75 pass / 0 fail / 239 assertions

bun --filter @seed-design/release-automation typecheck
bun --filter @seed-design/rootage-cdn typecheck
  pass

bun release:doctor
  9 pass / 4 warning / 0 error
```

Doctor warning 4개는 local Bun 1.3.12와 CI 1.3.13 차이, 현재 branch가 release lane이 아님, upstream 없음, 의도된 dirty worktree였다.

`bun release:verify`는 샌드박스 밖에서 dependency setup을 포함한 15/15를 통과했다. 검증에는 두 build, release/Rootage 시나리오, Biome, diff-check, 두 typecheck, Wrangler dry-run, `generate:all`, 전체 저장소 테스트, 생성 결정성 재검사와 실제 package tarball dry-run이 포함된다. 샌드박스 안의 선행 실행은 `packages/cli` docs test가 local HTTP server를 열지 못해 실패했으며, 같은 전체 검증의 승인된 샌드박스 밖 실행이 통과했으므로 코드 실패가 아니다.

## 7. 알려진 운영 제약

- `minor`와 `major`는 같은 npm `beta` tag를 공유한다. 마지막 publish가 tag를 차지하므로 exact version과 lane을 함께 확인한다.
- Dry-run으로 처리된 version은 production에서 자동 replay되지 않는다.
- Sync conflict는 같은 bot PR에서 사람이 직접 고치지 않는다. 별도 target PR과 exact skip receipt를 사용한다.
- Bootstrap 전체 matrix를 재실행하면 중복 PR이 생길 수 있다. 실패한 job만 다시 실행한다.
- Stable pointer CAS 직후 process hard crash에는 durable journal이 없다. Retry/smoke와 수동 exact rollback이 현재 복구 수단이다.
- Branch ruleset, environment reviewer, npm trusted publisher는 코드 밖의 설정이다.
- Live npm/R2/Cloudflare canary는 아직 실행하지 않았다.
- #1943, #1950, #1955 one-time publish recovery allowlist는 live queue가 안정된 뒤 제거 일정을 정한다.

## 8. 다음 기능 1: lane별 prerelease enter / exit

사용자 요구: `workflow_dispatch`로 선택한 lane의 prerelease enter와 exit를 운영한다.

### 구현 전에 반드시 물을 첫 질문

“Exit가 `pre exit`와 `changeset version`을 한 번에 수행하는 **state-only PR**을 merge해 lane을 dormant로 만들고, 그 stable-looking version은 npm/Git tag/Rootage에 게시하지 않는 의미여도 되는가?”를 묻는다.

권장 답변은 **예**다. 이 최소안은 stable promotion과 세 branch baseline 재정렬을 다시 도입하지 않으면서 enter/exit 운영을 가능하게 한다. 단, branch에는 npm에 게시되지 않은 stable-looking version이 남으므로 이 상태를 운영 계약으로 명시적으로 수용해야 한다.

Exit에서 실제 stable package를 게시하고 싶다면 이 기능만 구현해서는 안 된다. 다음 문제가 동시에 생긴다.

- `latest`를 major/minor가 차지한 뒤 이전 `dev` patch는 SemVer 단조 증가 규칙 때문에 게시할 수 없다.
- Exit 후 `dev`, `minor`, `major`의 package baseline을 어떻게 맞출지 정의해야 한다.
- 두 prerelease lane이 같은 `beta` tag를 쓰는 현재 정책과 전환 순서를 다시 설계해야 한다.
- 현재 `publish-artifact.ts`와 `publish.ts`는 non-dev stable을 의도적으로 거부한다.

### 권장 상태 모델

- `dev`: stable patch 전용, `pre.json` 금지, enter/exit 불가
- dormant `minor`/`major`: `pre.json` 부재, `release-packages`는 no-op
- active `minor`/`major`: exact `mode: "pre"`, `tag: "beta"`; registry intent는 beta
- exit: active lane의 trusted no-credential planner가 `pre exit`와 `changeset version`을 연속 실행해 **하나의 state-only generated PR**을 만든다. 이 PR은 package/changelog/bun.lock/Rootage generated diff와 `pre.json` 삭제를 포함할 수 있지만 publish queue에는 들어가지 않는다.

Arbitrary tag와 retag input은 지원하지 않는다. `minor`와 `major`는 계속 같은 global npm `beta` tag를 사용하며 enter/exit operation이 tag를 삭제·복원·이동하지 않는다.

### 예상 설계 지점

- 새 `.github/workflows/release-prerelease.yml`: `dev` ref 전용, `lane: minor|major`, `operation: enter|exit`, tokenless planner와 trusted writer 분리
- `tools/release-automation/src/core/types.ts`, `marker.ts`: generated type `prerelease`, exact `release-prerelease/<lane>/<operation>-<runId>`, head/control SHA 계약
- 새 `src/lane/prerelease-state.ts`와 `prerelease-write-plan.ts`: exact pre-state parser, immutable plan, direct-child tree와 stale lane/dev 검증
- `tools/release-automation/src/lane/pull-policy.ts`: enter는 exact `pre.json`, exit는 planner가 재구성한 state-only diff만 허용
- `tools/release-automation/src/validation/generated-pr-validation.ts`: trusted dev head/tree 검증
- `.github/workflows/release-packages.yml`, `src/lane/version.ts`: dormant non-dev lane은 stable Version PR을 만들지 않고 no-op
- `src/local/doctor.ts`: remote lane의 dormant/active 상태 진단
- `RELEASING.md`: 사람의 enter/exit, Version PR, rollback 절차

Atomic state-only exit PR은 `changeset-release/<lane>` branch나 `version` marker를 사용하지 않는다. 따라서 current publish queue가 선택하지 않으며 `publish-state.ts`를 확장할 필요가 없다. Non-dev stable publish 거부는 defense-in-depth로 유지한다.

### 최소 acceptance criteria

- `workflow_dispatch`는 `dev` ref에서만 실행되고 `dev` lane operation은 거부한다.
- lane과 operation은 strict choice이며 tag/retag input은 없다.
- Bot, same-repository, exact branch/head/control SHA marker를 가진 state PR만 생성한다.
- Planner에는 read 권한만 있고 writer는 target lane code를 실행하지 않는다. 모든 checkout은 `persist-credentials: false`다.
- Enter는 absent → exact beta pre state만, exit는 exact active beta → state-only finalization만 허용한다.
- PR은 current lane/dev SHA, direct parent, patch/tree/hash와 허용 파일에 결속되고 validator가 exact tree를 재구성한다.
- Malformed/extra-key state와 duplicate/stale enter/exit는 fail-closed한다.
- Lane별 enter tag와 `.changeset/pre.json`의 `mode`, `tag`, `initialVersions`, `changesets`를 semantic하게 검증한다.
- Exit PR은 npm, Git package tag, Rootage write를 0회 수행한다.
- Dormant non-dev lane에서 release-packages는 no-op이며 stable Version PR로 FIFO를 막지 않는다.
- Dev prerelease와 non-dev stable registry publish는 계속 거부한다.
- Sync가 prerelease generated PR을 일반 source로 전파하지 않고 target `pre.json`을 보존한다.
- Operation 실패·재실행·stale PR·동시 lane operation 테스트가 있다.
- Context7로 설치된 Changesets CLI 버전의 `pre enter`/`pre exit` 계약을 먼저 확인한다. 저장소 AGENTS 지침상 CLI 문서는 추측하지 않는다.

## 9. 다음 기능 2: peer dependency 하한 자동 갱신

사용자 요구 예시: `@seed-design/css` minor 계약이 바뀌면 새 `@seed-design/react`가 이전 CSS와 조용히 혼용되지 않도록 React의 `peerDependencies["@seed-design/css"]` 하한을 새 line으로 올린다.

현재 실제 값은 다음과 같다.

```text
packages/css/package.json       @seed-design/css
packages/react/package.json     peer @seed-design/css = ^2.4.0
```

`.changeset/config.json`은 현재 `updateInternalDependencies: "patch"`와 `onlyUpdatePeerDependentsWhenOutOfRange: true`를 사용한다. 따라서 같은 major 안의 minor bump처럼 기존 `^` 범위 안에 있는 경우 사용자가 원하는 peer 하한 갱신이 자동으로 발생하지 않는다.

다만 설치된 Changesets 2.29.7은 prerelease 경계에서 이미 peer dependent를 release plan에 추가하고 range를 갱신한다. 로컬 인메모리 재현 결과는 다음과 같다.

- CSS `2.4.2 → 2.5.0-beta.0`: React `2.2.2 → 3.0.0-beta.0`, peer `^2.5.0-beta.0`
- CSS `2.4.2 → 3.0.0-beta.0`: React `2.2.2 → 3.0.0-beta.0`, peer `^3.0.0-beta.0`
- 다음 CSS `2.5.0-beta.1`: 기존 `^2.5.0-beta.0` 범위 안이므로 React와 range 추가 bump 없음

즉 새 mutation 코드를 먼저 만들면 안 된다. 실제 lane Version plan fixture로 현재 Changesets 동작을 고정하고, 제품 정책과 맞지 않는 부분만 별도 pure policy로 설계한다.

### 구현 전에 확인할 제품 결정

Prerelease 기능의 첫 질문이 끝난 뒤 다음을 한 번에 하나씩 묻는다.

1. CSS minor가 React peer 계약을 깨면 Changesets가 React를 major로 올리는 것을 허용할 것인가? SemVer상 권장은 **허용**이지만, “minor lane은 모든 package가 minor 이하”라는 현재 직관과 충돌한다.
2. `lynx-react → lynx-css`의 기존 복합 range `0.0.0 || >=0.1.0 <1.0.0`이 prerelease 경계에서 exact `0.8.0-beta.0`으로 좁아지는 것을 허용할 것인가? 권장은 실제 호환 계약을 먼저 확인한 뒤 결정하는 것이다.

### 권장 구현 순서

1. Tokenless Version planner에서 실제 Changesets 2.29.7을 사용한 integration fixture를 추가한다.
2. `lane-write-plan.ts`의 verifier gap을 먼저 닫는다.
   - Dependency/peer range가 바뀐 owner package 자체도 같은 plan에서 version bump됐는지 요구한다.
   - Target release만 확인하지 말고 Changesets/config가 실제로 요구한 expected peer transform과 exact 비교한다.
   - In-range peer를 임의로 더 좁히거나 union/prefix를 바꾸는 spoof를 거부한다.
   - Target lane의 `.changeset/config.json`을 trusted dev config와 `baseBranch` 차이만 허용해 exact 비교한다. 현재는 target의 `onlyUpdatePeerDependentsWhenOutOfRange`나 `updateInternalDependencies` drift를 trusted replay가 정답으로 받아들일 수 있다.
3. 제품 결정이 upstream behavior와 다를 때만 pure `src/lane/internal-peer-range.ts`를 추가한다. Mutation은 `src/lane/version.ts`의 `bun version` 직후, Rootage build와 최종 install 전에 tokenless planner에서만 수행한다.
4. Trusted writer는 range를 수정하지 않고 exact manifest, release set과 `bun.lock` workspace section을 독립 재검증한다.
5. Publish는 절대 range를 수정하지 않는다. 승인 package list와 tarball integrity에 dependent manifest가 포함됐는지만 검증한다.

### 예상 설계 지점

- `.changeset/config.json`: 기존 Changesets behavior와 새 custom policy 관계 확인
- `tools/release-automation/src/lane/lane-write-plan.ts`: release graph, dependencyFields, `isExactWorkspaceDependencyUpdate`, manifest/lock reconstruction
- `tools/release-automation/src/lane/lane-write-plan.test.ts`: CSS→React와 공격 fixture
- `packages/react/package.json`: 현재 peer contract
- 내부 peer edge 후보: React→CSS, Lynx React→Lynx CSS, `stackflow`, `tailwind3-plugin`, `tailwind4-theme`, `rsbuild-plugin`, `vite-plugin`, `webpack-plugin`→CSS

### 최소 acceptance criteria

- CSS patch는 정책에서 정한 경우가 아니면 React peer 하한을 불필요하게 바꾸지 않는다.
- CSS minor/major first beta는 새 React release와 exact peer lower bound를 같은 immutable plan에 포함한다.
- 다음 beta가 기존 peer range 안이면 불필요한 dependent bump가 없다.
- 이전 CSS version은 새 React의 peer range를 만족하지 않는다.
- 같은 release의 CSS prerelease version은 새 React peer range를 만족한다.
- Peer range만 바꾸고 React version을 그대로 두는 plan을 거부한다.
- Target package가 release되지 않았거나 stale version인 range change, overly broad/narrow range, 잘못된 prefix/union/protocol을 거부한다.
- Target config의 unsafe option, internal dependency mode 또는 workspace-protocol option drift를 거부한다.
- Peer와 devDependency에 같은 내부 package가 있으면 두 field와 `bun.lock` workspace entry를 exact 검증한다.
- 관계 없는 dependency, package field, lock resolution을 바꾸는 plan을 거부한다.
- dev/minor/major와 beta/stable 각각의 exact fixture가 있다.
- Generated Version PR validator가 같은 semantic policy를 독립 replay한다.

## 10. 다음 기능 3: 중요한 주석 보강

목표는 코드를 한국어로 반복 설명하는 것이 아니라, 코드만 읽어서는 알기 어려운 **왜 이 경계가 존재하는가**를 남기는 것이다.

### 우선순위가 높은 release automation 지점

- `src/core/generated-pr-provenance.ts`: candidate code가 자기 validator를 신뢰할 수 없는 이유
- `src/core/validation-status.ts`: commit status와 workflow run을 exact SHA/run에 결속하는 이유
- `src/lane/lane-write-plan.ts`: tokenless plan/trusted writer 분리, synthetic Git tree, lockfile reconstruction, package dependency allowlist
- `src/sync/sync-control-plane.ts`, `sync-tree.ts`, `trusted-sync-validation.ts`: dev overlay와 target data-only 원칙, merge 직전 TOCTOU 재검증
- `src/publish/publish-artifact.ts`: sanitized workspace와 pre-publish artifact 재검증
- `src/publish/publish-state.ts`, `reconcile-publish-tags.ts`: durable receipt, partial retry와 tag ownership
- `src/validation/legacy-pr-validation.ts`: 임시 shim의 존재 이유와 삭제 조건

### 우선순위가 높은 Rootage 지점

- `stable-pointer-recovery.ts`: conditional write response loss와 ETag ownership
- `deployment-guard.ts`: markerless ambiguous deploy reconciliation과 owned-only rollback
- `operations.ts`: route POST/DELETE response loss, compensation 직전 re-read, concurrent owner 거부
- `publisher.ts`: immutable object → manifest → pointer 순서와 public smoke
- `worker.ts`: exact/latest/legacy path, checksum·ETag fail-closed 순서

### 주석 규칙과 acceptance criteria

- 함수 이름으로 알 수 있는 “무엇을 한다” 주석은 추가하지 않는다.
- Credential boundary, irreversible write 전 검증, TOCTOU, retry ownership, non-obvious SemVer/Changesets 선택만 주석으로 설명한다.
- 가능한 경우 해당 회귀 테스트 이름 또는 운영 문서 절을 짧게 가리킨다.
- 변경된 주석이 현재 코드와 모순되지 않는지 implementation/test를 함께 읽고 확인한다.
- README는 사람 사용법, TECH는 아키텍처, AGENTS는 폴더 컨벤션이라는 문서 역할을 유지한다.
- 주석 보강만으로 동작을 바꾸지 않는다. 동작 변경이 필요하면 별도 commit으로 분리한다.

## 11. 변경 및 commit 규칙

- Bun만 사용한다. npm/pnpm/yarn을 사용하지 않는다.
- CI workflow, 새 package, config 변경은 사용자에게 먼저 확인한다.
- Release 또는 Rootage 변경 뒤 targeted test, 두 package typecheck, `bun generate:all`, 마지막에 `bun release:verify`를 실행한다.
- Commit message는 영어 Conventional Commit을 사용한다.
- Generated source와 `node_modules`, `dist`, secret을 직접 수정·커밋하지 않는다.
- Live mutation과 코드 변경을 같은 세션에서 암묵적으로 섞지 않는다.

## 12. 참고 자료와 임시 기록

- 사람 운영: [`RELEASING.md`](./RELEASING.md)
- 최종 구현 리뷰: [`RELEASE-PIPELINE-REVIEW.md`](./RELEASE-PIPELINE-REVIEW.md)
- 저장소 아키텍처: [`TECH.md`](./TECH.md)
- Release package: [`tools/release-automation`](./tools/release-automation)
- Rootage package: [`tools/rootage-cdn`](./tools/rootage-cdn)
- 작업 중 감사 기록: `/tmp/seed-design-release-pipeline-review/`

`/tmp` 기록은 근거 추적용이며 source of truth가 아니다. 다음 세션은 저장소의 이 HANDOFF와 링크된 문서를 우선한다.
