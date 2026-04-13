# API 설계 원칙

Snippet 레이어(`docs/registry/ui/`)와 컴포넌트 공개 API 설계 시 따르는 원칙.

## Snippet 레이어 필요 여부

| 조건 | Snippet 필요? |
|------|-------------|
| 3개+ sub-component를 조합해야 사용 가능 | Yes |
| 서드파티 라이브러리와 통합 필요 | Yes |
| 단일 import으로 사용 가능 | No |
| 이미 심플한 API | No |

## API 설계 4원칙

### 1. Action을 노출하고 State setter를 숨긴다

사용자가 내부 상태를 직접 조작할 필요 없게 한다.

- **좋음**: `updateFileStatus(fileId, { status: "error", message: "..." })` — 명확한 action
- **나쁨**: `setAcceptedFiles(prev => prev.map(...))` — raw state setter 노출

render-prop이나 callback에서 제공하는 API도 동일하다. 사용자가 배열을 직접 map/filter하게 하지 말고, 의미 있는 action 함수를 제공한다.

### 2. API를 확정한 후 Recipe를 구현한다

Snippet prop interface가 필요한 slot을 결정하고, slot이 recipe 구조를 결정한다.

순서:
1. Snippet의 공개 prop interface 초안 작성
2. 이 interface가 어떤 slot을 필요로 하는지 도출
3. slot 구조에 맞춰 recipe 작성
4. Recipe에 맞춰 React 컴포넌트 구현

API를 먼저 설계하지 않으면 recipe 구조를 나중에 바꿔야 할 수 있다.

### 3. 자동 주입 요소는 prop으로 명시한다

Snippet이 아이콘이나 indicator를 자동으로 삽입하는 경우, 반드시 prop interface에 이를 제어할 수 있는 prop을 포함한다.

```typescript
// 좋음: suffixIcon을 제어 가능
interface AccordionItemProps {
  suffixIcon?: React.ReactNode;  // 기본값: ChevronDown
}

// 나쁨: 아이콘이 암묵적으로 삽입됨
```

### 4. Recipe 통합 기준

sub-component가 항상 부모와 함께 사용되면 부모 recipe의 slot으로 통합한다. 독립적으로 사용 가능하면 별도 recipe로 분리한다.

- **통합**: `file-upload-item` recipe 안에 remove button slot (항상 item 안에서만 사용)
- **분리**: `checkbox` recipe와 `checkmark` recipe (checkmark은 다른 컴포넌트에서도 사용)

## Snippet 작성 패턴

```typescript
"use client";

import * as React from "react";
import * as SeedComponent from "@seed-design/react/components/Component";

/**
 * @see https://seed-design.pages.dev/react/components/component
 */
export interface ComponentProps extends SeedComponent.RootProps {
  // 편의 props (label, description 등)
}

export const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ label, description, ...props }, ref) => {
    return (
      <SeedComponent.Root ref={ref} {...props}>
        {label && <SeedComponent.Label>{label}</SeedComponent.Label>}
        {description && <SeedComponent.Description>{description}</SeedComponent.Description>}
      </SeedComponent.Root>
    );
  },
);

Component.displayName = "Component";
```

## Registry 등록

Snippet 작성 후 반드시:

1. `docs/registry/registry-ui.ts`에 entry 추가
2. `bun --filter @seed-design/docs generate:registry` 실행
3. 생성된 JSON 파일 확인

## Block 패턴

preset 조합이 필요한 컴포넌트(Footer 등)에서 block을 제공한다.

- **네이밍**: zero-padded 번호 (`footer-01`, `footer-02`, `footer-03`)
- **위치**: `docs/registry/block/{name}-{number}.tsx`
- **역할**: 실제 사용 시나리오를 보여주는 완성된 UI 조합
- **아이콘**: block 전용 아이콘은 `docs/registry/icon/`에 등록

block은 단순한 variant 쇼케이스가 아니라, 실제 사용 패턴(legal links, contact info, SNS links 등)을 보여줘야 한다.
