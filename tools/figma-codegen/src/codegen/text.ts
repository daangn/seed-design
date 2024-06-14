export function isHeadingText(textStyle: TextStyle) {
  return textStyle.name.startsWith("heading");
}

export function isBodyText(textStyle: TextStyle) {
  return textStyle.name.startsWith("body");
}

export function createHeadingProps(textStyle: TextStyle) {
  const rest = textStyle.name.split("/")[1]?.split("-") ?? [];
  const weight = rest.pop();
  const size = rest.join("-");

  if (!size) {
    throw new Error(`Invalid heading text style name: ${textStyle.name}`);
  }
  if (weight === "default") {
    return {
      size,
    };
  }

  return { weight, size };
}

export function createBodyProps(textStyle: TextStyle) {
  const rest = textStyle.name.split("/")[1]?.split("-") ?? [];
  const weight = rest.pop();
  const size = rest.join("-");

  if (!size) {
    throw new Error(`Invalid body text style name: ${textStyle.name}`);
  }
  if (weight === "default") {
    return {
      size,
    };
  }

  return { weight, size };
}
