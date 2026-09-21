# 2026년 10월 1일 문서 도메인 전환

이 문서는 저장소 운영자를 위한 체크리스트다. `content/` 밖에 두어 사용자 문서 라우트로 배포하지 않는다.
메뉴 PR은 `major` 대상, 마일스톤은 `v3.0`이다. 실제 도메인 변경과 v3 공개는 10월 1일에 수동 진행한다.

## 최종 연결

| 도메인 | 콘텐츠 | 연결 대상 |
| --- | --- | --- |
| `seed-design.io` | 최신 v3 | `seed-design-v3`의 최신 릴리스 배포 |
| `v3.seed-design.io` | 루트와 같은 최신 v3 | 루트와 동일한 배포 대상 |
| `v2.seed-design.io` | 유지보수 중인 v2 | `2.0` 브랜치 alias, 예상 `2-0.seed-design-v3.pages.dev` |
| `v0.seed-design.io` | 기존 `v2.seed-design.io`의 옛 문서 | 기존 v2를 제공하던 Pages 프로젝트·배포 |
| `v1-2.seed-design.io` | 기존 v1.2 | 변경 없음 |
| `v1-1.seed-design.io` | 기존 v1.1 | 변경 없음 |
| `v1-0.seed-design.io` | 기존 v1.0 | 변경 없음 |

Pages 프로젝트 이름의 `v3`는 패키지 메이저 버전과 별개다. 새 프로젝트를 만들지 않는다.
최신 도메인 둘은 같은 콘텐츠를 제공하며, `v3`에서 루트로의 리다이렉트는 추가하지 않는다.
v2 전체를 v0로 리다이렉트하지 않는다. v2 주소를 실제 v2 문서에 재사용하기 때문이다.

## 출시 전 준비

### 1. 운영 배포 확인 및 기록

Cloudflare의 **Workers & Pages → 해당 프로젝트 → Deployments / Custom domains**와
**seed-design.io zone → DNS → Records**에서 다음을 기록한다. 저장소 브랜치 HEAD를 운영 SHA로 추정하지 않는다.

| 항목 | 전환 직전 확인값 |
| --- | --- |
| `seed-design.io`의 CNAME 대상·Proxy 상태 | 미확인 — 대시보드에서 기록 |
| 해당 배포의 ID·전체 Git SHA·브랜치·고유 preview URL | 미확인 — 대시보드에서 기록 |
| `seed-design-v3` Production branch | 미확인 — 대시보드에서 기록 |
| `v3.seed-design.io`의 CNAME 대상·Proxy 상태 | 미확인 — 대시보드에서 기록 |
| 기존 `v2.seed-design.io`의 Pages 프로젝트·CNAME 대상·Proxy 상태 | 미확인 — 대시보드에서 기록 |
| 기존 v2의 배포 ID·SHA·고유 preview URL | 미확인 — 대시보드에서 기록 |
| v1 도메인 세 개의 CNAME 대상 | 미확인 — 변경 전후 비교용 |
| 관련 Redirect Rules / Page Rules / Worker routes | 미확인 — 문서 요청을 가로채는 규칙 확인 |

기존 v2의 프로젝트는 `seed-design-v3`라고 가정하지 않는다.
인증 정보는 이 기록이나 PR에 넣지 않는다. 도메인에 연결된 배포와 SHA를 확인하지 못하면 `2.0` 분기를 보류한다.

### 2. 현재 문서에서 `2.0` 분기

현재 루트가 제공하는 배포 SHA에서 `2.0`을 만든다. 출시까지 v2 문서 변경이 더 있으면 v3 공개 직전 최종 v2 변경만 반영한다.
major 브랜치를 v2로 병합하지 않는다.

```sh
# DEPLOYED_V2_SHA에는 위에서 검증한 전체 SHA를 입력한다.
git fetch origin
git show --no-patch "$DEPLOYED_V2_SHA"
git branch 2.0 "$DEPLOYED_V2_SHA"
git push origin refs/heads/2.0:refs/heads/2.0
```

