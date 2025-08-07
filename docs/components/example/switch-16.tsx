import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function Switch16() {
  const [isChecked, setIsChecked] = useState(false);

  return <Switch size="16" label="라벨" checked={isChecked} onCheckedChange={setIsChecked} />;
}
