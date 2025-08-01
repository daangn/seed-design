import { Chip } from "@/registry/ui/chip";
import { Avatar } from "seed-design/ui/avatar";
import { IdentityPlaceholder } from "seed-design/ui/identity-placeholder";

export default function ChipPrefixAvatar() {
  return (
    <div className="flex items-center gap-2">
      <Chip.Button>
        <Chip.PrefixAvatar>
          <Avatar
            size="24"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        </Chip.PrefixAvatar>
        <Chip.Label>With Avatar Button</Chip.Label>
      </Chip.Button>
      <Chip.Toggle>
        <Chip.PrefixAvatar>
          <Avatar
            size="24"
            src="https://avatars.githubusercontent.com/u/54893898?v=4"
            fallback={<IdentityPlaceholder />}
          />
        </Chip.PrefixAvatar>
        <Chip.Label>With Avatar Toggle</Chip.Label>
      </Chip.Toggle>
    </div>
  );
}
