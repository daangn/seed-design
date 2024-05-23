export const createClassName = (className, variants) => {
  const variantKeys = Object.keys(variants);

  const variantValues = variantKeys.map((key) => variants[key]);

  const variantClassName = variantKeys
    .map((key, index) => `${className}--${key}_${variantValues[index]}`)
    .join(" ");

  return `${className} ${variantClassName}`;
};
