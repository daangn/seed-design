---
"@seed-design/react": minor
"@seed-design/react-accordion": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
---

`@seed-design/react`에 `Accordion` 컴포넌트 추가.

- `multiple` prop으로 단일/다중 확장 모드, `variant="inline" | "separated"`, `size="medium" | "large"` 지원
- WAI-ARIA Accordion 패턴 준수 (키보드 네비 `ArrowUp`/`Down`/`Home`/`End`, `<h3>` 헤더 자동 래핑)
- `@seed-design/react-accordion` 헤드리스 패키지 신규 출시 (스타일 없이 상태/접근성만 필요할 때 직접 사용 가능)
- snippet은 `AccordionTrigger`의 `title`, `description`, `prefix`, `suffixIcon`, `headingLevel` prop으로 반복되는 trigger 구성을 간단히 작성할 수 있습니다.
- prefix 아이콘은 `prefix={<Icon ... />}`처럼 SEED `Icon` 컴포넌트로 감싸서 전달합니다.

snippet으로 바로 설치해 사용할 수 있습니다.

```sh
npx @seed-design/cli@latest add ui:accordion
```

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "seed-design/ui/accordion";

<Accordion defaultValues={["item-1"]}>
  <AccordionItem value="item-1">
    <AccordionTrigger title="자주 묻는 질문 1" />
    <AccordionContent>답변 내용</AccordionContent>
  </AccordionItem>
</Accordion>
```
