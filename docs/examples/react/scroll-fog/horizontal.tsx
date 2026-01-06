import { HStack, ScrollFog } from "@seed-design/react";

export default function ScrollFogHorizontal() {
  return (
    <div
      style={{
        border: "1px solid var(--seed-color-stroke-neutral-weak)",
        borderRadius: "8px",
        width: "300px",
      }}
    >
      <ScrollFog placement={["left", "right"]}>
        <HStack gap="x3" px="20px" py="x4" style={{ width: "max-content" }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                minWidth: "120px",
                padding: "20px",
                backgroundColor: "gray",
                borderRadius: "4px",
                textAlign: "center",
              }}
            >
              {i + 1}
            </div>
          ))}
        </HStack>
      </ScrollFog>
    </div>
  );
}
