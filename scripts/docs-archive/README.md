# 버전별 문서 배포

기존 Cloudflare Pages의 브랜치별 배포를 유지하고, 공통 Worker 하나가 보관본 경로를 해당 Pages 배포로 전달합니다. Worker에 정적 파일을 합쳐 올리거나 R2를 추가하지 않습니다. 최신 문서와 React v2를 따로 배포할 수 있고, 보관본 문서만 바뀌면 Worker 재배포도 필요 없습니다.

| 문서 | 공개 주소 | 배포 |
| --- | --- | --- |
| 최신 React (`latest`) | `https://seed-design.io/react` | 기존 최신 Pages |
| React v2 | `https://seed-design.io/react/v2` | `2.0` 브랜치 Pages → 공통 Worker |
| 기존 React 1.x | 기존 `v1-2`, `v1-1`, `v1-0.seed-design.io` | 기존 방식 유지 |
| 옛 디자인 가이드 | `https://v0.seed-design.io` | 기존 `v2.seed-design.io` 사이트 도메인 이전, 메뉴에서 숨김 |

앞으로는 플랫폼별 메이저 버전만 보관합니다. 공통 Worker와 배포 검증은 플랫폼·버전에 독립적이며, `archives.json`의 전체 등록 목록을 사용합니다. 현재 실제 문서 빌드는 React 보관본만 지원합니다. Lynx v1을 공개하려면 Lynx용 빌드·export·검색·자산 처리를 먼저 준비해야 합니다. Worker에는 `latest` 경로나 최신 메이저를 가리키는 별칭을 두지 않습니다.

## 빌드와 갱신

1. **최종 React v2 소스 SHA**에서 `2.0` 브랜치를 준비합니다. v3를 개발하는 `major`에서 분기하면 안 됩니다. 이 PR의 보관본 인프라 변경을 그 브랜치에 backport하되, v3의 컴포넌트 제거·콘텐츠·리다이렉트 변경은 가져오지 않습니다.
2. 이후 `2.0`에 문서를 수정하고 push하면 기존 alpha Pages workflow가 `build:archive:react v2`를 실행하고 `docs/out-archive`를 기존 `seed-design-v3` 프로젝트의 해당 브랜치에 배포합니다. 다른 브랜치는 기존 `build`와 `docs/out`을 사용합니다.
3. Worker는 CI가 출력한 **실제 branch alias**를 원본으로 사용합니다. 브랜치 이름에서 호스트를 추측하지 않습니다. Pages 프로젝트의 production branch가 `2.0`이 아닌지 확인하고, 해당 alias를 Cloudflare Access로 차단하지 않습니다.

로컬 빌드(React v2 소스와 workspace 의존성 빌드가 준비된 상태):

```sh
bun --filter @seed-design/docs build:archive:react v2
```

보관본 sitemap은 `/react/v2/sitemap.xml`로 출력합니다. 공개 확인 후 검색 도구에 이 주소를 등록할 수 있습니다.

빌드 시 `NEXT_PUBLIC_REACT_ARCHIVE_VERSION=v2`를 주입해 React 문서 URL·검색·페이지 링크·메타데이터·이미지·JS/CSS 경로를 고정합니다. 최신 빌드는 이 값이 없어 기존 주소를 사용합니다. 보관본은 `/react/v2/_assets`에 자체 정적 파일을 포함하고, 공통 가이드·Lynx 등 보관하지 않는 섹션 링크는 최신 사이트로 이동합니다.

초기 구현은 전체 Next 정적 빌드를 실행한 뒤 React 페이지·검색·registry·LLM 텍스트와 필요한 정적 자산을 추출합니다. React 전용 컴파일 최적화는 포함하지 않습니다. 다른 보관본을 다시 빌드할 필요는 없지만, 이 브랜치 안의 전체 문서 빌드 비용은 남습니다.

`archive.json`은 원본 SHA와 수정 여부를 기록합니다. 로컬 수정이 포함된 산출물은 검증용이며 배포 도구가 공개 연결을 거부합니다. 패키지 메이저 검사만으로 v3 변경이 섞이지 않았음을 보장할 수 없으므로 분기할 소스 SHA를 리뷰해야 합니다.

## CLI와 프리뷰

Pages branch alias에도 동일한 `/react/v2` 경로가 있습니다. 공개 도메인을 연결하기 전부터 그 주소로 검증할 수 있습니다.

```sh
bunx @seed-design/cli add ui:action-button --baseUrl https://ACTUAL_BRANCH_ALIAS.pages.dev/react/v2
bunx @seed-design/cli docs react/components/action-button --baseUrl https://ACTUAL_BRANCH_ALIAS.pages.dev/react/v2
```

