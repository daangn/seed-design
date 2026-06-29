# Migration

## Pre-Check Compatibility

업데이트 전에 먼저 `compat` 명령으로 현재 설치된 스니펫의 버전 호환 상태를 확인합니다.

```bash
npx @seed-design/cli@latest compat
```

호환성 이슈가 있으면 종료 코드 `1`로 끝나므로 CI에서도 게이트로 사용할 수 있습니다.

## Install Compatible Snippets

프로젝트에 설치된 SEED 버전과 맞는 스니펫이 필요하면 버전 옵션을 사용합니다. CLI가 해당 버전이 배포된 레지스트리 주소를 자동으로 찾아줍니다.

```bash
npx @seed-design/cli@latest add --seed-react-version 1.2 ui:action-button
```

`add-all`도 동일하게 동작합니다.

```bash
npx @seed-design/cli@latest add-all --seed-react-version 1.2 ui
```

레지스트리 주소를 직접 알고 있다면 `--baseUrl`로 지정할 수도 있습니다.

```bash
npx @seed-design/cli@latest add --baseUrl https://v1-2.seed-design.io ui:action-button
```

## Resolve Custom File Conflicts

CLI는 파일 내용이 다르면 diff를 보여주고 아래 중 하나를 선택하게 합니다.

1. `overwrite`: 기존 파일을 새 내용으로 덮어쓰기
2. `backup`: 기존 파일을 `legacy-<파일명>-<timestamp>`로 백업 후 교체
3. `skip`: 현재 파일 유지

## Decision Guide

- 커스텀 변경이 거의 없고 최신 스니펫 기준으로 재정렬할 때: `overwrite`
- 커스텀 변경을 보존하면서 안전하게 이전할 때: `backup`
- 레거시 구현을 당장 유지하고 점진 전환할 때: `skip`

## Recommended Flow

1. `compat`으로 현재 불일치 항목을 먼저 파악합니다.
2. 대상 컴포넌트를 작은 단위로 나눠서 버전 옵션(`--seed-react-version`)으로 업데이트합니다.
3. 충돌 파일은 우선 `backup`을 선택해 안전망을 확보합니다.
4. 동작/스타일 검증 후 필요하면 백업 파일의 커스텀을 수동 반영합니다.
