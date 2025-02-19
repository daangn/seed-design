import { IconBellFill } from "@daangn/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ExtendedFab } from "@seed-design/react";

export default function ExtendedFabSmall() {
  return (
    <ExtendedFab size="small">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
