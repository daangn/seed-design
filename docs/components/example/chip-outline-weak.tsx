import { Chip } from "@/registry/ui/chip";

export default function ChipOutlineWeak() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button variant="outlineWeak">
        <Chip.Label>Outline Weak Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle variant="outlineWeak">
        <Chip.Label>Outline Weak Toggle</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
