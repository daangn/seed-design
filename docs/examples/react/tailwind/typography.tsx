import { VStack } from "@seed-design/react";

export default function TailwindTypography() {
  return (
    <VStack gap="x3">
      <h1 className="screen-title text-fg-neutral">screen-title</h1>
      <p className="t3-regular text-fg-neutral">t3-regular</p>
      <p className="t3-bold text-fg-neutral">t3-bold</p>
      <p className="t4-medium text-fg-neutral">t4-medium</p>
      <p className="article-body text-fg-neutral">article-body</p>
    </VStack>
  );
}
