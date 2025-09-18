import { ProgressCircle } from "seed-design/ui/progress-circle";

export default function ProgressCircleStaticWhite() {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        width: "100vw",
        height: "300px",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
      }}
    >
      <ProgressCircle tone="staticWhite" />
    </div>
  );
}
