import { baseUrl } from "@/app/metadata";

export const revalidate = false;

/**
 * SEED Design Icons - LLM Reference
 *
 * Provides an overview of the icon system with package information
 * and usage examples.
 */
export async function GET() {
  const libraryUrl = new URL("/docs/foundation/iconography/library", baseUrl);

  const response = `# SEED Design Icons

## Overview

SEED Design provides a comprehensive icon library with two main types:

### Monochrome Icons
Single-color icons with **line** and **fill** variants.
- Use for: General UI actions, navigation, status indicators
- Customizable color via CSS

### Multicolor Icons
Icons with multiple fixed colors (not customizable via CSS).
- Includes general-purpose multicolor icons
- Includes Karrot service-specific icons (중고거래, 부동산, 알바, etc.)

## Packages

Install the appropriate package for your framework:

| Framework | Monochrome | Multicolor |
|-----------|------------|------------|
| React | \`@karrotmarket/react-monochrome-icon\` | \`@karrotmarket/react-multicolor-icon\` |
| Vue | \`@karrotmarket/vue-monochrome-icon\` | \`@karrotmarket/vue-multicolor-icon\` |
| Lynx | \`@karrotmarket/lynx-monochrome-icon\` | \`@karrotmarket/lynx-multicolor-icon\` |

## Usage Examples

### React
\`\`\`tsx
// Monochrome icons
import { IconArrowLeftLine, IconArrowLeftFill } from "@karrotmarket/react-monochrome-icon";

// Multicolor icons
import { IconShoppingbagItems } from "@karrotmarket/react-multicolor-icon";

function Example() {
  return (
    <>
      <IconArrowLeftLine />
      <IconArrowLeftFill />
      <IconShoppingbagItems />
    </>
  );
}
\`\`\`

### Vue
\`\`\`vue
<script setup>
import { IconArrowLeftLine } from "@karrotmarket/vue-monochrome-icon";
import { IconShoppingbagItems } from "@karrotmarket/vue-multicolor-icon";
</script>

<template>
  <IconArrowLeftLine />
  <IconShoppingbagItems />
</template>
\`\`\`

## Icon Naming Convention

- **Monochrome**: \`icon_{name}_{variant}\` → \`Icon{Name}{Variant}\`
  - Example: \`icon_arrow_left_line\` → \`IconArrowLeftLine\`
  - Example: \`icon_arrow_left_fill\` → \`IconArrowLeftFill\`

- **Multicolor**: \`icon_{name}\` → \`Icon{Name}\`
  - Example: \`icon_shoppingbag_items\` → \`IconShoppingbagItems\`

## Documentation

- Icon Library (browse all icons): ${libraryUrl}
- Foundation Overview: /docs/llms-foundation.txt
`;

  return new Response(response);
}
