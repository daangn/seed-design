import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function SwitchPreview() {
  const [isChecked, setIsChecked] = useState(false);

  return <Switch checked={isChecked} onCheckedChange={setIsChecked} />;
}
