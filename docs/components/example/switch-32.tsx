import { useState } from "react";
import { Switch } from "seed-design/ui/switch";

export default function Switch32() {
  const [isChecked, setIsChecked] = useState(false);

  return <Switch size="32" label="라벨" checked={isChecked} onCheckedChange={setIsChecked} />;
}
