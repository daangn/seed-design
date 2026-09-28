---
id: isolated-regression-baselines
description: Lynx 기기·문서 예제의 변경 전후 회귀 기준을 수집하거나 병렬 편집과 dev server를 함께 사용할 때 읽는다.
scope: ["examples/lynx-spa/**", "docs/examples/lynx/**", "packages/lynx-react/**", "packages/lynx-react-headless/**"]
status: active
related: ["iphone-lan-asset-prefix"]
---

# 기준 결과는 작업 트리와 분리해 고정한다

## 교훈과 다음 행동

- 회귀 기준은 편집 작업과 분리된 입력으로 만든다. static 기준은 먼저 수집해 산출물로 고정하고, 기기 기준은 HEAD 격리본으로 만든다.
- `git worktree add --detach <local 경로> <base-sha>` → 그 안에서 `bun install`과 필요한 build → production bundle을 `local://baseline/`에 복사한다. 끝나면 `git worktree remove`. 이후 비교는 현재 트리를 같은 명령·env로 빌드해 수행한다.

## 발생 근거와 적용 조건

- 상황: 변경 전 기기 기준을 작업 중인 worktree의 lynx-spa dev server로 수집하는 동안, 다른 작업자가 `docs/examples/lynx/accordion/headless.tsx`를 추가했다. SPA catalog가 새 예제를 즉시 포함했고, 아직 설치·빌드되지 않은 패키지 import 때문에 dev server가 `Can't resolve`로 깨졌다.
- 영향: 기준 장면이 `예제를 불러오지 못했습니다.`로 바뀌었다. 격리된 HEAD checkout을 만들어 production build로 다시 수집해야 했다.
- 피할 패턴: 기준 수집과 `docs/examples/lynx/**`·package 원천 수정을 같은 worktree에서 동시에 진행하는 것.
- 위험: catalog 자동 수집과 watch 빌드 때문에 기준 결과에 변경본이 섞이거나 기준 장면이 깨진다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
