# React v1.1 문서 보관

기존 `1.1` 브랜치의 콘텐츠·패키지·의존성을 유지한 보관 브랜치다. 공개 경로는 `/react/v1.1`이며, 최신 개발 브랜치 전체를 병합하지 않는다.

```sh
bun install --frozen-lockfile
bun packages:build && bun rootage:build
bun test docs scripts/docs-archive/tests
bun --filter @seed-design/stackflow-spa build
# NEXT_PUBLIC_ARCHIVE_STACKFLOW_URL에 해당 보관 브랜치 예제의 실제 Pages alias를 지정한다.
bun --filter @seed-design/docs build:archive:react v1.1
```

Pages workflow의 `DOCS_ARCHIVE_SOURCE_BRANCH=react/v1.1`로 자기 보관 채널을 선택한다. 브랜치에는 `archives.json`이나 별도 설정 JSON을 두지 않는다. 빌드·배포 검증은 채널과 checkout SHA, Pages가 반환한 고정 주소·alias만 사용한다. 공통 Worker 배포와 전체 원본 등록 목록은 `dev`에서만 관리한다. 보관 PR 병합 후 CI가 검증한 실제 보관 브랜치 alias를 운영 `dev`의 `archives.json`에 등록한다.

문서 인덱스의 `docUrl`·registry 계약을 유지한다. 인덱스는 해당 브랜치의 React 소스에서 `.archive/index.json`으로 생성하고 export할 때 React 항목만 복사한다.

온라인 빌드는 기존 Figma 인증을 요구한다. 인증 없이 로컬 경로·타입·export를 검사할 때만 `SEED_DOCS_OFFLINE=1`을 사용한다. 이 출력은 `sourceDirty: true`로 표시되어 공개 verifier에서 거부된다. Figma 이미지의 운영 검증은 기존 secrets를 사용하는 CI에서 수행한다.

세 보관본의 Pages 원본을 먼저 준비하고 공개 경로를 확인한 뒤 최신·v2 메뉴와 CLI 전환 PR을 반영한다. 보관본 메뉴는 새 경로를 사용하므로 세 원본이 준비되기 전에 공개 Worker에 등록하지 않는다. 기존 서브도메인의 React 308 리다이렉트는 공통 운영 브랜치의 규칙 생성기를 사용하고, 다른 경로의 서비스는 유지한다.

Next static export는 빈 dynamic params를 허용하지 않으므로 기존 컬렉션도 컴파일하지만 React만 export한다. 보관 산출물에 포함되지 않는 디자인 가이드의 Figma 노드와 표지 이미지는 조회하지 않으며, React 이미지의 정상 처리와 기존 일반 빌드 동작을 유지한다.

Pages 배포 직후 source SHA가 아직 일치하지 않으면 각 origin에서 10초 간격으로 최대 6회 검증한다. 버전·경로 불일치, dirty 산출물, HTTP·문서·자산 오류는 즉시 실패하며, SHA도 재시도 한도까지 일치하지 않으면 실패한다. 오류에는 확인한 origin과 기대·관측 SHA를 기록한다. 이 대기는 Pages preview 검증에만 적용하며, 운영 Worker의 원본 검증은 즉시 실패하는 기존 동작을 유지한다.
