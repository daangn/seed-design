# Components

SEED Design 컴포넌트를 탐색하고 사용하는 방법입니다.

## 컴포넌트 목록 확인

전체 컴포넌트 목록과 설명은 llms.txt에서 항상 최신 상태로 확인할 수 있습니다:

```text
https://seed-design.io/react/llms.txt
```

이 URL을 WebFetch로 읽으면 모든 컴포넌트의 이름, 설명, 상세 문서 링크를 얻을 수 있습니다.

## 컴포넌트 상세 정보 조회

특정 컴포넌트의 props, 사용법, 예제를 알고 싶을 때:

1. **CLI docs 명령어** (권장):
   ```bash
   npx @seed-design/cli@latest docs {component-name}
   ```
   문서 링크, llms.txt 링크, snippet 링크를 한 번에 출력합니다.

2. **llms.txt URL** (WebFetch로 직접 읽기):
   ```
   https://seed-design.io/llms/react/components/{component-name}.txt
   ```

3. **문서 사이트**:
   ```
   https://seed-design.io/react/components/{component-name}
   ```

## 레지스트리 구조

컴포넌트는 4개 레지스트리로 나뉩니다:

| 레지스트리 | 용도 | 추가 명령어 |
|-----------|------|------------|
| `ui` | 핵심 UI 컴포넌트 | `npx @seed-design/cli@latest add ui:{name}` |
| `block` | 복합 패턴 (페이지 레이아웃 등) | `npx @seed-design/cli@latest add block:{name}` |
| `breeze` | 유틸리티 컴포넌트 | `npx @seed-design/cli@latest add breeze:{name}` |
| `lib` | 저수준 유틸리티 | `npx @seed-design/cli@latest add lib:{name}` |

## 컴포넌트 추가 방법

### 단일 컴포넌트

```bash
npx @seed-design/cli@latest add ui:action-button
```

### 여러 컴포넌트

```bash
npx @seed-design/cli@latest add ui:action-button ui:checkbox ui:switch
```

### 레지스트리 전체

```bash
npx @seed-design/cli@latest add-all ui
```

### 설치 후 import

```tsx
import { ActionButton } from "seed-design/ui/action-button";
import { Checkbox } from "seed-design/ui/checkbox";
```

## snippet 커스터마이징

CLI로 추가된 컴포넌트는 프로젝트의 `seed-design/` 디렉토리에 snippet으로 설치됩니다. node_modules가 아닌 프로젝트 코드이므로 자유롭게 수정할 수 있습니다.

단, 업데이트 시 충돌이 발생할 수 있으므로 커스텀 변경이 큰 경우 `backup` 전략을 사용하는 것이 안전합니다. 상세는 `references/migration.md`를 참조하세요.
