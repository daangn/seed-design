# Migration (스니펫)

> 패키지 버전 업그레이드·호환 진단(react↔css, changelog, 마이그레이션 경로)은 `upgrade.md`를 참고하세요. 이 문서는 **스니펫**을 프로젝트 버전에 맞추고 파일 충돌을 해결하는 방법입니다.

## Pre-Check Compatibility

업데이트 전에 먼저 `compat` 명령으로 현재 설치된 스니펫의 버전 호환 상태를 확인합니다.

```bash
npx @seed-design/cli@latest compat
```

호환성 이슈가 있으면 종료 코드 `1`로 끝나므로 CI에서도 게이트로 사용할 수 있습니다. (설치된 react↔css peer 호환까지 보려면 `upgrade.md`의 `compat --json`을 참고하세요.)

## Install Compatible Snippets

프로젝트의 `@seed-design/react` 버전과 맞는 스니펫이 필요하면 `--baseUrl`로 버전별 배포를 가리킵니다. 도메인 패턴은 `{major}-{minor}.seed-design.pages.dev`입니다(예: `1-0`, `1-1`, `1-2`). 사용 가능한 버전은 문서 사이트의 버전 스위처에서 확인합니다.

```bash
# 예: 1.0.x 스니펫
npx @seed-design/cli@latest add --baseUrl https://1-0.seed-design.pages.dev ui:action-button
```

```bash
# 예: 1.1.x 스니펫
npx @seed-design/cli@latest add-all --baseUrl https://1-1.seed-design.pages.dev ui
```

## Resolve Custom File Conflicts

CLI는 파일 내용이 다르면 diff를 보여주고 아래 중 하나를 선택하게 합니다.

1. `overwrite`: 기존 파일을 새 내용으로 덮어쓰기
2. `backup`: 기존 파일을 `legacy-<파일명>-<timestamp>`로 백업 후 교체
3. `skip`: 현재 파일 유지

비대화형(CI·스크립트)에서는 `--on-diff` 플래그로 미리 정합니다.

```bash
npx @seed-design/cli@latest add --on-diff backup ui:action-button
```

`--on-diff`는 `overwrite` | `backup`만 받습니다. `skip`은 인터랙티브 선택에서만 가능합니다.

## Decision Guide

- 커스텀 변경이 거의 없고 최신 스니펫 기준으로 재정렬할 때: `overwrite`
- 커스텀 변경을 보존하면서 안전하게 이전할 때: `backup`
- 레거시 구현을 당장 유지하고 점진 전환할 때: `skip`

## Recommended Flow

1. `compat`으로 현재 불일치 항목을 먼저 파악합니다.
2. 대상 컴포넌트를 작은 단위로 나눠서 `--baseUrl`로 업데이트합니다.
3. 충돌 파일은 우선 `backup`을 선택해 안전망을 확보합니다.
4. 동작/스타일 검증 후 필요하면 백업 파일의 커스텀을 수동 반영합니다.
