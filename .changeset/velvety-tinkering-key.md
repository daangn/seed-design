---
"@seed-design/react": minor
"@seed-design/react-accordion": minor
"@seed-design/css": minor
"@seed-design/rootage-artifacts": minor
---

`Accordion` 컴포넌트를 추가합니다.

여러 개의 관련 콘텐츠 섹션을 수직으로 나열하고, 각 섹션을 펼치거나 접어 정보를 탐색할 수 있는 컴포넌트입니다.

- `type="single" | "multiple"`로 한 번에 하나/여러 항목 확장 가능
- `variant="inline" | "separated"` 지원 (기본값: `inline`)
- `size="medium" | "large"` 지원 (기본값: `medium`)
- WAI-ARIA Accordion Pattern 준수 (키보드 `Enter`/`Space`/`ArrowUp`/`ArrowDown`/`Home`/`End`)
- 접근성을 위해 `AccordionHeader`(`<h3>`) 래퍼가 자동 적용됩니다.

### Headless 패키지 분리

`@seed-design/react-accordion` 패키지가 새로 추가되었습니다. 스타일 없이 상태 관리와 접근성 로직만 필요한 경우 직접 사용할 수 있습니다.

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionTitle,
  AccordionDescription,
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
