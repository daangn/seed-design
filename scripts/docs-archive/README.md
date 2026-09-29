# 버전별 문서 배포와 운영

기존 **Pages 브랜치 배포 + 공통 라우팅 Worker 하나**를 사용합니다. R2나 버전별 Worker는 추가하지 않습니다. 운영자는 매번 터미널에서 검증·배포 명령을 입력하지 않아도 됩니다.

| 할 일 | 운영자가 하는 일 | CI가 처리하는 일 |
| --- | --- | --- |
| React v2 문서 수정 | `react/2.0` 브랜치에 변경 반영 | v2 빌드 → Pages 배포 → 문서·검색·registry 검증 |
| 특정 브랜치 문서 수동 배포 | `deploy-seed-design-docs-alpha-pages`에서 해당 브랜치 선택 | 선택한 브랜치만 빌드·Pages 배포 |
| 새 React 메이저 보관 | 보관 브랜치 준비, `archives.json` 등록 | 설정에서 빌드 버전·경로 선택, Pages 검증 |
| 공개 경로 추가·원본 변경 | 운영 브랜치의 `archives.json` 변경 리뷰·반영 | 모든 원본 검증 → 공통 Worker와 전체 route 갱신 |
| Worker 코드 변경 | 운영 브랜치에 변경 반영 | 테스트·타입 검사 → 원본 검증 → 배포 |
| Worker 원본 검증만 다시 실행 | `Deploy Docs Archive Worker`에서 `major`·`verify` 선택 | 외부 설정 변경 없이 전체 원본 검사 |
| Worker 배포 재시도 | `Deploy Docs Archive Worker`에서 `major`·`deploy` 선택 | 전체 원본을 다시 검증한 뒤 공통 Worker 배포 |

Worker 운영 브랜치는 현재 **`major`**입니다. 콘텐츠 브랜치에서는 Worker를 배포하지 않습니다. 자동 배포는 저장소 변수 `DOCS_ARCHIVE_DEPLOY_ENABLED=true`로 최초 활성화하기 전까지 꺼져 있습니다. 이 PR을 `major`에 머지하는 것만으로 Worker가 생성되지는 않습니다.

## 공개 주소 정책

| 문서 | 공개 주소 | 원본 |
| --- | --- | --- |
| 최신 React (메뉴 표시 `latest`) | `https://seed-design.io/react` | 기존 최신 Pages |
| React v2 | `https://seed-design.io/react/2.0` | `react/2.0` 브랜치 Pages |
| 기존 React 1.x | 기존 `v1-2`, `v1-1`, `v1-0.seed-design.io` | 기존 방식 유지 |
| 옛 디자인 가이드 | `https://v0.seed-design.io` | 기존 `seed-design-v2` Pages |

앞으로 플랫폼별 **메이저 버전만** 보관합니다. V0는 메뉴에 넣지 않습니다. Worker에는 `latest` 별칭을 만들지 않습니다.

요청 흐름은 `seed-design.io/react/2.0/* → 공통 Worker → 해당 Pages alias의 /react/2.0/*`입니다. `/react`, `/lynx` 등은 기존 Pages가 처리합니다. 모든 등록 항목이 Worker 하나에 포함되며 버전마다 Worker 설정 파일을 복사하지 않습니다.

## 브랜치·버전 이름과 보관 정책

브랜치, URL, 메뉴를 아래 규칙으로 맞춥니다. `v` 접두사와 패치 버전은 넣지 않습니다.

| 대상 | 보관 브랜치 | 공개 경로 | 메뉴 |
| --- | --- | --- | --- |
| 기존 React 1.0 | 향후 `react/1.0` | 향후 `/react/1.0` | `1.0` |
| 기존 React 1.1 | 향후 `react/1.1` | 향후 `/react/1.1` | `1.1` |
| 기존 React 1.2 | 향후 `react/1.2` | 향후 `/react/1.2` | `1.2` |
| React 2.x | `react/2.0` | `/react/2.0` | `2.0` |
| 향후 React 3.x | `react/3.0` | `/react/3.0` | `3.0` |
| 향후 Lynx 1.x | `lynx/1.0` | `/lynx/1.0` | `1.0` |

