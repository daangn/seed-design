export const createClassName = (className, variants, compoundVariants = []) => {
  const variantKeys = Object.keys(variants)

  const variantValues = variantKeys.map((key) => variants[key]);

  const variantClassName = variantKeys
    .map((key, index) => `${className}--${key}_${variantValues[index]}`)
    .join(" ");

  const compountVariantClassName = compoundVariants
    .filter((compoundVariant) =>
      Object.keys(compoundVariant).every((key) => compoundVariant[key] === variants[key]),
    )
    .map(
      (compoundVariant) =>
        `${className}--${Object.keys(compoundVariant)
          .map((key) => {
            return `${key}_${compoundVariant[key]}`;
          })
          .join("-")}`,
    )
    .join(" ");

  return [className, variantClassName, compountVariantClassName].filter(Boolean).join(" ");
};

export function mergeVariants(a, b) {
  const result = { ...a };
  for (const k in b) {
    if (b[k] != null) {
      result[k] = b[k];
    }
  }
  return result;
}

export function splitVariantProps(props, variantMap) {
  const variantProps = {};
  const otherProps = {};
  for (const key in props) {
    if (variantMap[key] != null) {
      variantProps[key] = props[key];
    } else {
      otherProps[key] = props[key];
    }
  }
  return [variantProps, otherProps];
}
