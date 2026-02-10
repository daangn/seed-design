import { describe, expect, it } from "bun:test";
import { normalizeLLMBody } from "./normalize-llm-body";

describe("normalizeLLMBody", () => {
  it("unwraps ComponentExample and removes ManualInstallation", () => {
    const input = `
<ComponentExample name="react/action-button/preview">
  \`\`\`tsx
  export default function ActionButtonPreview() {
    return <ActionButton>라벨</ActionButton>;
  }
  \`\`\`
</ComponentExample>

<ManualInstallation name="action-button" />
`.trim();

    const output = normalizeLLMBody(input);

    expect(output).not.toContain("<ComponentExample");
    expect(output).not.toContain("</ComponentExample>");
    expect(output).not.toContain("<ManualInstallation");
    expect(output).toContain("```tsx");
    expect(output).toContain("return <ActionButton>라벨</ActionButton>;");
  });

  it("converts CodeBlockTabs to primary command and alternatives list", () => {
    const input = `
## Installation

<CodeBlockTabs defaultValue="npm">
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="npm">npm</CodeBlockTabsTrigger>
    <CodeBlockTabsTrigger value="pnpm">pnpm</CodeBlockTabsTrigger>
    <CodeBlockTabsTrigger value="yarn">yarn</CodeBlockTabsTrigger>
  </CodeBlockTabsList>
  <CodeBlockTab value="npm">
    \`\`\`bash
    npx @seed-design/cli@latest add ui:action-button
    \`\`\`
  </CodeBlockTab>
  <CodeBlockTab value="pnpm">
    \`\`\`bash
    pnpm dlx @seed-design/cli@latest add ui:action-button
    \`\`\`
  </CodeBlockTab>
  <CodeBlockTab value="yarn">
    \`\`\`bash
    yarn dlx @seed-design/cli@latest add ui:action-button
    \`\`\`
  </CodeBlockTab>
</CodeBlockTabs>
`.trim();

    const output = normalizeLLMBody(input);

    expect(output).not.toContain("<CodeBlockTabs");
    expect(output).not.toContain("<CodeBlockTab");
    expect(output).toContain("npx @seed-design/cli@latest add ui:action-button");
    expect(output).toContain("다른 패키지 매니저:");
    expect(output).toContain("- pnpm: `pnpm dlx @seed-design/cli@latest add ui:action-button`");
    expect(output).toContain("- yarn: `yarn dlx @seed-design/cli@latest add ui:action-button`");
  });

  it("keeps other mdx flow elements untouched", () => {
    const input = `
<TypeTable
  type={{
    variant: {
      "type": "string"
    }
  }}
/>
`.trim();

    const output = normalizeLLMBody(input);
    expect(output).toContain("<TypeTable");
    expect(output).toContain('"type": "string"');
  });
});
