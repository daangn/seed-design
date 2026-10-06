# React v2 문서 보관

React 2.x 콘텐츠·패키지·의존성을 유지하며 `/react/v2` 보관본만 빌드·배포한다. 공통 Worker와 전체 원본 등록 목록 `scripts/docs-archive/archives.json`은 운영 `dev`에서 관리한다. 이 브랜치에는 운영 registry나 별도 설정 JSON을 두지 않는다.

Pages workflow의 `DOCS_ARCHIVE_SOURCE_BRANCH=react/v2`로 PR 준비 브랜치에서도 같은 채널을 빌드한다. 빌드 선택은 이 채널 이름에서 버전·경로를 얻고, 배포 검증은 checkout SHA와 Pages가 반환한 고정 주소·alias를 검사한다. 빌드가 자동 생성하는 `archive.json`은 version·prefix·sourceSha·sourceDirty를 기록하는 manifest다.

```sh
bun --filter @seed-design/docs build:archive:react v2
bun test docs/lib/docs-archive.test.ts docs/scripts/export-react-archive.test.ts scripts/docs-archive
```

보관 브랜치에 문서 변경을 push하면 해당 Pages 원본이 갱신된다. 공개 Worker 등록은 보관 브랜치의 실제 alias를 검증한 다음 `dev`에서 수행한다. 준비 feature alias를 운영 origin으로 등록하지 않는다. 운영 원본을 정상 고정 Pages 배포와 sourceSha로 되돌리는 복구도 `dev`에서 수행한다.

CLI는 공개 경로의 registry를 다음처럼 사용한다.

```sh
bunx @seed-design/cli add ui:action-button --baseUrl https://seed-design.io/react/v2
```

이 메뉴·CLI 전환 PR은 세 1.x 공개 경로 검증 후 병합한다.

Pages 배포 직후 source SHA가 아직 일치하지 않으면 각 origin에서 10초 간격으로 최대 6회 검증한다. 버전·경로 불일치, dirty 산출물, HTTP·문서·자산 오류는 즉시 실패하며, SHA도 재시도 한도까지 일치하지 않으면 실패한다. 오류에는 확인한 origin과 기대·관측 SHA를 기록한다. 이 대기는 Pages preview 검증에만 적용하며, 운영 Worker의 원본 검증은 즉시 실패하는 기존 동작을 유지한다.
