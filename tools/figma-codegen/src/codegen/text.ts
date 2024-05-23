export function isHeadingText(textStyle: TextStyle) {
  return textStyle.name.startsWith("heading");
}

export function isBodyText(textStyle: TextStyle) {
  return textStyle.name.startsWith("body");
}

export function createHeadingProps(textStyle: TextStyle) {
  const [_, weight, size] = textStyle.name.split("/");
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
  const [_, weight, size] = textStyle.name.split("/");
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
