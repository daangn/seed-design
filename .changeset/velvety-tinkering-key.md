---
"@seed-design/react": patch
"@seed-design/react-accordion": patch
"@seed-design/css": patch
"@seed-design/rootage-artifacts": patch
---

`@seed-design/react`에 `Accordion` 컴포넌트 추가.

- `type="single" | "multiple"`, `variant="inline" | "separated"`, `size="medium" | "large"` 지원
- WAI-ARIA Accordion 패턴 준수 (키보드 네비 `ArrowUp`/`Down`/`Home`/`End`, `<h3>` 헤더 자동 래핑)
- `@seed-design/react-accordion` 헤드리스 패키지 신규 출시 (Collapsible 기반, 스타일 없이 상태/접근성만 필요할 때 직접 사용 가능)

snippet으로 바로 설치해 사용할 수 있습니다.

```sh
npx @seed-design/cli@latest add ui:accordion
```

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionContent,
} from "seed-design/ui/accordion";

<Accordion type="single" defaultValue="item-1" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>
      <AccordionTitle>자주 묻는 질문 1</AccordionTitle>
    </AccordionTrigger>
    <AccordionContent>답변 내용</AccordionContent>
  </AccordionItem>
</Accordion>
```