공개 후에는 baseUrl을 `https://seed-design.io/react/v2`로 바꿉니다. 주소 끝에 `/`를 붙이지 않습니다. React registry는 `.../react/v2/__registry__/react/...`, LLM 텍스트는 `.../react/v2/llms/react/...`에서 같은 배포의 파일을 제공합니다.

기존 CLI의 `docUrl` 결합 규칙을 유지하기 위해 docs index의 `/react/...`는 그대로 두고 `.../react/v2/react/*`를 실제 문서로 리다이렉트합니다. CLI `--seed-react-version`의 지원 목록은 이 PR에서 바꾸지 않습니다. React v2 선택은 우선 `--baseUrl`로 하며, `--seed-react-version` 지원 버전 추가는 아카이브 공개와 CLI 릴리스 시점에 맞춰 진행합니다.

## 최초 공개 순서

- 옛 디자인 가이드의 Pages 프로젝트에 `v0.seed-design.io`를 Custom Domain으로 등록하고 DNS·TLS·페이지 응답을 확인합니다. 메뉴에는 등록하지 않습니다. 기존 `v2.seed-design.io`는 새 주소 확인 후 같은 경로의 `v0`로 리다이렉트해 외부 링크를 보존합니다. React v2를 이 서브도메인에 연결하지 않습니다.
- `2.0` 브랜치 배포의 실제 alias와 검토한 배포 SHA를 `archives.json`의 `origin`, `sourceSha`에 기록합니다. 현재 빈 값은 공개 전에 채워야 하며, 배포 도구는 빈 값으로 실행되지 않습니다. Pages가 제공하는 `x-robots-tag: noindex`는 프리뷰에 유지합니다.
- 아래 검증 명령이 통과한 뒤 SEED 소유 Cloudflare 계정에서 배포합니다. 새 Pages 프로젝트·R2는 필요 없고, Worker 앱 하나와 `seed-design.io/react/v2*` route 등록이 필요합니다. 도메인 zone의 proxied DNS와 Workers route 권한도 확인합니다.
- 공개 경로의 리다이렉트·본문·정적 파일·검색·404·CLI 설치를 다시 확인한 후 최신 사이트의 메뉴 변경을 공개합니다. 메뉴를 먼저 공개하면 아직 없는 v2 주소로 이동합니다.

검증만 실행(외부 서비스 변경 없음):

```sh
bun scripts/docs-archive/deploy.ts --verify-only
```

검증 후 실제 Worker 생성/갱신(저장소 루트에서 실행):

```sh
bun scripts/docs-archive/deploy.ts --account-id SEED_CLOUDFLARE_ACCOUNT_ID
```

`deploy.ts`가 최초 실행에서는 Worker 앱과 경로를 생성하고 이후에는 같은 앱을 갱신합니다. 대시보드에서 빈 Worker를 미리 만들 필요는 없습니다. 계정·zone·proxied DNS·권한 준비는 먼저 필요합니다.

배포 도구는 **모든 등록 항목**의 clean source manifest, canonical, JS, 깊은 문서, 검색, registry, docs index, LLM 응답과 미존재 경로의 404를 검사합니다. 검증이 끝난 전체 목록으로 Wrangler의 `--route` 인자를 만들며, 같은 `archives.json`이 Worker 코드에 포함됩니다. 버전별 환경 변수나 Worker 앱을 추가하지 않습니다. `--dry-run`은 같은 원본 검증 후 업로드 없이 번들만 검사합니다.

`wrangler.jsonc`의 빈 `routes`는 공통 설정의 기본값입니다. 실배포는 반드시 `deploy.ts`로 실행합니다. 직접 `wrangler deploy`하면 검증과 전체 route 생성이 생략됩니다. 공개 목록은 운영용 최신 checkout에서 관리하고, 오래된 보관 브랜치에서는 Pages 콘텐츠만 배포합니다. Worker 배포는 전체 목록을 반영하므로 기존 항목 삭제도 공개 경로 삭제에 해당합니다.

현재 CI는 Pages 문서 배포만 자동화합니다. Worker 신규 생성·라우팅 변경은 위 명령으로 운영자가 실행합니다. HTML을 요청마다 수정하지 않고 응답을 스트리밍하며, 쿼리·조건부 요청·캐시 헤더·상태 코드를 보존합니다. 인증·쿠키는 Pages 원본에 전달하지 않습니다. public 도메인 응답에서만 Pages preview의 noindex 헤더를 제거합니다.

Worker는 보관본의 HTML·검색·registry·정적 자산 요청마다 실행됩니다. Static Assets 무료 요청 모델과는 다르며, 실제 추가 비용은 계정 플랜과 요청 수에 달려 있습니다. 방문자 수만으로 호출 수를 확정하지 않습니다. 로그·트레이스는 1% 샘플링합니다.

## 새 버전이나 플랫폼 추가

