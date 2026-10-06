# 브랜치별 npm 배포

에이전트와 릴리스 담당자가 백포트 준비부터 npm 검증까지 따르는 가이드다. 패키지 버전은 각 브랜치의 `package.json`을 기준으로 계산하며, npm dist-tag는 아래 브랜치 매핑을 따른다.

## 브랜치와 dist-tag

| 소스 브랜치 | npm dist-tag | 배포 경로 |
| --- | --- | --- |
| `dev` | `latest` | `dev` 전용 Release publish workflow |
| `react/v1.0` | `react-v1.0` | 해당 브랜치에서 수동 배포 |
| `react/v1.1` | `react-v1.1` | 해당 브랜치에서 수동 배포 |
| `react/v1.2` | `react-v1.2` | 해당 브랜치에서 수동 배포 |
| `react/v2` | `react-v2` | 해당 브랜치에서 수동 배포 |

유지보수 브랜치 태그는 이 가이드에서 정한 배포 정책이다. 아직 배포하지 않은 태그는 npm에 존재하지 않을 수 있다. 브랜치명은 React 버전 계열을 나타내며 CSS·Figma·MCP 등의 버전 번호가 같다는 뜻은 아니다. 함께 릴리스되는 패키지는 같은 브랜치 태그를 사용한다.

- 유지보수 릴리스에서는 `latest`, 기존 `backport`, 다른 브랜치 태그를 이동하지 않는다. `backport`는 패키지마다 서로 다른 버전 계열을 가리키는 기존 태그다.
- `main`, `react/2.0`, 작업 브랜치 이름에서 배포 태그를 추측하지 않는다. 매핑에 없는 브랜치는 담당자에게 소스 브랜치를 확인한다.
- `dev`에서만 기본 `bun release` 경로를 사용한다. 유지보수 브랜치의 `bun release`는 태그를 명시하지 않아 `latest`를 바꿀 수 있으므로 빌드와 publish를 분리한다.
- `workflow_dispatch`가 있어도 유지보수 브랜치를 배포할 수 있다고 가정하지 않는다. 현재 기본 브랜치의 Release publish workflow는 `refs/heads/dev`만 허용한다. 과거 브랜치에 남은 workflow와 현재 GitHub에 등록된 workflow를 함께 확인한다.
- 브랜치별 자동 배포를 추가하려면 CI 변경을 별도로 검토한다. 이 문서는 수동 배포 절차를 제공한다.

## 백포트 준비

1. 원격 대상 브랜치와 원본 수정 PR·커밋을 확인한다. 작업 브랜치는 최신 대상 브랜치에서 시작한다.
2. 동작 수정과 필요한 Recipe 원천만 이식한다. 대상 계열의 props·타입 계약을 유지한다. CSS는 원천에서 생성한다.
3. 공유 headless 패키지에 호환되는 수정이 이미 배포됐는지 확인한다. 호환되는 공개 버전을 의존성으로 사용하고, 필요 없는 headless 재배포는 피한다.
4. `.changeset/`에 변경 패키지와 bump를 기록한다. 함께 업데이트해야 하는 패키지, 최소 peer 버전, 접근성·표시 동작 변화도 설명한다.
5. 대상 브랜치의 `AGENTS.md`·`TECH.md`에 따라 빌드·생성·테스트와 필요한 브라우저 검증을 수행한다. 백포트 PR을 대상 유지보수 브랜치에 머지한다.

## 버전 준비

대상 브랜치에 백포트가 머지된 뒤 릴리스 작업 브랜치에서 수행한다. 아래는 `react/v1.2` 예시다. 다른 계열은 소스 브랜치와 태그를 위 매핑대로 함께 바꾼다.

```sh
git fetch origin react/v1.2
git switch -c release/react-v1.2 origin/react/v1.2
bun install --frozen-lockfile
bun changeset status --since origin/react/v1.2 --output /private/tmp/seed-release-plan.json
bun version
```

- `bun version`은 Changesets 버전 계산과 lockfile 갱신을 수행한다. 수동으로 버전을 맞추지 않는다.
- 계산된 모든 public 패키지를 검토한다. CSS 갱신은 Figma, 이어서 MCP의 patch 릴리스를 유발할 수 있다. docs·example·tool의 의존성 변경도 정상적인 연쇄 변경인지 확인한다.
- 공개된 headless 버전을 쓰는 브랜치에서는 로컬 headless 버전과 다르다는 Changesets 경고가 나올 수 있다. 공개 버전과 호환성을 확인하고, 경고를 없애려고 로컬 구버전으로 되돌리지 않는다.
- 버전 준비로 changeset이 소비된 뒤 `changeset status`를 다시 실행하면 변경은 있으나 changeset이 없다는 오류가 날 수 있다. 원래 릴리스 계획과 버전 diff로 검토하고, 같은 릴리스를 위해 changeset을 다시 만들지 않는다.

