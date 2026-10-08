# @seed-design/lynx-react-image

Headless component for rendering native images with load/error state and fallbacks in SEED Lynx. This is an internal utility, not intended for public usage.

## Usage

```tsx
import { Image } from "@seed-design/lynx-react-image";

export function ProductImage({ src }: { src: string }) {
  return (
    <Image.Root style={{ width: 160, height: 160, position: "relative" }}>
      <Image.Content src={src} alt="Product photo" style={{ width: 160, height: 160 }} />
      <Image.Fallback style={{ position: "absolute", top: 0, left: 0 }}>
        <text>Photo unavailable</text>
      </Image.Fallback>
    </Image.Root>
  );
}
```
