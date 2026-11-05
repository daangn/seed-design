---
id: bounded-multiline-edits
description: 여러 줄 코드나 Markdown 항목을 스크립트로 삭제할 때 읽는다. 반복되는 주석·제목 토큰이 무관한 정의까지 매칭하는 위험과 적용 전 확인 방법을 다룬다.
scope: ["**"]
status: active
---

# 여러 줄 삭제는 경계와 매칭 범위를 먼저 확인한다

## 교훈과 다음 행동

- 대상이 적으면 정확한 문자열 치환을 사용한다. 스크립트가 필요하면 쓰기 전에 매칭 전체와 줄 수를 출력하고, 적용 후 파일별 diff를 확인한다. 반복되는 주석 시작점은 종료 토큰을 넘지 않도록 제한한다. Markdown 제목 경계에는 줄 시작을 포함한 `\n## ` 또는 다음 제목 전체를 사용한다.

## 발생 근거와 적용 조건

- Menu·Select JSDoc 삭제 정규식이 첫 주석에서 대상까지 매칭하여 SelectValue·SelectPlaceholder·SelectPositioner를 함께 지웠다. 비탐욕 수량자는 시작점을 제한하지 않는다. Markdown에서는 `## `가 `### ` 내부에도 매칭되어 제목만 지우고 본문을 남겼다.

## 변경 이력

- 2026-09-29: major rebase에서 AGENT_LEARNINGS.md 원문 commit `629a64d99`의 교훈을 이관했다. 이관 과정에서 실행 재검증하지 않았다.
