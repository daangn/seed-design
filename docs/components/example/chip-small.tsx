import { Chip } from "@/registry/ui/chip";

export default function ChipSmall() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button size="small">
        <Chip.Label>Small Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle size="small">
        <Chip.Label>Small Toggle</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
