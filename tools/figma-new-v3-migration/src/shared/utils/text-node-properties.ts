export function getFontWeight(fontWeight: string) {
  switch (fontWeight) {
    case "Thin":
      return 100;
    case "Extra Light":
      return 200;
    case "Light":
      return 300;
    case "Regular":
      return 400;
    case "Medium":
      return 500;
    case "Semi Bold":
      return 600;
    case "Bold":
      return 700;
    case "Extra Bold":
      return 800;
    case "Black":
      return 900;
    default:
      return null;
  }
}

export function getFontWeightLabel(fontWeight: number) {
  switch (fontWeight) {
    case 100:
      return "Thin";
    case 200:
      return "Extra Light";
    case 300:
      return "Light";
    case 400:
      return "Regular";
    case 500:
      return "Medium";
    case 600:
      return "Semi Bold";
    case 700:
      return "Bold";
    case 800:
      return "Extra Bold";
    case 900:
      return "Black";
    default:
      return `${fontWeight}`;
  }
}

export function convertPixelLineHeightToPercent(lineHeight: number, fontSize: number) {
  return Math.round((lineHeight / fontSize) * 100 * 10) / 10;
}

export function convertPercentLineHeightToPixel(lineHeight: number, fontSize: number) {
  return Math.round((lineHeight / 100) * fontSize * 10) / 10;
}

export function getLineHeightUnitString(
  lineHeight: LineHeight,
  fontSize: number,
  showConverted?: boolean,
) {
  if (lineHeight.unit === "AUTO") return "Auto";

  if (lineHeight.unit === "PERCENT")
    return `${Math.round(lineHeight.value)}%${showConverted ? ` (${convertPercentLineHeightToPixel(lineHeight.value, fontSize)}px)` : ""}`;

  if (lineHeight.unit === "PIXELS")
    return `${lineHeight.value}px${showConverted ? ` (${convertPixelLineHeightToPercent(lineHeight.value, fontSize)}%)` : ""}`;

  return "Unknown";
}

function getLineHeightDifference(
  a: { fontSize: number | PluginAPI["mixed"]; lineHeight: LineHeight | PluginAPI["mixed"] },
  b: { fontSize: number | PluginAPI["mixed"]; lineHeight: LineHeight | PluginAPI["mixed"] },
) {
  if (a.lineHeight === figma.mixed || b.lineHeight === figma.mixed) return null;

  if (a.lineHeight.unit === b.lineHeight.unit) {
    // auto - auto
    if (a.lineHeight.unit === "AUTO" || b.lineHeight.unit === "AUTO") return 0;

    // pixels - pixels or percent - percent
    return Math.round((a.lineHeight.value - b.lineHeight.value) * 10) / 10;
  }

  if (a.lineHeight.unit === "PERCENT" && b.lineHeight.unit === "PIXELS") {
    // percent - pixels
    if (a.fontSize === figma.mixed) return null;

    const aLineHeightInPixels = convertPercentLineHeightToPixel(a.lineHeight.value, a.fontSize);

    return Math.round((aLineHeightInPixels - b.lineHeight.value) * 10) / 10;
  }

  if (a.lineHeight.unit === "PIXELS" && b.lineHeight.unit === "PERCENT") {
    // pixels - percent
    if (b.fontSize === figma.mixed) return null;
    const bLineHeightInPixels = convertPercentLineHeightToPixel(b.lineHeight.value, b.fontSize);

    return Math.round((a.lineHeight.value - bLineHeightInPixels) * 10) / 10;
  }

  // auto - pixels or auto - percent, or vice versa
  return null;
}

export function getTextPropertyDifferences(
  a: {
    fontSize: number | PluginAPI["mixed"];
    fontWeight: number | PluginAPI["mixed"];
    lineHeight: LineHeight | PluginAPI["mixed"];
  },
  b: {
    fontSize: number | PluginAPI["mixed"];
    fontWeight: number | PluginAPI["mixed"];
    lineHeight: LineHeight | PluginAPI["mixed"];
  },
) {
  const fontSize =
    a.fontSize === figma.mixed || b.fontSize === figma.mixed ? null : a.fontSize - b.fontSize;

  const fontWeight =
    a.fontWeight === figma.mixed || b.fontWeight === figma.mixed
      ? null
      : a.fontWeight - b.fontWeight;

  const lineHeight = getLineHeightDifference(a, b);

  return { fontSize, fontWeight, lineHeight };
}