`2.0`은 **2.0.0 한 릴리스의 스냅샷이 아니라 2.x 전체의 보관 채널**입니다. 2.5.0으로 수정된 문서도 같은 채널에 반영합니다. 기존 React 1.x 마이너 보관본은 그대로 유지하고, 앞으로 2.1·2.2 같은 별도 마이너 보관본은 만들지 않습니다. 패키지 설치 버전과 문서 채널 이름은 구분합니다.

`dev`·`minor`·`major`는 기존 개발/패키지 릴리스 브랜치 역할을 유지합니다. `react/*`·`lynx/*`는 문서 보관과 해당 버전 유지보수용이며 최신 개발 브랜치를 통째로 계속 merge하지 않습니다. 문서 수정 작업은 예를 들어 `docs/react-2.0-fix-search`에서 시작해 `react/2.0`을 대상으로 PR을 만듭니다.

현재 `/react/v2`는 아직 공개 배포되지 않았으므로 새 canonical을 `/react/2.0`으로 정리합니다. 실제 운영 중인 이전 주소가 발견되면 경로·query를 보존하는 redirect를 먼저 준비합니다. 이번 변경은 기존 `v1-*` 주소와 브랜치를 삭제·변경하지 않습니다.

## React 3.0.0 출시 단계

### 출시 전에 끝낼 작업

