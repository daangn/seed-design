export function splitMultipleVariantsProps(props, recipesMap) {
  const multipleVariantsProps = {};
  const extractedKeys = new Set();

  for (const recipeKey in recipesMap) {
    const recipe = recipesMap[recipeKey];

    const [variantProps] = recipe.splitVariantProps(props);
    multipleVariantsProps[recipeKey] = variantProps;

    for (const variantPropKey in variantProps) {
      extractedKeys.add(variantPropKey);
    }
  }

  const remainingProps = {};

  for (const propKey in props) {
    if (extractedKeys.has(propKey)) continue;

    remainingProps[propKey] = props[propKey];
  }

  return [multipleVariantsProps, remainingProps];
}
