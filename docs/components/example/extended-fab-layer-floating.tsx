import { IconBellFill } from "@daangn/react-monochrome-icon";
import { ExtendedFab, PrefixIcon } from "@seed-design/react";

export default function ExtendedFabLayerFloating() {
  return (
    <ExtendedFab variant="layerFloating">
      <PrefixIcon svg={<IconBellFill />} />
      알림 설정
    </ExtendedFab>
  );
}
