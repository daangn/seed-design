import "./styles";

import { TagGroupRoot, TagGroupItem } from "@/components/ui/tag-group";

export default function Example() {
  return (
    <TagGroupRoot className="tag-group-preview__group">
      <TagGroupItem label="500m" />
      <TagGroupItem label="서초4동" />
      <TagGroupItem label="3분 전" />
    </TagGroupRoot>
  );
}
