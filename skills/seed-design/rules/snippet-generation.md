# Snippet Generation

프로젝트에 설치된 스니펫이 어느 세대에서 왔는지 판정합니다. 설치 파일 헤더의 `@requires` 범위가 최신 registry의 범위와 다르면 **구세대 스니펫**입니다. severity: `info`.

## 왜

스니펫은 프로젝트로 복사되는 코드라서 패키지를 업그레이드해도 자동으로 갱신되지 않습니다. 설치 당시 버전에 맞춰진 구현이 그대로 남아 있으면, 최신 패키지와 조합했을 때 의도한 동작이나 스타일이 나오지 않을 수 있습니다.

## 판정 방법

1. `seed-design.json`의 `path`가 가리키는 스니펫 디렉토리에서 파일 헤더의 `@requires` 선언을 수집합니다. 헤더는 파일 상단 JSDoc에 있습니다.

   ```bash
   grep -r "@requires" {snippetRoot} --include="*.tsx" --include="*.ts"
   ```

2. 선택된 Doctor 프로필이 가리키는 최신 registry에서 canonical 범위를 가져옵니다. registry별 인덱스의 `items[].snippets[].dependencies`가 각 스니펫 파일의 현재 `@requires`입니다.

   ```text
   https://seed-design.io/__registry__/{framework}/{registryId}/index.json
   (예: https://seed-design.io/__registry__/react/ui/index.json)
   ```

   registry 목록 자체는 `__registry__/{framework}/index.json`에 있습니다 — 이 파일에는 dependencies가 없습니다.

3. **`(registryId, itemId, snippetPath)` 세 값이 모두 같은 것끼리** 비교해, 범위가 다르면 구세대로 판정합니다. 셋 다 파일 헤더의 `@file ui:action-button`과 파일 위치에서 나옵니다 — 디렉토리 이름으로 추측하지 마세요.

   **itemId를 빼면 안 됩니다.** 한 스니펫 파일이 여러 item에 속할 수 있어서(`attachment-field.tsx`는 `attachment-field`와 `attachment-field-reorderable` 양쪽에 있습니다) 경로만으로는 어느 canonical과 대조할지 정해지지 않고, 엉뚱한 쪽과 비교해 통과나 오탐이 납니다.

   `@file` 헤더가 없는 파일은 어느 item에서 왔는지 알 방법이 없으므로 **`not-verified`로 적고 파일명을 남깁니다.** 손으로 만들었거나 헤더를 지운 파일이니, 경로로 추측해 판정하지 않습니다.

   해시 비교가 아니므로 **로컬 수정 여부는 이 룰이 판정하지 않습니다** — rsc/tsx 변환 때문에 단순 비교는 전부 오탐입니다.

패키지 자체가 major 뒤진 상태면 설치 스니펫이 **전건 구세대로 나오는 게 정상**입니다(원인이 하나이므로). 이때는 파일마다 한 건씩 내지 말고 **요약 한 건 + `files[]`**로 묶습니다. 재설치가 필요한 특별한 이유가 있는 파일(업그레이드 가이드가 콕 집어 지목한 것 등)만 따로 적되, **그 파일도 묶음의 `files[]`에는 남깁니다** — 세대가 뒤진 것은 사실이고, 목록에서 빠지면 재설치 대상에서 누락됩니다. 별건은 "추가로 확인할 것"이지 대체가 아닙니다.

메시지 형식에 주의하세요: "현재 X"라고 쓰면 프로젝트에 설치된 패키지 버전으로 오해됩니다. 비교 대상은 **스니펫 세대**(설치 시점 registry 기준 vs 최신 registry 기준)이지 프로젝트 패키지 버전이 아닙니다.

> 예: `src/seed-design/ui/action-button.tsx:1` — 구버전 스니펫 (설치 세대의 구현 패키지 범위와 최신 스니펫 범위가 다름)

## 수정 방법

```bash
npx @seed-design/cli@latest add --on-diff backup {registryId}:{itemId}
```

`backup`을 쓰면 기존 파일이 `legacy-<파일명>-<timestamp>`로 남아 커스터마이징을 옮길 수 있습니다. 재설치 후 `compat`으로 패키지 버전과 맞는지 확인합니다. 패키지 자체가 구버전이라 최신 스니펫을 받을 수 없는 상황이면 [outdated-version](./outdated-version.md)의 업그레이드 절차가 선행입니다.

## 읽어야 할 문서

- [CLI 명령어 (add · compat)](https://seed-design.io/llms/react/getting-started/cli/commands.txt) — 문서 위치와 무관하게 React·Lynx를 지원합니다
- 선택된 Doctor 프로필의 registry·업그레이드 문서
