import { Chip } from "@/registry/ui/chip";

export default function ChipOutlineStrong() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button variant="outlineStrong">
        <Chip.Label>Outline Strong Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle variant="outlineStrong">
        <Chip.Label>Outline Strong Toggle</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
