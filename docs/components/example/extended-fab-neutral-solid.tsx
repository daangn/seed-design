import { IconBellFill } from "@daangn/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ExtendedFab } from "@seed-design/react";

export default function ExtendedFabNeutralSolid() {
  return (
    <ExtendedFab variant="neutralSolid">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
