# No Deprecated Component

deprecated 컴포넌트의 import와 설치된 deprecated 스니펫을 판정합니다. severity: `warn`.

## 왜

deprecated 컴포넌트는 다음 메이저에서 제거됩니다. 지금 당장 동작이 깨지진 않지만, 업그레이드하려면 먼저 정리해야 합니다. 어떤 버전에서 제거되는지와 대체안은 deprecation 현황 문서가 단일 출처입니다 — **기억으로 판정하지 말고 문서를 읽고 대조합니다.**

## 판정 방법

1. deprecation 현황 문서를 읽어 deprecated 목록과 대체안을 확보합니다(아래 "읽어야 할 문서").
2. **패키지 import 검사**: `@seed-design/react`(lynx는 `@seed-design/lynx-react`)에서 import하는 이름을 deprecated 컴포넌트 이름과 대조합니다. 매칭은 이름의 공백을 뺀 **prefix 매칭 + 최장 일치 우선**입니다 — `ActionSheetItem`은 `action-sheet`가 아니라 `action-sheet-item`으로 매칭돼야 합니다.
3. **설치 스니펫 검사**: 스니펫 디렉토리에 deprecated 항목의 파일이 설치돼 있는지 경로로 판정합니다. 스니펫 디렉토리 **내부** 파일이 패키지에서 deprecated 컴포넌트를 import하는 건 검사하지 않습니다 — 스니펫이 패키지를 감싸는 건 정당한 사용입니다.

## Incorrect / Correct

**Incorrect:**

```tsx
import { Fab } from "@seed-design/react";
```

**Correct:** (rootage: "Use contextual-floating-button instead.")

```tsx
import { ContextualFloatingButton } from "seed-design/ui/contextual-floating-button";
```

## 수정 방법

각 항목의 대체 컴포넌트로 교체합니다. 스니펫이 deprecated인 경우 대체 스니펫을 설치하고 기존 파일의 커스터마이징을 옮깁니다.

```bash
npx @seed-design/cli@latest add --on-diff backup {registryId}:{대체 itemId}
```

## 읽어야 할 문서

- [Deprecated 현황](https://seed-design.io/llms/docs/migration/deprecations.txt)
- [SEED React 2 업그레이드 가이드](https://seed-design.io/llms/react/updates/upgrade/v2.txt)