- [ ] [dev 선반영 PR #2325](https://github.com/daangn/seed-design/pull/2325)로 Actions 등록용 workflow 파일 **하나만** 머지합니다. `major → dev` 병합·fast-forward는 하지 않습니다. 이 PR 자체는 npm 릴리스·Pages 배포·Worker 배포를 트리거하지 않습니다.
- [ ] #2260을 `major`에 반영하고, 현재 안정 React 2.x 소스에서 `react/2.0`을 준비합니다. 보관 인프라만 선별 backport합니다.
- [ ] GitHub 토큰·계정 설정을 준비하고, Pages 원본 검증을 통과시켜 실제 alias를 운영 목록에 등록합니다.
- [ ] 승인된 공개 작업으로 공통 Worker와 `/react/2.0*` route를 배포합니다. 문서·검색·자산·CLI·404와 문서 수정 push → 자동 갱신을 실제 공개 주소에서 확인합니다.
- [ ] V0 도메인 이전·TLS·기존 v2 주소 redirect를 확인합니다.
- [ ] 출시 직전까지 안정 브랜치에 추가된 마지막 React 2.x 변경을 `react/2.0`에 선별 반영하고 최종 SHA·배포·CLI를 확인합니다. 브랜치 간 동기화는 CI가 자동으로 해주지 않습니다.

출시 전 최신 `/react`는 계속 React 2.x를 제공합니다. 보관본도 같은 메이저일 수 있으므로 메뉴가 새 메이저 출시를 뜻하지 않도록 하고, 최신 사이트의 메뉴 전환은 실제 공개 경로 확인 후 출시 시점에 반영합니다.

### 출시 시점에 진행할 작업

- [ ] 담당자의 기존 React 3.0.0 패키지 릴리스가 완료된 후 최신 Pages의 `/react`와 메뉴·배너를 공개합니다. 이 문서 인프라 작업은 `major`를 `dev`에 합치거나 React 3.0.0을 publish하지 않습니다.
- [ ] `latest → /react`, `2.0 → /react/2.0`, 기존 1.x 링크, V0 메뉴 미노출을 확인합니다.
- [ ] 공개 문서의 설치 안내와 실제 npm 버전이 일치하는지 확인합니다.

### 출시 이후 후속 작업

- [ ] 실제 공개 URL에서 오류·검색·registry·트래픽을 확인하고 `/react/2.0/sitemap.xml`을 검색 도구에 등록합니다.
- [ ] CLI `--seed-react-version`에 React 2.x → 보관본 매핑을 추가해 별도 CLI 릴리스로 배포합니다. 그전에는 `--baseUrl`을 사용합니다.
- [ ] React 1.0·1.1·1.2를 아래 절차로 하나씩 이전합니다. 모두를 동시에 바꾸지 않습니다.
- [ ] Lynx 최초 보관 시 전용 build/export와 미리보기 번들을 구현합니다.
- [ ] 장기 운영 브랜치를 `dev`로 옮길 경우 Worker workflow의 push/ref/SHA 검사와 운영 문서를 함께 변경합니다.

## 기존 React 1.x의 단계적 이전

1. 기존 `1.0`·`1.1`·`1.2` 각각의 현재 소스 SHA에서 대응하는 `react/1.0`·`react/1.1`·`react/1.2` **새 브랜치를 추가**합니다. 기존 브랜치는 아직 이름 변경하거나 삭제하지 않습니다.
2. 해당 버전의 옛 Next·문서·registry 구조에 맞게 보관 빌드 지원을 backport합니다. 현재 코드가 1.x 경로를 처리하는 것과 옛 소스에서 전체 빌드가 통과하는 것은 별도이므로 실제 검증이 필요합니다.
3. 새 브랜치 Pages alias와 `/react/1.x` 아래 문서·검색·자산·registry·LLM·404를 검증합니다. 브랜치명이 바뀌면 Pages alias도 바뀝니다. CI가 보고한 실제 alias를 기록합니다.
4. 공통 Worker 목록에 새 항목을 추가하고 공개 경로를 검증합니다. 추가 Worker나 R2는 필요 없습니다.
5. 해당 버전 메뉴와 필요한 CLI 주소를 전환하고, 기존 `v1-*.seed-design.io/react/...` 링크를 새 `/react/1.x/...`로 보존하는 redirect를 검증합니다. HTML 이외의 기존 registry·LLM 경로도 따로 대조합니다.
6. 기존 링크·CLI 소비자 전환을 확인한 뒤에만 옛 브랜치와 alias의 유지·정리를 판단합니다. 자동 삭제하지 않습니다.

## 최초 설정: 한 번만 진행

### 1. 기존 Cloudflare 구성 확인

2026-09-29 대시보드 읽기 전용 확인 결과:

- 계정: **Danggeun Market - Main**.
- 최신 문서 Pages: 프로젝트 이름은 `seed-design-v3`, 기본 호스트는 **`seed-design.pages.dev`**, Production 브랜치는 **`dev`**.
- `seed-design.io`, `v1-0`, `v1-1`, `v1-2`, `v3.seed-design.io`가 해당 프로젝트에서 활성 상태입니다.
- 옛 가이드: `seed-design-v2` 프로젝트에 `v2.seed-design.io`가 연결되어 있습니다.
- `seed-design-docs-archive` Worker는 아직 없습니다.
- `seed-design.io` zone은 같은 계정에 있으며 apex CNAME은 `seed-design.pages.dev`를 가리키고 **프록싱됨** 상태입니다. 확인된 기존 Worker route는 `seed-design.io/rootage/*` 하나로, 새 `/react/2.0*`와 겹치지 않습니다.

Pages에 표시되는 Git 연결 해제·자동 배포 일시 중지 안내만 보고 Git 연동을 켜지 않습니다. 현재 저장소의 GitHub Actions가 Wrangler로 업로드하며, PR 커밋의 배포도 확인했습니다. 기존 Pages 프로젝트의 Production 브랜치와 도메인 연결을 바꾸지 않습니다.

공개 시점에 위 상태를 다시 대조하고 토큰의 대상 계정·zone을 확인합니다. 현재 apex DNS는 변경할 필요가 없습니다. 실제 Pages alias를 Cloudflare Access로 막아두면 공개 Worker의 원본 검사와 요청이 실패합니다.

### 2. 실제 React v2 문서를 Pages에 먼저 준비

1. 리뷰한 **최종 React v2 소스**에서 `react/2.0` 브랜치를 준비합니다. v3를 개발 중인 `major`에서 그대로 분기하지 않습니다.
2. 이 PR의 보관본 빌드·export·라우팅 지원 코드와 Pages workflow를 backport합니다. v3 컴포넌트 제거·콘텐츠 변경은 가져오지 않습니다.
3. 해당 브랜치의 `archives.json`에 `platform: react`, `version: 2.0`, `sourceBranch: react/2.0`을 둡니다. 최초 Pages 업로드 전에는 `origin`이 비어 있어도 빌드는 가능합니다.
4. 브랜치에 push하면 `deploy-seed-design-docs-alpha-pages`가 빌드·업로드·원본 검증을 실행합니다.
5. 성공한 Actions 실행의 **Summary → Verified archive preview**에서 실제 alias를 복사해 **운영 브랜치**의 `archives.json.origin`에 기록합니다. 프로젝트 이름이나 브랜치 이름으로 주소를 추측하지 않습니다.

빌드는 소스의 React 패키지 메이저가 요청한 버전과 같은지 확인합니다. `archive.json`에는 커밋 SHA와 소스 수정 여부가 기록됩니다. 검증은 수정된 로컬 산출물과 잘못된 버전·SHA를 거부합니다. 분기한 소스의 적합성 자체는 최초 코드 리뷰로 확인해야 합니다.

### 3. GitHub Actions 설정

저장소 **Settings → Secrets and variables → Actions**에 다음을 준비합니다. 비밀 값을 코드나 README에 기록하지 않습니다.

| 종류 | 이름 | 용도 |
| --- | --- | --- |
| Secret, 기존 값 확인 | `CF_ACCOUNT_ID` | 위 Pages와 `seed-design.io` zone을 소유한 Cloudflare 계정 |
| Secret, 기존 값 재사용 | `CF_API_TOKEN` | 기존 Pages 업로드와 공통 Worker·route 배포용 토큰 |
| Variable, 최초에는 비워둠 | `DOCS_ARCHIVE_DEPLOY_ENABLED` | `true`일 때만 Worker 배포 허용 |

기존 Docs·Storybook·Stackflow Pages CI와 동일한 `CF_ACCOUNT_ID`·`CF_API_TOKEN`을 재사용합니다. 새 secret이나 전용 토큰은 필수가 아닙니다. 최초 Worker 공개 전에 운영자가 기존 토큰의 대상 계정과 `seed-design.io` zone, **Workers Scripts: Edit**, **Workers Routes: Edit**, **Zone: Read** 권한을 확인합니다. Pages 배포 성공만으로 Worker 권한까지 확인된 것은 아닙니다. 권한을 보완할 때는 기존 Pages 배포 권한과 리소스 범위를 유지합니다. 이 Worker를 위해 R2·DNS 수정 권한을 추가할 필요는 없습니다.

`verify`는 Pages 원본과 GitHub 소스 SHA를 검사하며 Cloudflare 쓰기 토큰을 받지 않습니다. 따라서 `verify` 성공이 Cloudflare 토큰 권한 검증을 뜻하지는 않습니다. 토큰 값은 코드·로그·README에 출력하지 않습니다.

GitHub 기본 브랜치는 현재 `dev`입니다. **Run workflow 버튼을 사용하려면 새 `deploy-docs-archive-worker.yml` 파일이 `dev`에도 있어야 합니다.** 최초에는 이 workflow 파일만 별도 backport해 등록할 수 있습니다. 실행할 때는 브랜치를 `major`로 선택합니다. `dev`에 파일만 추가해도 Worker는 배포되지 않습니다. 실제 코드와 원본 목록은 선택한 `major`에서 읽습니다.

향후 Worker 운영 브랜치를 `dev`로 옮길 때는 이 workflow의 push 대상, job의 ref 제한, 최신 SHA 확인 대상을 함께 변경합니다. 보관 브랜치에서는 실행되면 안 됩니다.

### 4. 최초 Worker 공개

1. 운영 브랜치의 모든 `origin`과 `sourceBranch`를 준비합니다. 현재 빈 `origin`으로는 배포할 수 없습니다.
2. GitHub **Actions → Deploy Docs Archive Worker → Run workflow**에서 브랜치 `major`, operation `verify`를 선택합니다.
3. Summary에서 전체 경로·원본·SHA와 검증 성공을 확인합니다. 이 작업에는 Cloudflare 쓰기 토큰이 전달되지 않습니다.
4. 최초 공개 승인을 받은 뒤 `DOCS_ARCHIVE_DEPLOY_ENABLED=true`로 설정하고 같은 화면에서 `deploy`를 실행합니다.
5. CI가 `seed-design-docs-archive` Worker를 생성하고 등록 목록 전체의 route를 연결합니다. **대시보드에서 빈 Worker를 미리 만들 필요가 없습니다.**
6. 공개 주소에서 문서, 깊은 링크 새로고침, 이미지, 검색, registry/CLI, 404를 확인한 뒤 최신 사이트의 버전 메뉴를 공개합니다.

처음 연결하는 route는 `seed-design.io/react/2.0*`입니다. 다른 버전이 등록되면 동일 Worker에 그 route도 추가됩니다. `2.0*`가 `2.01`도 매칭하는 Cloudflare 특성은 Worker 내부에서 경로 경계를 구분해 처리합니다.

자동 배포 활성화 후에는 `major`에 Worker·등록 목록·관련 workflow 변경이 반영될 때 위 검증과 배포가 자동 실행됩니다. README만 고치면 Worker를 배포하지 않습니다. 동시 Worker 배포는 직렬화하고, 이미 과거 커밋이 된 실행은 배포 직전 거부합니다.

### 5. 옛 가이드 도메인 이전

이 작업은 문서 Worker CI와 별개로 한 번 진행합니다.

1. `seed-design-v2` Pages의 **Custom domains**에 `v0.seed-design.io`를 추가합니다.
2. DNS·TLS·기존 문서 경로 응답을 확인합니다.
3. 기존 `v2.seed-design.io` 요청을 **경로와 query를 유지한 채** `v0.seed-design.io`로 리다이렉트합니다.
4. V0는 메뉴에 등록하지 않습니다. React v2는 `/react/2.0`을 사용합니다.

새 Pages 프로젝트나 기존 프로젝트 삭제는 필요하지 않습니다. 기존 v2 도메인을 먼저 제거하지 않습니다. 이 README와 CI를 추가하는 것만으로 도메인 이전이 실행되지는 않습니다.

## 평소 문서 수정

`react/2.0` 브랜치에서 수정하고 push하면 해당 Pages alias가 갱신되고 `/react/2.0`에도 반영됩니다. **Worker 재배포나 SHA 수동 갱신은 필요 없습니다.** 다른 보관본은 빌드하지 않습니다.

### 버튼으로 특정 브랜치 문서만 배포

1. GitHub **Actions → deploy-seed-design-docs-alpha-pages → Run workflow**를 엽니다.
2. **Use workflow from**에서 `react/2.0` 등 배포할 문서 브랜치를 선택하고 실행합니다.
3. 선택한 브랜치의 코드와 workflow로 빌드해 해당 Pages alias만 갱신합니다. 이미 Worker에 연결한 보관본이면 공개 `/react/2.0`에도 반영됩니다.

해당 브랜치에는 Pages workflow와 필요한 보관 빌드 코드·등록 항목이 먼저 있어야 합니다. 보관 항목이 없는 일반 feature 브랜치는 기존 일반 프리뷰로 배포됩니다. 새 브랜치를 선택하는 것만으로 공개 버전 경로가 자동 등록되지는 않습니다.

**Deploy Docs Archive Worker** 버튼은 `major`의 전체 경로 설정과 공통 Worker를 배포합니다. 특정 브랜치의 문서를 빌드하는 버튼이 아니며 `react/2.0` 등 보관 브랜치에서 실행하면 job이 생략됩니다. 기본 브랜치에 Worker workflow를 등록하는 #2325는 기존 문서 수동 배포 기능과 별개입니다.

Pages CI는 업로드 후 immutable deployment와 alias 모두를 검사합니다. 이 검사는 이미 공개된 alias 갱신을 되돌리는 단계는 아닙니다. 검증 실패가 나면 브랜치 수정 또는 아래 복구 절차가 필요합니다.

일반 feature 브랜치는 기존 일반 Pages preview를 유지합니다. 버전 경로의 보관본 빌드는 그 checkout의 `archives.json.sourceBranch`와 브랜치 이름이 일치할 때 선택됩니다.

## 새 React 버전 추가

예를 들어 React v3를 보관하는 경우:

1. 최종 v3 소스에서 `react/3.0` 같은 보관 브랜치를 만듭니다. 기존 보관 인프라가 없다면 먼저 backport합니다.
2. **그 브랜치**의 `archives.json`에 아래 항목을 추가합니다. 첫 빌드에는 `origin: ""`도 가능합니다.
3. push하여 Pages CI 검증을 통과시킨 뒤 Summary에서 실제 alias를 얻습니다.
4. **운영 브랜치**의 `archives.json`에도 완성된 항목을 추가합니다. 기존 항목들은 유지합니다. 활성화된 Worker CI가 전체 목록 검증 후 route를 추가합니다.
5. 공개 확인 후 `docs/components/react-version-switcher.tsx`의 `PUBLISHED_VERSIONS`에 메뉴 항목을 추가합니다.

```json
{
  "platform": "react",
  "version": "3.0",
  "sourceBranch": "react/3.0",
  "origin": "https://ACTUAL_BRANCH_ALIAS.pages.dev",
  "probe": {
    "document": "components/action-button",
    "registryItem": "ui/action-button"
  }
}
```

`probe`는 그 버전에 실제로 있는 대표 문서·registry 항목으로 지정합니다. **React 메이저 추가마다 workflow의 버전 분기, Worker 코드, Wrangler 설정을 수정할 필요는 없습니다.** CI의 `build-target.ts`가 등록 목록에서 빌드 버전·출력 디렉터리·캐시·프리뷰 경로를 결정합니다.

공개 목록은 운영 브랜치가 기준입니다. 과거 보관 브랜치에 최신 전체 목록을 계속 backport할 필요는 없습니다. Worker 배포는 전체 목록을 적용하므로 운영 목록에서 기존 항목을 지우면 그 route도 제거됩니다.

## Lynx 등 새 플랫폼 추가

공통 Worker와 원본 검증은 `/lynx/1.0` 같은 다른 플랫폼도 처리합니다. 하지만 **현재 문서 빌드·export는 React만 지원**합니다. 등록만으로 Lynx 문서가 만들어지지는 않습니다.

Lynx 추가 시에는 먼저 다음을 구현·검증합니다.

- `docs/lib/docs-archive.ts`와 `docs/scripts/build-react-archive.ts`, `export-react-archive.ts`에 대응하는 Lynx 빌드/export.
- `/lynx/1.0` 아래 문서·검색·registry·LLM·sitemap·404·정적 파일 및 Lynx 미리보기 번들.
- `scripts/docs-archive/build-target.ts`의 플랫폼 지원 및 Pages workflow의 빌드 명령 선택.

그 뒤 등록·Pages 배포·공통 Worker 배포·메뉴 공개 순서는 React와 같습니다. 지원하지 않는 플랫폼 빌드는 CI가 명시적으로 거부합니다. Worker를 플랫폼별로 새로 만들지는 않습니다.

## 검증이 보장하는 것과 실패 처리

공통 배포 도구는 각 `sourceBranch`의 최신 SHA를 **GitHub에서 읽고**, Pages의 clean source manifest와 일치하는지 검사합니다. Pages가 자기 자신에 대해 보고한 SHA만 신뢰하지 않습니다. 문서 빌드가 아직 진행 중이면 SHA 불일치로 Worker 배포가 중단됩니다. Pages CI 완료 후 `deploy`를 재실행하면 됩니다.

모든 등록 항목의 manifest, canonical, JS, 깊은 문서, 검색 JSON, registry index/item, docs index, LLM 텍스트, 없는 경로의 404를 검사합니다. 하나라도 실패하면 Worker 업로드를 시작하지 않습니다. CI Summary에는 검증한 경로·alias·SHA가 남습니다. **검증 통과만으로 배포 성공을 뜻하지는 않으며, 배포 step 결과와 공개 응답도 확인합니다.**

`DOCS_ARCHIVE_DEPLOY_ENABLED`를 비우거나 `false`로 설정하면 후속 Worker 자동 배포와 수동 `deploy`가 차단됩니다. 현재 서비스와 Pages 콘텐츠 배포는 유지됩니다. 이미 실행 중인 배포를 중단하는 기능은 아니므로 진행 중인 실행도 따로 확인합니다.

## 복구

- **문서 회귀:** 해당 보관 브랜치의 변경을 revert하고 Pages CI로 재배포합니다.
- **정상 산출물로 긴급 고정:** 운영 목록의 `origin`을 보존된 정상 immutable Pages deployment URL로 바꾸고 `sourceSha`를 그 배포의 검증된 SHA로 추가합니다. `sourceBranch`는 콘텐츠 빌드 선택을 위해 유지할 수 있습니다. `sourceSha`가 있으면 원본 검증 시 브랜치 HEAD 대신 그 SHA를 사용합니다.
- **고정 해제:** 콘텐츠 수정·Pages 검증 후 `origin`을 branch alias로 되돌리고 `sourceSha`를 제거합니다. 등록 변경을 반영하면 CI가 Worker를 갱신합니다.
- **Worker 회귀:** 배포 코드를 revert해 CI로 재배포하거나 Cloudflare의 이전 Worker deployment로 rollback합니다. route 추가·삭제도 있었다면 등록 목록과 실제 route를 따로 대조합니다. Worker 버전 rollback만으로 route 설정 복구를 가정하지 않습니다.

원본이 mutable branch alias일 때 과거 Worker로 rollback해도 과거 문서가 복구되지는 않습니다. route 제거 역시 원래 Pages에 같은 경로가 없으면 404가 되므로 문서 복구와 다릅니다.

## CLI·로컬 개발·구현 범위

Pages preview와 공개 경로에서 동일한 registry를 사용합니다.

```sh
bunx @seed-design/cli add ui:action-button --baseUrl https://ACTUAL_BRANCH_ALIAS.pages.dev/react/2.0
bunx @seed-design/cli docs react/components/action-button --baseUrl https://ACTUAL_BRANCH_ALIAS.pages.dev/react/2.0
```

공개 후 baseUrl은 `https://seed-design.io/react/2.0`로 바꾸고 끝에 `/`를 붙이지 않습니다. CLI `--seed-react-version`의 v2 매핑은 별도 CLI 릴리스가 필요합니다. 현재는 `--baseUrl`을 사용합니다. docs index의 기존 `/react/...` 결합 규칙은 `/react/2.0/react/*` 리다이렉트로 호환합니다.

보관 빌드는 해당 브랜치의 전체 Next 정적 빌드 후 필요한 React 문서·자산을 추출합니다. 다른 보관본은 빌드하지 않지만 현재 브랜치의 전체 문서 빌드 비용은 남습니다. `/react/2.0/_assets`에는 자체 파일, `/react/2.0/sitemap.xml`에는 보관본 sitemap이 생성됩니다. Stackflow 예제는 기존 별도 QA 사이트를 사용하므로 그 런타임까지 과거 버전으로 고정하지는 않습니다.

아래 명령은 개발·문제 진단용이며 일상 운영은 Actions를 사용합니다.

```sh
bun --filter @seed-design/docs build:archive:react 2.0
bun test docs/lib/docs-archive.test.ts docs/scripts/export-react-archive.test.ts scripts/docs-archive
bun scripts/docs-archive/deploy.ts --verify-only
bun wrangler deploy --dry-run --config scripts/docs-archive/wrangler.jsonc
```

실배포는 반드시 `deploy.ts`를 거칩니다. `wrangler.jsonc`의 빈 routes를 두고 직접 `wrangler deploy`하면 원본 검사와 전체 route 생성이 생략됩니다. CI는 계정 ID를 secret에서 전달하므로 운영자가 명령에 입력하지 않습니다.

Worker는 보관본의 HTML·자산·검색·registry 요청마다 실행되는 프록시입니다. Static Assets 무료 요청 모델과 다르며 추가 비용은 계정 플랜·호출량·CPU에 따릅니다. R2 비용은 없습니다. 응답은 스트리밍하고 쿠키·인증을 원본에 전달하지 않으며, 공개 도메인에서만 Pages preview noindex 헤더를 제거합니다. 로그·트레이스는 1% 샘플링합니다.

참고: [Cloudflare CI/CD](https://developers.cloudflare.com/workers/ci-cd/external-cicd/), [Pages branch aliases](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/), [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [GitHub workflow_dispatch 조건](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch).
