# React v1.2 문서 보관

기존 `1.2` 브랜치의 콘텐츠·패키지·의존성을 유지한 보관 브랜치다. 공개 경로는 `/react/v1.2`이며, 최신 개발 브랜치 전체를 병합하지 않는다.

```sh
bun install --frozen-lockfile
bun packages:build && bun rootage:build
bun test docs scripts/docs-archive/tests
bun --filter @seed-design/stackflow-spa build
# NEXT_PUBLIC_ARCHIVE_STACKFLOW_URL에 해당 보관 브랜치 예제의 실제 Pages alias를 지정한다.
bun --filter @seed-design/docs build:archive:react v1.2
```

Pages workflow는 `react/v1.2` 채널을 명시하여 PR 준비 브랜치에서도 같은 보관 빌드를 선택하고 보관 산출물을 배포한다. 고정 배포 주소와 alias의 manifest·소스 SHA·문서·자산·검색·registry·LLM·404 검증을 통과한 뒤 Summary의 실제 alias만 운영 `dev`의 `archives.json`에 등록한다. 여기의 빈 `origin`은 최초 Pages 빌드용이며 운영 Worker 등록용이 아니다.

문서 인덱스의 `docUrl`·registry 계약을 유지한다. 인덱스는 해당 브랜치의 React 소스에서 `.archive/index.json`으로 생성하고 export할 때 React 항목만 복사한다.

세 보관본의 Pages 원본을 먼저 준비하고 공개 경로를 확인한 뒤 최신·v2 메뉴와 CLI 전환 PR을 반영한다. 보관본 메뉴는 새 경로를 사용하므로 세 원본이 준비되기 전에 공개 Worker에 등록하지 않는다. 기존 서브도메인의 React 308 리다이렉트는 공통 운영 브랜치의 규칙 생성기를 사용하고, 다른 경로의 서비스는 유지한다.

보관 산출물에 포함되지 않는 디자인 가이드의 Figma 노드와 표지 이미지는 조회하지 않는다. React 이미지 처리와 일반 빌드 동작은 유지한다.
