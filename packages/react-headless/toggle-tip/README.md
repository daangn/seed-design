# @seed-design/react-toggle-tip

Headless primitives for help bubbles opened and closed by a trigger. SEED's styled `HelpBubble` uses this package.

The current implementation uses a non-modal `dialog` on the positioner. Opening does not move focus into the bubble, and focus leaving the bubble does not close it. It does not provide a live region mode or a role switch.

```tsx
import { ToggleTip } from "@seed-design/react-toggle-tip";

<ToggleTip.Root>
  <ToggleTip.Trigger>More information</ToggleTip.Trigger>
  <ToggleTip.PositionerPortal aria-label="More information">
    <p>Additional information</p>
    <ToggleTip.CloseButton>Close</ToggleTip.CloseButton>
  </ToggleTip.PositionerPortal>
</ToggleTip.Root>;
```

`Root` accepts controlled or uncontrolled open state, positioning options, and `closeOnInteractOutside`. `Anchor`, `Arrow`, `useToggleTip`, and `useToggleTipContext` support custom composition.

When migrating the previous HelpBubble primitives from `@seed-design/react-popover`, replace `Popover` with `ToggleTip` and `usePopoverContext` with `useToggleTipContext`. Existing styled `HelpBubble` usage does not change.
