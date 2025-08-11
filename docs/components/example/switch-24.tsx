import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function Switch24() {
  const [isChecked, setIsChecked] = useState(false);

  return <Switch size="24" label="라벨" checked={isChecked} onCheckedChange={setIsChecked} />;
}
