"use client";

import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchSmall() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Switch size="small" checked={isChecked} onCheckedChange={setIsChecked} />
  );
}
