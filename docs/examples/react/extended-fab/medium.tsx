import { IconBellFill } from "@karrotmarket/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabMedium() {
  return (
    <ExtendedFab size="medium">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
