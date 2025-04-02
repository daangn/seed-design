import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabNeutralSolid() {
  return (
    <ExtendedFab variant="neutralSolid">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
