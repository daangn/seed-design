# No Deprecated Component

deprecated 컴포넌트의 import·설치된 deprecated 스니펫·deprecated 토큰과 옵션 사용을 판정합니다. severity: `warn`.

## 왜

deprecated 항목은 다음 메이저에서 제거됩니다. 지금 당장 동작이 깨지진 않지만, 업그레이드하려면 먼저 정리해야 합니다. 어떤 버전에서 제거되는지와 대체안은 문서가 출처입니다 — **기억으로 판정하지 말고 문서를 읽고 대조합니다.**

## 판정 방법

1. 출처 문서를 읽어 deprecated 목록과 대체안을 확보합니다. 출처는 둘입니다:
   - **컴포넌트 옵션·토큰**: deprecation 현황 문서 (아래 "읽어야 할 문서")
   - **컴포넌트 자체**: 컴포넌트 목록 `https://seed-design.io/components/llms.txt`의 `(Deprecated)` 마커 — 현황 문서에는 옵션·토큰만 있고 deprecated 컴포넌트 목록이 없습니다.
2. **패키지 import 검사**: `@seed-design/react`(lynx는 `@seed-design/lynx-react`)에서 import하는 이름을 deprecated 컴포넌트 이름과 대조합니다. 매칭은 이름의 공백을 뺀 **prefix 매칭 + 최장 일치 우선**입니다 — `ActionSheetItem`은 `action-sheet`가 아니라 `action-sheet-item`으로 매칭돼야 합니다.
3. **설치 스니펫 검사**: 스니펫 디렉토리에 deprecated 항목의 파일이 설치돼 있는지 경로로 판정합니다. 스니펫 디렉토리 **내부** 파일이 패키지에서 deprecated 컴포넌트를 import하거나 deprecated 옵션을 구현하는 건 검사하지 않습니다 — 스니펫이 패키지를 감싸는 건 정당한 사용이고, 스니펫 내부 문제는 재설치([snippet-generation](./snippet-generation.md))로 해소됩니다.
4. **토큰·옵션 검사**: 현황 문서의 deprecated 토큰(예: `$color.bg.layer-fill`)과 컴포넌트 옵션을 **앱 코드**에서 사용하는지 검사합니다.

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
