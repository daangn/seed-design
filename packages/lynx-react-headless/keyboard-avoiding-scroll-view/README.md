# @seed-design/lynx-react-keyboard-avoiding-scroll-view

Headless component built to implement [SEED Lynx Keyboard Avoiding Scroll View](https://seed-design.io/lynx/components/keyboard-avoiding-scroll-view). This is an internal utility, not intended for public usage.

## Usage

```tsx
import { useEffect, useRef } from "@lynx-js/react";
import {
  KeyboardAvoidingScrollView,
  useKeyboardAvoidingScrollViewContext,
  type KeyboardAvoidanceRegistration,
} from "@seed-design/lynx-react-keyboard-avoiding-scroll-view";

function MessageInput() {
  const avoidance = useKeyboardAvoidingScrollViewContext();
  const owner = useRef({}).current;
  const nativeRef = useRef<KeyboardAvoidanceRegistration["nativeRef"]["current"]>(null);

  useEffect(() => () => avoidance.unregister(owner), [avoidance, owner]);

  return (
    <input
      ref={nativeRef}
      placeholder="Write a message"
      bindfocus={() => avoidance.focus({ owner, nativeRef })}
      bindblur={() => avoidance.blur(owner)}
    />
  );
}

export function MessageScreen() {
  return (
    <KeyboardAvoidingScrollView.Root style={{ height: "400px" }}>
      <KeyboardAvoidingScrollView.Content>
        <text>Message</text>
        <MessageInput />
      </KeyboardAvoidingScrollView.Content>
      <KeyboardAvoidingScrollView.Footer>
        <text>Your message stays visible above the keyboard</text>
      </KeyboardAvoidingScrollView.Footer>
    </KeyboardAvoidingScrollView.Root>
  );
}
```