React v3를 보관하거나 Lynx v1을 처음 공개할 때의 순서는 다음과 같습니다.

1. 해당 버전 소스에서 보관 브랜치를 준비합니다. React는 기존 `build:archive:react v3`를 재사용할 수 있습니다. 현재 CI의 `2.0 → v2` 분기는 새 React 브랜치와 버전도 선택하도록 확장해야 합니다. 버전 문자열만 바꿔 다른 메이저의 소스를 빌드하지 않습니다.
2. **새 플랫폼인 Lynx는 빌드 지원부터 추가합니다.** `docs/lib/docs-archive.ts`, `docs/scripts/build-react-archive.ts`, `export-react-archive.ts`는 React용입니다. Lynx 라우트·검색·LLM·registry·미리보기 번들과 자산을 `/lynx/v1` 아래로 모으는 빌드/export와 CI 분기를 구현·검증해야 합니다. Worker 등록만으로 이 산출물이 생기지는 않습니다.
3. 해당 Pages 배포에서 `/{platform}/{version}/archive.json`, 문서, `_assets/_next`, `api/search`, `__registry__/{platform}`, `__docs__/index.json`, `llms/{platform}`, 404가 동작하는지 확인합니다. 아래 항목을 **기존 항목들을 유지한 채** `archives.json`에 추가합니다.
4. 운영용 checkout에서 전체 목록을 검증하고 공통 Worker를 한 번 재배포합니다. `worker.ts`, `verify.ts`, `wrangler.jsonc`를 버전마다 복사하거나 고칠 필요는 없습니다.
5. 공개 응답을 확인한 뒤 해당 플랫폼 버전 메뉴에 새 항목을 추가합니다. 메뉴 공개 시점은 Worker 연결과 별도로 관리합니다. `latest`는 계속 버전 없는 Pages 주소를 사용합니다.

등록 형태 예시(주소·SHA는 실제 검토한 값으로 교체):

```json
{
  "platform": "lynx",
  "version": "v1",
  "origin": "https://ACTUAL_BRANCH_ALIAS.pages.dev",
  "sourceSha": "REVIEWED_40_CHARACTER_COMMIT_SHA",
  "probe": {
    "document": "components/action-button",
    "registryItem": "ui/action-button"
  }
}
```

`probe`에는 **그 버전에 실제로 존재하는** 대표 문서와 registry 항목을 지정합니다. 배포 검증은 특정 컴포넌트에 고정되어 있지 않습니다.

공개 이후의 일반 문서 수정은 기존처럼 보관 브랜치에 push하면 됩니다. Pages branch alias가 새 배포를 가리키므로 Worker를 다시 배포하지 않습니다. `sourceSha`는 콘텐츠를 고정하는 포인터가 아니라 **다음 Worker 배포 시 확인할 검토 기준**입니다. Worker를 다시 배포할 때는 각 alias의 현재 검토된 SHA로 목록을 갱신합니다. 즉, Worker 재배포 시 전체 보관본의 응답 확인 비용은 있지만 전체 문서를 다시 빌드하는 비용은 없습니다.

## 검증과 복구

```sh
bun test docs/lib/docs-archive.test.ts docs/scripts/export-react-archive.test.ts scripts/docs-archive
bun test docs/components/react-version-switcher.test.tsx docs/app/_llms
bun wrangler deploy --dry-run --config scripts/docs-archive/wrangler.jsonc
```

Pages preview 및 공개 URL에서 데스크톱/모바일 메뉴(`v2` 선택, V0 없음), `latest` 이동, 배너, 깊은 페이지 새로고침, 페이지 내 이동, 이미지, 검색 결과, Markdown 복사, registry 설치를 확인합니다. 미존재 URL은 404여야 합니다. `/react`, `/lynx`, `/react/latest`, `/react/v20`이 이 보관본으로 잘못 연결되지 않는지도 확인합니다.

문서 내용의 회귀는 `2.0` 브랜치에서 해당 변경을 revert하고 재배포합니다. 긴급 복구는 `archives.json`의 해당 항목에 보존된 정상 immutable Pages deployment URL과 그 SHA를 지정해 Worker 원본을 고정하고, 수정 완료 후 branch alias로 돌립니다. Worker 자체 회귀는 이전 Worker 배포로 rollback합니다. route 제거는 원래 Pages가 같은 경로를 제공하지 않으면 404가 되므로 문서 복구와 같지 않습니다.

Stackflow iframe 예제는 기존 별도 QA 사이트를 사용합니다. 이 PR은 QA 앱 자체의 버전별 배포를 추가하지 않으므로, React v2 시점의 Stackflow 런타임까지 보관하려면 해당 QA 배포도 별도로 고정해야 합니다.

Cloudflare 참고: [Pages branch aliases](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [Worker routes](https://developers.cloudflare.com/workers/configuration/routing/routes/), [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
