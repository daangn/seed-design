import { Chip } from "@/registry/ui/chip";

export default function ChipSolid() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button variant="solid">
        <Chip.Label>Solid Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle variant="solid">
        <Chip.Label>Solid Toggle</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
