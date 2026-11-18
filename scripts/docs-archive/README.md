# 버전별 문서 운영

버전별 문서는 Pages 브랜치 배포로 제공하고, 공통 Worker 하나가 공개 경로를 해당 Pages 원본으로 연결합니다. 버전별 설정은 [archives.json](./archives.json)에서 관리합니다.

운영 `dev`의 `archives.json`은 전체 공개 버전의 소스 브랜치·버전·Pages origin·검증 대상을 관리합니다. 공개 문서 URL과 Worker route는 플랫폼·버전에서 계산합니다. 보관 브랜치에는 `archives.json`이나 별도 설정 JSON을 두지 않고 자기 Pages 배포만 담당합니다. 빌드 산출물의 `archive.json`은 버전·경로·소스 SHA를 기록하는 자동 생성 manifest입니다.

```text
seed-design.io/{platform}/{version}/* → 공통 Worker → 해당 브랜치의 Pages 원본
```

최신 문서는 기존 `/react`, `/lynx` 경로를 사용합니다. Worker에는 `latest` 별칭을 등록하지 않습니다.

## 브랜치와 버전 이름

보관 브랜치와 공개 경로는 `react/v2`, `lynx/v1`처럼 플랫폼과 `v` 접두사를 붙인 메이저 버전을 조합합니다. 패치 버전은 사용하지 않습니다.

앞으로는 메이저별로 보관합니다. `v2`는 React 2.x 전체의 문서 채널이므로 2.5.0의 문서 수정도 같은 브랜치에 반영합니다. React·CSS 등 개별 패키지의 마이너·패치 버전과 문서 채널은 별개입니다. 기존 React 1.0·1.1·1.2 보관본의 주소는 유지하며, 메뉴에는 `v1.0`·`v1.1`·`v1.2`로 표시합니다. 향후 이관할 때도 이 세 보관본은 `react/v1.0`처럼 마이너 채널을 사용할 수 있습니다.

문서 수정 PR은 해당 보관 브랜치를 대상으로 만듭니다. 최신 개발 브랜치 전체를 보관 브랜치에 계속 병합하지 않습니다.

## 문서 수정과 수동 배포

보관 브랜치에 문서 변경을 push하면 Pages CI가 해당 브랜치만 빌드·배포·검증합니다. 연결된 공개 경로에도 반영되며 Worker 재배포나 SHA 수동 갱신은 필요 없습니다.

