import { Badge } from "@seed-design/react";

export default function BadgeAsChild() {
  return (
    <Badge asChild>
      <a href="https://example.com" target="_blank" rel="noreferrer">
        링크
      </a>
    </Badge>
  );
}
