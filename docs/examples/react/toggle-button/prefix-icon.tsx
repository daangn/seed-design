import { IconCheckmarkLine, IconPlusLine } from "@karrotmarket/react-monochrome-icon";
import { PrefixIcon } from "@seed-design/react";
import { useState } from "react";
import { ToggleButton } from "seed-design/ui/toggle-button";

export default function ToggleButtonPrefixIcon() {
  const [pressed, setPressed] = useState(false);

  return (
    <ToggleButton pressed={pressed} onPressedChange={setPressed}>
      <PrefixIcon svg={pressed ? <IconPlusLine /> : <IconCheckmarkLine />} />
      {pressed ? "선택됨" : "미선택"}
    </ToggleButton>
  );
}
