# Migration (스니펫)

> 패키지 버전 업그레이드·호환 진단(react↔css, changelog, 마이그레이션 경로)은 `upgrade.md`를 참고하세요. 이 문서는 **스니펫**을 프로젝트 버전에 맞추고 파일 충돌을 해결하는 방법입니다.

## Pre-Check Compatibility

업데이트 전에 먼저 `compat` 명령으로 현재 설치된 스니펫의 버전 호환 상태를 확인합니다.

```bash
npx @seed-design/cli@latest compat
```

호환성 이슈가 있으면 종료 코드 `1`로 끝나므로 CI에서도 게이트로 사용할 수 있습니다. 이 명령은 **스니펫만** 검사합니다 — react↔css 패키지 간 호환은 아래 절차나 `upgrade.md` Step 2를 따르세요.

## Package Version Compatibility

`compat`은 **스니펫**이 요구하는 범위만 검사합니다. `@seed-design/react`·`@seed-design/css`·`@seed-design/stackflow` **패키지끼리** 맞는지는 아래 기준으로 판단합니다.

**SEED React 2 이상이면 `peerDependencies` 선언이 곧 정답입니다.** 2.0.0부터 strict SemVer를 따르므로 설치본의 선언을 그대로 신뢰하면 됩니다.

```bash
cat node_modules/@seed-design/react/package.json | grep -A5 peerDependencies
```

**1.x 구간은 선언에 상한이 없거나 누락된 경우가 있어 선언만으로 판단하면 안 됩니다.** 이 시기의 호환표와 알려진 비호환 조합은 아래 문서에 정리돼 있으니, 1.x 조합을 판정해야 하면 반드시 먼저 읽습니다.

- `https://seed-design.io/llms/react/updates/upgrade/v1.txt` (섹션: 패키지 간 버전 호환성)

핵심 규칙만 요약하면 이렇습니다. 정확한 하한과 예외는 위 문서의 표를 따릅니다.

- `@seed-design/css`는 `@seed-design/react`와 **같은 마이너 라인**이어야 하고, 표의 하한 이상이어야 합니다. 라인이 다르면(react 1.1.x + css 1.2.x) 호환되지 않습니다.
- `@seed-design/stackflow`는 1.2 라인이 없어 1.1 라인이 css 1.1·1.2를 함께 지원합니다. 단 WAAPI 경계(stackflow 1.1.22 / css 1.1.25·1.2.11)를 섞으면 화면 전환이 깨집니다.
- 표에 없는(문서 작성 이후 배포된) 버전은 위 `peerDependencies` 확인 방식으로 판정합니다.

버전 구간을 추측하지 말고 문서의 표를 실제로 읽고 대조합니다.

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
2. 대상 컴포넌트를 작은 단위로 나눠서 버전 옵션(`--seed-react-version`)으로 업데이트합니다.
3. 충돌 파일은 우선 `backup`을 선택해 안전망을 확보합니다.
4. 동작/스타일 검증 후 필요하면 백업 파일의 커스텀을 수동 반영합니다.