원격에 `2.0`이 이미 생겼다면 위 명령을 재실행하거나 강제 push하지 말고 기존 브랜치와 SHA를 비교한다.
별도 worktree에서 `2.0` 대상 준비 PR을 만들고, alpha workflow의 배포 전 링크 검사만 먼저 반영한다.
메뉴는 출시 전에는 `v2.0 (latest)`를 유지한다. 아래 출시용 메뉴 변경은 `2.0` 대상 별도 PR로 준비해 10월 1일에 반영한다.

- 이 major PR의 메뉴 목록과 배너 변경만 가져온다.
- `ReactVersionSwitcher`의 `CURRENT_VERSION`을 `"v2.0"`으로 지정한다.
- 공개 패키지·registry·major 콘텐츠는 가져오지 않는다.

### 3. v2 preview 배포 및 검증

기존 `deploy-seed-design-docs-alpha-pages.yml`은 main/dev 이외 브랜치를 대상으로 하며,
`--project-name=seed-design-v3 --branch=${{ github.ref_name }}`로 업로드한다.
`2.0`을 새 Production branch로 설정하지 않는다.

```sh
gh workflow run deploy-seed-design-docs-alpha-pages.yml --ref 2.0
gh run list --workflow deploy-seed-design-docs-alpha-pages.yml --branch 2.0 --limit 5
```

첫 브랜치 push는 path filter 때문에 배포되지 않을 수 있으므로 수동 실행 결과를 확인한다.
첫 배포 전에 `2.0` 브랜치에 배포 전 링크 검사 단계가 포함됐는지 확인한다.
이후 docs 등 workflow 대상 경로 변경은 push로 배포된다. 일반 PR은 기존처럼 preview 배포 후 링크 검사한다.

Cloudflare Deployment details에 표시된 alias를 기록한다. 예상값은 `2-0.seed-design-v3.pages.dev`다.
고유 배포 hash URL은 복구 증거로 보관하고, 유지보수 도메인에는 계속 갱신되는 브랜치 alias를 사용한다.
홈·`/react`·실제 컴포넌트 문서·CSS/이미지·`/__registry__/`에서 사용 중인 JSON 응답을 확인한다.
대표 v2 registry JSON과 문서의 응답을 보관해 전환 뒤 비교한다.
Stackflow 예제는 별도 `qa.seed-design.io`에 의존하므로 예제 실행도 확인한다. 문서 도메인 전환만으로 예제 서버가 버전 고정되지는 않는다.

## 10월 1일 전환 순서

### 1. 변경 전 점검

- 위 표의 설정과 복구 URL을 채운다. v2 preview 및 v3 출시 배포의 빌드·링크 검사를 확인한다.
- v3 메뉴 PR은 major에 준비하되 출시 전에 현재 루트로 배포하지 않는다.
- `2.0` 출시용 메뉴 PR을 반영하고 preview 배포를 확인한다. 현재 버전은 v2, latest는 v3여야 한다.
- 도메인 전환 동안 자동 배포·수동 배포가 겹치지 않도록 릴리스 담당자가 조율한다.

### 2. 옛 문서를 v0로 먼저 연결

1. 기존 `v2.seed-design.io`를 제공하는 Pages 프로젝트를 연다.
2. **Custom domains → Set up a custom domain**에서 `v0.seed-design.io`를 등록한다.
3. **DNS → Records**에서 `v0` CNAME을 기존 v2와 동일한 Pages 대상으로 연결한다. 브랜치 alias라면 **Proxied**를 켠다.
4. 도메인 상태가 Active이고 HTTPS와 대표 옛 문서가 정상인지 확인한다. 루트나 v2로 되돌리는 redirect가 있으면 새 호스트 기준으로 조정한다.
5. v0 확인 전에는 기존 v2 연결을 해제하지 않는다.

### 3. v2를 `2.0` 브랜치로 연결

