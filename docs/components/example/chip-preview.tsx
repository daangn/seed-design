import { Chip } from "@/registry/ui/chip";

export default function ChipPreview() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button>
        <Chip.Label>Button Chip</Chip.Label>
      </Chip.Button>
      <Chip.Toggle>
        <Chip.Label>Toggle Chip</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
