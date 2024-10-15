"use client";

import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchMedium() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Switch size="medium" checked={isChecked} onCheckedChange={setIsChecked} />
  );
}
