---
name: seed-design-cli
description: SEED Design CLI workflows for init/add/add-all/compat/docs, seed-design.json setup, snippet version compatibility checks, baseUrl-based registry selection, custom snippet migration strategies, and docs/llms.txt/snippet link lookup. Use when onboarding SEED snippets, adding components, resolving version mismatches, updating customized snippet files, or retrieving documentation and LLM-ready links for components.
---

# Seed Design CLI

SEED Design CLI를 프로젝트에 안정적으로 적용할 때 사용하는 스킬입니다.

## Quick Start

1. `seed-design.json`을 생성합니다.
2. 필요한 스니펫을 `add` 또는 `add-all`로 추가합니다.
3. `compat`으로 현재 프로젝트 버전과 스니펫 요구 버전 호환성을 검사합니다.
4. 버전 호환이 필요하면 `--baseUrl`로 맞는 레지스트리를 지정합니다.
5. 파일 충돌 시 덮어쓰기/백업/건너뛰기 전략을 선택합니다.

## Scope

- `npx @seed-design/cli@latest init`
- `npx @seed-design/cli@latest add ...`
- `npx @seed-design/cli@latest add-all ...`
- `npx @seed-design/cli@latest compat ...`
- `npx @seed-design/cli@latest docs [query]`
- `seed-design.json` 운영 (`path`, `tsx`, `rsc`, `telemetry`)
- 스니펫 버전 호환성과 마이그레이션 운영
- 컴포넌트/파운데이션 문서 링크, LLM용 텍스트 링크, 스니펫 링크 조회

## References

- CLI Commands: https://seed-design.io/llms/react/getting-started/cli/commands.txt
- CLI Configuration: https://seed-design.io/llms/react/getting-started/cli/configuration.txt
- Docs Command Usage: `references/usage.md` → `### 5) Docs 조회` 섹션

## Reference Files

- 일반 사용 흐름: `references/usage.md`
- 호환/마이그레이션: `references/migration.md`
