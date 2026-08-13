import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircleStaticWhite() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "200px",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
      }}
    >
      <ProgressCircle tone="staticWhite" />
    </div>
  );
}
