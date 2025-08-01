import { Chip } from "@/registry/ui/chip";

export default function ChipMedium() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button size="medium">
        <Chip.Label>Medium Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle size="medium">
        <Chip.Label>Medium Toggle</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
