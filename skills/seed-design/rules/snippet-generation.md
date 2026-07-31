# Snippet Generation

프로젝트에 설치된 스니펫이 어느 세대에서 왔는지 판정합니다. 설치 파일 헤더의 `@requires` 범위가 최신 registry의 범위와 다르면 **구세대 스니펫**입니다. severity: `info`.

## 왜

스니펫은 프로젝트로 복사되는 코드라서 패키지를 업그레이드해도 자동으로 갱신되지 않습니다. 설치 당시 버전에 맞춰진 구현이 그대로 남아 있으면, 최신 패키지와 조합했을 때 의도한 동작이나 스타일이 나오지 않을 수 있습니다.

## 판정 방법

1. `seed-design.json`의 `path`가 가리키는 스니펫 디렉토리에서 파일 헤더의 `@requires` 선언을 수집합니다. 헤더는 파일 상단 JSDoc에 있습니다.

   ```bash
   grep -r "@requires" {snippetRoot} --include="*.tsx" --include="*.ts"
   ```

2. 최신 registry의 canonical 범위를 가져옵니다. registry별 인덱스의 `items[].snippets[].dependencies`가 각 스니펫 파일의 현재 `@requires`입니다.

   ```text
   https://seed-design.io/__registry__/{framework}/{registryId}/index.json
   (예: https://seed-design.io/__registry__/react/ui/index.json)
   ```

   registry 목록 자체는 `__registry__/{framework}/index.json`에 있습니다 — 이 파일에는 dependencies가 없습니다.

3. 같은 파일 경로(`{registryId}/{snippetPath}`)끼리 비교해, 범위가 다르면 구세대로 판정합니다. `registryId`는 디렉토리 이름이 아니라 **같은 헤더의 `@file ui:action-button`에서 읽습니다** — 설치 디렉토리 구조가 바뀌어도 안전합니다. 해시 비교가 아니므로 **로컬 수정 여부는 이 룰이 판정하지 않습니다** — rsc/tsx 변환 때문에 단순 비교는 전부 오탐입니다.

패키지 자체가 major 뒤진 상태면 설치 스니펫이 **전건 구세대로 나오는 게 정상**입니다(원인이 하나이므로). 이때는 파일마다 한 건씩 내지 말고 **요약 한 건 + 파일 목록**으로 묶습니다. 재설치가 필요한 특별한 이유가 있는 파일(업그레이드 가이드가 콕 집어 지목한 것 등)만 따로 적습니다.

메시지 형식에 주의하세요: "현재 X"라고 쓰면 프로젝트에 설치된 패키지 버전으로 오해됩니다. 비교 대상은 **스니펫 세대**(설치 시점 registry 기준 vs 최신 registry 기준)이지 프로젝트 패키지 버전이 아닙니다.

> 예: `src/seed-design/ui/action-button.tsx:1` — 구버전 스니펫 (`@seed-design/react@~1.0.0` 기준으로 설치됨, 최신 스니펫은 `^2.0.0` 기준)

## 수정 방법

```bash
npx @seed-design/cli@latest add --on-diff backup {registryId}:{itemId}
```

`backup`을 쓰면 기존 파일이 `legacy-<파일명>-<timestamp>`로 남아 커스터마이징을 옮길 수 있습니다. 재설치 후 `compat`으로 패키지 버전과 맞는지 확인합니다. 패키지 자체가 구버전이라 최신 스니펫을 받을 수 없는 상황이면 [outdated-version](./outdated-version.md)의 업그레이드 절차가 선행입니다.

## 읽어야 할 문서

- [CLI 명령어 (add · compat)](https://seed-design.io/llms/react/getting-started/cli/commands.txt)
- [SEED React 2 업그레이드 가이드](https://seed-design.io/llms/react/updates/upgrade/v2.txt)
