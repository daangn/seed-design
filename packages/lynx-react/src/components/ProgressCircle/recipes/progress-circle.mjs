import "./progress-circle.lynx.css";

const progressCircleSlotNames = [
  ["root", "seed-progress-circle__root"],
  ["halfContainer", "seed-progress-circle__half-container"],
  ["range", "seed-progress-circle__range"],
  ["cap", "seed-progress-circle__cap"],
];

const defaultVariant = {
  tone: "neutral",
  size: "40",
};

function createClassName(className, variants) {
  const parts = [className];
  for (const key in variants) {
    parts.push(`${className}--${key}_${variants[key]}`);
  }
  return parts.join(" ");
}

function mergeVariants(a, b) {
  const result = { ...a };
  for (const k in b) {
    if (b[k] != null) {
      result[k] = b[k];
    }
  }
  return result;
}

export const progressCircleVariantMap = {
  tone: ["neutral", "brand", "staticWhite"],
  size: ["24", "40"],
};

export const progressCircleVariantKeys = Object.keys(progressCircleVariantMap);

export function progressCircle(props) {
  const merged = mergeVariants(defaultVariant, props);
  const entries = progressCircleSlotNames.map(([slot, className]) => {
    return [slot, createClassName(className, merged)];
  });

  const result = Object.fromEntries(entries);

  result.halfRotator = (side) =>
    `seed-progress-circle__half-rotator seed-progress-circle__half-rotator--side_${side}`;

  return result;
}
