import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCirclePreview() {
  // if you want to show an indeterminate progress circle, you can pass `undefined` or omit the `value` prop
  return <ProgressCircle value={undefined} />;
}
