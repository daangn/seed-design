import { IconLocationpinFill } from "@karrotmarket/react-monochrome-icon";
import { TagGroupRoot, TagGroupItem } from "seed-design/ui/tag-group";

export default function TagGroupPreview() {
  return (
    <TagGroupRoot>
      <TagGroupItem prefixIcon={<IconLocationpinFill />} label="500m" />
      <TagGroupItem label="서초4동" />
      <TagGroupItem label="3분 전" />
    </TagGroupRoot>
  );
}