1. 기존 v2가 다른 Pages 프로젝트에 등록돼 있으면 그 프로젝트의 Custom domains에서 연결을 해제한다. 프로젝트·배포 자체는 삭제하지 않는다.
2. `seed-design-v3 → Custom domains`에 `v2.seed-design.io`를 등록한다. 이미 같은 프로젝트에 있으면 재등록하지 않는다.
3. 도메인 활성화 후 DNS에서 `v2` CNAME 대상을 **실제 확인된 `2.0` alias**로 수정하고 **Proxied**를 켠다.
4. HTTPS·v2 메뉴 체크·대표 문서·registry JSON을 확인한다. 기존 옛 문서나 v3가 나오면 다음 단계로 넘어가지 않는다.

### 4. 루트와 v3를 최신 릴리스로 맞추기

1. 기존 릴리스 경로로 v3 문서를 배포한다. 현재 Production branch를 임의로 main/dev/major 중 하나로 변경하지 않는다.
2. `seed-design.io`가 검증한 v3 릴리스 배포를 제공하도록 연결한다.
3. `v3.seed-design.io`도 동일한 Pages 대상에 연결한다. 기존 별도 branch alias가 남아 있다면 루트와 맞춘다.
4. 두 도메인에서 v3가 선택되고 이전 버전 안내 배너가 숨겨지는지 확인한다.
5. Production branch와 다른 branch alias를 이용할 경우 해당 CNAME은 반드시 Proxied로 유지한다.

### 5. 완료 확인

- [ ] 루트와 v3의 홈·React 상세 문서가 같은 릴리스다.
- [ ] 메뉴 순서: v3.0 (latest), v2.0, v1.2, v1.1, v1.0, v0 (legacy).
- [ ] 현재 항목 클릭은 이동하지 않고, 다른 항목은 올바른 주소를 새 탭으로 연다.
- [ ] 데스크톱·모바일에서 메뉴와 현재 버전 체크가 정상이다.
- [ ] v2 문서·registry 응답은 검증한 v2 preview와 같다. v3 registry로 바뀌지 않았다.
- [ ] v0 옛 문서, 기존 v1 세 도메인, 정적 자산과 예제가 정상이다.
- [ ] Redirect loop, HTTPS 오류, 404, 예상하지 않은 Access 로그인 요구가 없다.
- [ ] 전환 시각·최종 DNS 대상·배포 ID·SHA·검증 결과를 기록했다.

## 복구

실패한 단계에서 중단하고 해당 도메인부터 복구한다. DNS만 복원해도 되는지 Pages 프로젝트 연결까지 바뀌었는지 구분한다.

- v2가 잘못 연결됐으면 새 프로젝트의 연결을 해제하고, 기록한 옛 프로젝트에 다시 등록한 뒤 기존 DNS 대상·Proxy 상태를 복원한다.
- 루트/v3 콘텐츠가 잘못됐으면 기록한 이전 배포로 복구한다. branch alias가 자동 갱신될 수 있으므로 그 사이 추가 배포를 막고 고유 배포 URL로 콘텐츠를 대조한다.
- v3 배포 전에 루트가 branch alias에 연결돼 있었다면 그 DNS 대상도 복원한다. Production 배포 rollback만으로 branch alias가 복구됐다고 판단하지 않는다.
- 도메인 연결·인증서가 Active로 돌아온 뒤 홈·React 문서·registry 응답을 재검증한다. UI 상태만으로 복구 완료를 선언하지 않는다.
- v0의 추가 연결은 정상 동작하면 유지한다. 과거 Pages 프로젝트와 배포는 전환 과정에서 삭제하지 않는다.

## 참고

- [Cloudflare: Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/) — CNAME만 만들지 말고 Pages에 도메인을 등록한다.
- [Cloudflare: Custom branch aliases](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/) — 등록·활성화 뒤 CNAME에 branch alias를 지정하고 Proxied로 설정한다.
- [Cloudflare: Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) — `2.0`의 alias는 `2-0`이며 Deployment details의 실제 값을 확인한다.
