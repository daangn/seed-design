import { IconFaceSmileCircleFill } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ReactionButton } from "seed-design/ui/reaction-button";

export default function ReactionButtonDisabled() {
  return (
    <ReactionButton disabled>
      <PrefixIcon svg={<IconFaceSmileCircleFill />} />
      비활성
    </ReactionButton>
  );
}
