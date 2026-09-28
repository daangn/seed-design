---
id: public-api-change-notes
description: 공개 API 제거·사용 중단의 changeset과 CHANGELOG 안내에서 컴포넌트·중첩 prop 영향 범위를 정할 때 읽는다.
scope: [".changeset/**", "packages/**", "docs/**"]
status: active
---

# 변경 안내는 소비자가 사용하는 공개 컴포넌트와 prop 경로로 쓴다

## 교훈과 다음 행동

- 소비 패키지의 공개 타입에서 직접 prop과 중첩 옵션의 노출 여부를 확인하고 실제 컴포넌트명과 prop 경로를 나열한다.
- BottomSheet.Root의 nested, ResponsiveDialog.Root와 ResponsiveSidePanel.Root의 bottomSheetRootProps.nested처럼 적는다. 패키지마다 사용하는 API가 다르면 changeset을 분리하고 각 패키지의 공개 API만 설명한다. 각 CHANGELOG에서는 패키지명이나 "해당 패키지" 같은 문맥 전환이 필요 없어야 한다.

## 발생 근거와 적용 조건

- 상황: nested prop 제거 안내에서 Drawer와 BottomSheet만 언급한 뒤, 누락된 소비자를 확인하는 대신 "Drawer 기반 컴포넌트"라는 내부 구현 용어로 범위를 넓혔다.
- 영향: 소비자가 ResponsiveDialog와 ResponsiveSidePanel의 bottomSheetRootProps.nested도 정리해야 한다는 사실을 알 수 없었다.
- 피할 패턴: 내부 의존 패키지 이름이나 대표 컴포넌트만으로 영향 범위를 설명하는 것.
- 위험: 중첩 옵션으로 노출된 prop을 누락하거나, Pick으로 해당 prop을 제외한 컴포넌트까지 영향 대상으로 오해하게 한다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
