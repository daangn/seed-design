# Migration

## 호환 버전 스니펫 받기

프로젝트의 `@seed-design/react` 버전과 맞는 스니펫이 필요하면 `--baseUrl`을 사용합니다.

```bash
npx @seed-design/cli@latest add --baseUrl https://1-0.seed-design.pages.dev ui:action-button
```

```bash
npx @seed-design/cli@latest add-all --baseUrl https://1-1.seed-design.pages.dev ui
```

## 기존 커스텀 파일과 충돌할 때

CLI는 파일 내용이 다르면 diff를 보여주고 아래 중 하나를 선택하게 합니다.

1. `overwrite`: 기존 파일을 새 내용으로 덮어쓰기
2. `backup`: 기존 파일을 `legacy-<파일명>-<timestamp>`로 백업 후 교체
3. `skip`: 현재 파일 유지

## 선택 가이드

- 커스텀 변경이 거의 없고 최신 스니펫 기준으로 재정렬할 때: `overwrite`
- 커스텀 변경을 보존하면서 안전하게 이전할 때: `backup`
- 레거시 구현을 당장 유지하고 점진 전환할 때: `skip`

## 추천 운영 순서

1. 대상 컴포넌트를 작은 단위로 나눠서 업데이트합니다.
2. 충돌 파일은 우선 `backup`을 선택해 안전망을 확보합니다.
3. 동작/스타일 검증 후 필요하면 백업 파일의 커스텀을 수동 반영합니다.
