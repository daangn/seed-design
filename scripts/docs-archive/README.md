# 버전별 문서 운영

버전별 문서는 Pages 브랜치 배포로 제공하고, 공통 Worker 하나가 공개 경로를 해당 Pages 원본으로 연결합니다. 버전별 설정은 [archives.json](./archives.json)에서 관리합니다.

운영 `dev`의 `archives.json`은 공개 경로와 Pages 원본의 등록 목록입니다. 각 보관 브랜치의 같은 파일은 자기 버전의 빌드 선택에 사용하며, 빈 `origin`을 운영 목록에 복사하지 않습니다. 빌드 산출물의 `archive.json`은 버전·경로·소스 SHA를 기록하는 자동 생성 manifest이고 수동 등록 파일이 아닙니다.

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

보관본 빌드는 checkout의 `archives.json.sourceBranch`와 브랜치 이름이 일치할 때 선택됩니다. 해당 브랜치에는 Pages workflow와 보관 빌드 코드가 있어야 합니다. 일반 feature 브랜치는 기존 Pages preview로 배포되며, 브랜치 선택만으로 새 공개 경로가 등록되지는 않습니다.

## 새 버전 추가

최종 소스에서 `react/v3` 같은 보관 브랜치를 만들고 필요한 보관 인프라를 반영합니다. **보관 브랜치**의 `archives.json`에 다음 형태의 항목을 추가합니다. 첫 Pages 배포 전에는 `origin`을 비워둘 수 있습니다.

```json
{
  "platform": "react",
  "version": "v3",
  "sourceBranch": "react/v3",
  "origin": "",
  "probe": {
    "document": "components/action-button",
    "registryItem": "ui/action-button"
  }
}
```

`probe`는 배포 검증에 사용할 대표 문서와 registry 항목의 상대 경로입니다. 해당 버전에 실제로 존재하는 항목을 지정합니다.

Pages CI 성공 후 **Summary → Verified archive preview**에서 실제 alias를 얻습니다. 이 주소를 `origin`에 넣은 완성된 항목을 **Worker 운영 브랜치 `dev`**의 `archives.json`에 추가합니다. Worker CI가 전체 원본을 검증하고 공개 route를 연결합니다. 공개 확인 후 `docs/components/react-version-switcher.tsx`의 `PUBLISHED_VERSIONS`에 메뉴 항목을 추가합니다.

React 메이저 추가에는 Worker 코드나 workflow의 버전 분기를 수정할 필요가 없습니다. 이전 보관 브랜치에 최신 전체 목록을 계속 반영할 필요도 없습니다. 공개 목록은 운영 브랜치가 기준이며, 항목을 삭제하면 Worker 배포 시 해당 route도 제거됩니다.

공통 Worker는 다른 플랫폼도 라우팅할 수 있지만 **현재 보관 빌드·export는 React만 지원**합니다. Lynx를 추가하려면 먼저 전용 빌드·export, 미리보기 번들, `build-target.ts`의 플랫폼 지원과 Pages workflow의 빌드 명령 선택을 구현해야 합니다. 등록 이후 배포 순서는 React와 같습니다.

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

## CLI와 로컬 개발

CLI는 Pages preview와 공개 경로의 registry를 `--baseUrl`로 사용할 수 있습니다. 끝에 `/`를 붙이지 않습니다.

```sh
bunx @seed-design/cli add ui:action-button --baseUrl https://seed-design.io/react/v2
```

로컬 빌드·검증 명령:

```sh
bun --filter @seed-design/docs build:archive:react v2
bun test docs/lib/docs-archive.test.ts docs/scripts/export-react-archive.test.ts scripts/docs-archive
bun scripts/docs-archive/deploy.ts --verify-only
bun scripts/docs-archive/deploy.ts --dry-run
```

일상 배포는 Actions를 사용합니다. 로컬 실배포도 `deploy.ts`를 거쳐야 전체 원본 검사와 route 생성이 적용됩니다.
