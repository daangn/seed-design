import { ScrollFog } from "@seed-design/react";

export default function ScrollFogHideScrollbar() {
  return (
    <div
      style={{
        maxWidth: "400px",
        maxHeight: "300px",
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
      }}
    >
      <ScrollFog hideScrollBar placement={["top", "bottom", "left", "right"]}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 100px)",
            gap: "12px",
            padding: "20px",
          }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "gray",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </ScrollFog>
    </div>
  );
}
