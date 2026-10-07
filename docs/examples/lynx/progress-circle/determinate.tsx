import "./styles";

import { ProgressCircle } from "@/components/ui/progress-circle";

export default function Example() {
  return <ProgressCircle minValue={0} maxValue={100} value={40} />;
}