```sh
bun packages:build
bun generate:all
git diff --check
bun test:all
```

산출물이 추가로 바뀌면 원천과 대응하는지 확인하고 빌드를 갱신한다. 배포 대상 패키지마다 아래를 실행한다.

```sh
bun publint packages/react
bun publint packages/css
# 각 배포 대상 패키지 디렉토리에서 실행한다.
bun pm pack --dry-run --ignore-scripts
```

릴리스 버전·changelog·lockfile과 이 가이드 변경을 PR로 검토하고 대상 브랜치에 머지한다. 가이드는 `dev`와 위 유지보수 브랜치들에 같은 내용으로 반영한다. 문서만 다른 브랜치에 옮길 때는 버전·changelog·lockfile 변경을 함께 이식하지 않는다.

## 배포 전 확인과 실행

1. 머지된 릴리스 커밋을 체크아웃하고 `git status --short`가 비어 있는지 확인한다. 원격 대상 브랜치 SHA와 배포 소스 SHA를 기록한다. 다른 변경이 추가로 머지됐으면 릴리스 범위를 다시 확인한다.
2. 머지된 소스에서 install·build와 위 검증을 완료한다.
3. 각 배포 대상의 기존 dist-tag를 기록한다. `bun info @seed-design/react dist-tags --json`처럼 모든 대상 패키지에서 조회한다.
4. **전체 public workspace**의 이름·버전을 npm과 비교한다. Changesets publish는 마지막 changeset의 패키지만이 아니라 현재 미배포 workspace 버전을 찾아 배포한다. 후보 목록이 검토한 릴리스 계획과 정확히 일치해야 한다. 이미 배포된 버전은 같은 버전으로 덮어쓸 수 없다.
5. `bun pm whoami`로 인증을 확인한다. 실패하면 담당자가 로컬 인증을 설정한 뒤 재확인한다. 토큰·OTP를 문서·로그·채팅·커밋에 남기지 않는다. 자동 배포 workflow의 OIDC 인증을 로컬에서 그대로 쓸 수 있다고 가정하지 않는다.
6. 사용자의 배포 요청에서 대상 브랜치·패키지·태그가 확정됐는지 확인한다. 준비만 요청한 경우 실제 publish 전에 승인을 받는다.

`react/v1.2`의 실행 명령:

```sh
bun packages:build
bun changeset publish --tag react-v1.2
```

태그는 **모든 publish 호출에 명시한다**. bare `bun release`나 bare `bun changeset publish`로 대체하지 않는다. `--tag`는 dist-tag를 선택하며 `1.2.17` 같은 버전 문자열에 prerelease 접미사를 붙이지 않는다. 별도의 prerelease 상태가 있으면 안정 버전 백포트와 섞지 않고 먼저 릴리스 상태를 확인한다.

## 배포 후 검증과 재시도

- 각 패키지의 정확한 버전 메타데이터와 `dist.integrity`가 npm에서 조회되는지 확인한다. publish 로그만으로 완료를 보고하지 않는다.
- 해당 브랜치 태그가 의도한 버전을 가리키는지 확인한다. 기존 `latest`, `backport`, 다른 브랜치 태그는 배포 전 기록과 같아야 한다.
- 의존성과 peer floor가 준비한 manifest와 같은지 확인한다. React·CSS를 새 브랜치 태그로 함께 설치하는 소비자 환경도 검증한다.
- Changesets가 만든 Git 태그와 npm dist-tag는 별개다. 이번 릴리스에 생성된 Git 태그만 검토 후 push한다. 관계없는 로컬 태그를 포함하는 `git push --tags`는 사용하지 않는다.
- 일부 패키지만 성공했다면 npm에서 성공·실패를 패키지별로 확인한다. 같은 소스 SHA·버전·브랜치 태그로 남은 미배포 패키지를 재시도한다. 이미 배포된 버전의 내용을 수정하거나 불필요하게 버전을 올리지 않는다.
- 버전은 존재하지만 브랜치 태그만 잘못됐다면 단순 publish 재시도로 고쳐진다고 가정하지 않는다. 담당자와 별도의 태그 갱신 경로를 확인하고, 해당 패키지의 정확한 버전을 기준으로 대상 브랜치 태그만 복구하고 검증한다.
- 완료 보고에는 소스 SHA, 패키지별 버전, dist-tag, npm 조회 결과, 기존 태그 유지 여부를 포함한다.

소비자 설치 예시:

```sh
bun add @seed-design/react@react-v1.2 @seed-design/css@react-v1.2
```

## 참고

- [npm dist-tag 동작](https://docs.npmjs.com/adding-dist-tags-to-packages/)
- [Changesets CLI의 publish와 tag](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md)
