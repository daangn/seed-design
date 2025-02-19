import { IconBellFill } from "@daangn/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { ExtendedFab } from "@seed-design/react";

export default function ExtendedFabLayerFloating() {
  return (
    <ExtendedFab variant="layerFloating">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