수동으로 다시 배포하려면 [deploy-seed-design-docs-alpha-pages](https://github.com/daangn/seed-design/actions/workflows/deploy-seed-design-docs-alpha-pages.yml)의 **Run workflow → Use workflow from**에서 해당 보관 브랜치를 선택합니다.

보관본 빌드는 `react/v2` 같은 채널 이름에서 버전과 경로를 얻습니다. 보관 브랜치의 Pages workflow는 `DOCS_ARCHIVE_SOURCE_BRANCH`로 자기 채널을 명시하여 feature PR에서도 동일한 보관 빌드·검증을 실행합니다. 이 변수가 없는 일반 feature 브랜치는 기존 Pages preview를 빌드합니다. 운영 원본 등록 여부와 rollback 고정 SHA는 빌드 선택에 영향을 주지 않습니다.

## 새 버전 추가

최종 소스에서 `react/v3` 같은 보관 브랜치를 만들고 필요한 보관 빌드·export·Pages 검증을 반영합니다. Pages workflow에 `DOCS_ARCHIVE_SOURCE_BRANCH=react/v3`를 명시합니다. 브랜치 이름과 명시한 채널에서 빌드를 선택하므로 운영 등록 파일이 필요하지 않습니다.

Pages CI 성공 후 **Summary → Verified archive preview**에서 실제 고정 주소·alias·소스 SHA를 확인합니다. 보관 브랜치의 검증된 alias를 운영 `dev`의 `archives.json`에 추가합니다. 준비 feature alias는 운영 origin으로 등록하지 않습니다.

```json
{
  "platform": "react",
  "version": "v3",
  "sourceBranch": "react/v3",
  "origin": "https://<CI에서 확인한 실제 alias>.pages.dev",
  "probe": {
    "document": "components/action-button",
    "registryItem": "ui/action-button"
  }
}
```

`probe`는 운영 원본 검증에 사용할 실제 문서와 registry 항목의 상대 경로입니다. 운영 목록에는 빈 origin을 등록하지 않습니다. Worker CI가 전체 원본을 검증하고 공개 route를 연결한 뒤 버전 메뉴를 전환합니다.

이전 보관 브랜치에 최신 전체 목록을 반영할 필요가 없습니다. 공개 목록은 `dev`가 기준이며 항목을 삭제하면 Worker 배포 시 해당 route도 제거됩니다.

보관 빌드·export는 React와 Lynx를 지원합니다. 두 플랫폼은 같은 경로 helper와 exporter를 쓰며, 빌드할 수 있는 채널은 소스 패키지 버전으로 정합니다.

- React: `packages/react`의 메이저와 같은 `react/vN`. 기존 1.x는 마이너 채널 `react/v1.0`·`react/v1.1`·`react/v1.2`를 유지합니다.
- Lynx: `packages/lynx-react`의 메이저와 같은 `lynx/vN`. 0.x 문서는 `lynx/v0`으로 보관하며 마이너 채널은 없습니다.

Lynx 보관본은 예제 bundle·manifest·`web-core.css`를 `/lynx/v0/_assets/__lynx__/`에 함께 담으므로 QR 코드와 web preview가 보관본의 bundle을 사용합니다.

## Worker 설정과 배포

기존 Pages CI의 저장소 secrets `CF_ACCOUNT_ID`·`CF_API_TOKEN`을 사용합니다. 토큰에는 Pages 배포 권한 외에 대상 계정·zone의 **Workers Scripts: Edit**, **Workers Routes: Edit**, **Zone: Read** 권한이 필요합니다.

[Deploy Docs Archive Worker](https://github.com/daangn/seed-design/actions/workflows/deploy-docs-archive-worker.yml)는 운영 브랜치 **`dev`**에서 실행합니다.

- `verify`: 전체 Pages 원본과 소스 SHA를 검사합니다. Cloudflare 쓰기 권한은 사용하지 않습니다.
- `deploy`: 원본 검증 후 공통 Worker와 등록 목록 전체의 route를 배포합니다. 특정 브랜치의 문서를 빌드하는 작업은 아닙니다.

저장소 변수 `DOCS_ARCHIVE_DEPLOY_ENABLED=true`일 때만 배포할 수 있습니다. 활성화 후 운영 브랜치에 Worker 코드·등록 목록·관련 workflow 변경이 반영되면 자동 배포합니다. README 변경은 Worker 자동 배포 대상에서 제외됩니다. Worker는 CI가 생성하므로 대시보드에서 미리 만들 필요가 없습니다.

**Run workflow** 버튼을 등록하려면 기본 브랜치에도 Worker workflow 파일이 있어야 합니다. 실제 실행 브랜치는 `dev`를 선택합니다. 운영 브랜치를 바꿀 때는 workflow의 push 대상·ref 제한·최신 SHA 검사 대상을 함께 변경합니다.

## 검증과 복구

Pages CI는 고정 배포 주소와 브랜치 alias를 모두 검사합니다. Worker CI는 모든 원본의 manifest·canonical·문서·자산·검색·registry·LLM·404와 GitHub 소스 SHA를 검사하며, 실패하면 Worker를 업로드하지 않습니다. Pages 빌드가 진행 중이라 SHA가 불일치하면 완료 후 Worker 작업을 다시 실행합니다.

Pages 검증 실패가 이미 갱신된 alias를 자동으로 되돌리지는 않습니다. 문서 회귀는 보관 브랜치의 변경을 revert하고 Pages CI로 재배포합니다.

긴급히 정상 산출물로 고정하려면 운영 목록의 `origin`을 정상 고정 Pages 배포 주소로 바꾸고 `sourceSha`에 해당 배포의 SHA를 지정합니다. 수정 후 브랜치 alias로 복귀할 때는 `sourceSha`를 제거합니다.

Worker 회귀는 코드를 revert해 재배포하거나 Cloudflare에서 이전 Worker 배포로 rollback합니다. Worker rollback은 브랜치 alias의 문서나 route 설정까지 복구하지 않으므로 별도로 확인합니다.

`DOCS_ARCHIVE_DEPLOY_ENABLED`를 비우거나 `false`로 설정하면 후속 Worker 배포를 차단합니다. 현재 서비스와 Pages 콘텐츠 배포는 유지됩니다.

## React 1.x 경로 이관

기존 `1.0`·`1.1`·`1.2`에서 `react/v1.0`·`react/v1.1`·`react/v1.2`를 만들고, 각 버전의 문서·패키지·의존성은 유지한 채 보관 빌드와 Pages 검증을 반영합니다. 1.0·1.1에는 문서 인덱스 생성이 필요하고, 1.0에는 공통 LLM 경로의 호환 출력도 추가합니다.

Pages 고정 주소와 alias를 검증한 뒤 운영 목록에 등록합니다. 세 공개 경로를 확인한 다음 최신·v2·1.x 메뉴를 `/react/v1.x`로 전환합니다.

기존 서브도메인의 React 문서는 Cloudflare Single Redirects로 이동합니다. `bun scripts/docs-archive/legacy-redirects.ts`가 **등록된** 1.x 채널만 대상으로 하는 규칙을 출력합니다. `/react`·`/react/*`만 308 이동하며 query를 보존합니다. 기존 ruleset 전체를 덮어쓰지 않고 이 규칙들만 추가합니다. 다른 경로는 기존 서비스를 유지합니다.

규칙 반영에는 [Single Redirect Edit 권한](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-api/)과 프록시된 기존 호스트가 필요합니다. 공개 경로 검증 전에는 규칙을 반영하지 않습니다. 복구할 때는 해당 규칙만 비활성화하고 원본 Pages 서비스를 유지합니다.

## CLI와 로컬 개발

CLI는 Pages preview와 공개 경로의 registry를 `--baseUrl`로 사용할 수 있습니다. 끝에 `/`를 붙이지 않습니다.

```sh
bunx @seed-design/cli add ui:action-button --baseUrl https://seed-design.io/react/v2
```

로컬 빌드·검증 명령:

```sh
bun --filter @seed-design/docs build:archive:react v2
bun --filter @seed-design/docs build:archive:lynx v0
bun test docs/lib/docs-archive.test.ts docs/lib/archive-cli-commands.test.ts docs/scripts/export-archive.test.ts scripts/docs-archive
bun scripts/docs-archive/deploy.ts --verify-only
bun scripts/docs-archive/deploy.ts --dry-run
```

일상 배포는 Actions를 사용합니다. 로컬 실배포도 `deploy.ts`를 거쳐야 전체 원본 검사와 route 생성이 적용됩니다.

1.x 보관본은 버전 메뉴에 세 새 경로를 포함하므로 세 Pages 원본을 모두 준비한 뒤 운영 Worker에 등록한다. `dev`·v2 메뉴와 CLI 주소 전환 PR은 세 공개 경로의 검증 후 반영한다. 최초 준비 PR은 원본 `1.x`가 아니라 새 `react/v1.x`를 대상으로 하며, 준비 브랜치의 CI는 `DOCS_ARCHIVE_SOURCE_BRANCH`로 보관 채널을 명시한다. 준비 브랜치의 alias를 운영 origin으로 쓰지 않고, 보관 브랜치 병합 후 CI에서 검증된 alias와 SHA를 등록한다.

Pages 배포 직후 source SHA가 아직 일치하지 않으면 각 origin에서 10초 간격으로 최대 6회 검증한다. 버전·경로 불일치, dirty 산출물, HTTP·문서·자산 오류는 즉시 실패하며, SHA도 재시도 한도까지 일치하지 않으면 실패한다. 오류에는 확인한 origin과 기대·관측 SHA를 기록한다. 이 대기는 Pages preview 검증에만 적용하며, 운영 Worker의 원본 검증은 즉시 실패하는 기존 동작을 유지한다.
