# @seed-design/lynx-react-accordion

Headless component built to implement [SEED Lynx Accordion](https://seed-design.io/lynx/components/accordion). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { Accordion } from "@seed-design/lynx-react-accordion";

export function ShippingAccordion() {
  return (
    <Accordion.Root defaultValues={["shipping"]}>
      <Accordion.Item value="shipping">
        <Accordion.Header>
          <Accordion.Trigger>
            <text>When will my order arrive?</text>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <text>Orders usually arrive within three business days.</text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```
