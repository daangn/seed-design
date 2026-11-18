---
id: verify-migration-error-claims
description: 업그레이드 가이드·changeset에 옛 API 코드가 "에러로 발견된다" 또는 "에러 없이 동작한다"고 쓸 때 읽는다. 이름·하위 컴포넌트 구성 비교만으로 판단하지 않고, 옛 사용 코드를 새 패키지에 대고 타입 검사한 결과로 문서를 쓰는 방법과 에러가 날 때 적을 안내 범위를 다룬다.
scope: ["docs/content/**", ".changeset/**"]
status: active
related: ["public-api-change-notes"]
---

# 마이그레이션 문서의 "에러로 발견되는지" 주장은 컴파일러로 확인한다

## 교훈과 다음 행동

- 옛 API로 쓴 대표 코드(2.x snippet 원문, prop·variant·slot·타입 참조 포함)를 새 패키지에 대고 직접 타입 검사한 결과로 문서를 쓴다. 에러가 나는 경우에는 무엇을 지우지 말고 어떻게 옮길지까지 적는다.
- `packages/react/src/__tmp_check/check.tsx`에 `import { Dialog } from "../components"`처럼 옛 사용 코드를 쓰고 `bun node_modules/typescript/bin/tsc --project packages/react/tsconfig.json --noEmit 2>&1 | grep __tmp_check`로 확인한 뒤 디렉터리를 지운다. snippet 원문은 `git show origin/dev:docs/registry/react/ui/<name>.tsx`로 가져온다.

## 발생 근거와 적용 조건

- 상황: Dialog 이름 변경 안내(`v3.mdx`, changeset)에 "옮기지 않은 Alert Dialog 코드와 다시 받지 않은 2.x `ui:alert-dialog` snippet은 타입 에러 없이 Dialog로 렌더링된다"고 썼다. 새 `DialogRootProps`는 `role`을 `Omit`하고 `skipAnimation` variant와 `"action"` slot이 없어서, 이 API를 쓰는 코드는 TS2339·TS2322가 난다. 하위 컴포넌트 이름이 같다는 사실만으로 판단했다.
- 영향: 문서를 읽고 작업하는 에이전트가 예고되지 않은 `role` 타입 에러를 만나면 prop·선언을 지워 해결할 위험이 있었다. 지우면 Alert Dialog가 조용히 Dialog로 바뀐다. 리뷰에서 발견해 문서와 changeset을 고쳤다.
- 피할 패턴: 이름·하위 컴포넌트 구성만 비교해 "에러 없음" 또는 "에러로 발견됨"을 단정하는 것.
- 위험: 마이그레이션 문서는 에이전트가 그대로 실행한다. 예고하지 않은 에러는 잘못된 방향(prop 삭제)으로 해결되고, 예고한 에러가 나지 않으면 누락을 놓친다.

## 변경 이력

- 2026-09-29: `AGENT_LEARNINGS.md`에 기록했던 같은 제목 항목을 이 형식으로 옮겼다. 옮기면서 재검증하지 않았다.
