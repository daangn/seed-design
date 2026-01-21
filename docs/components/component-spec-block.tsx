import type { AST } from "@seed-design/rootage-core";
import { Fragment } from "react";
import { ComponentVariantTable } from "./component-variant-table";
import { getRootage } from "./rootage";
import { stringifyVariants } from "./rootage";

interface ComponentSpecBlockProps {
  id: string;

  headingComponent?: "h3" | "h4";

  variants?: string[];
}

interface VariantDescriptionItem {
  name: string;
  description: string;
}

function getVariantDescriptions(
  schema: AST.SchemaDeclaration,
  variants: AST.VariantExpression[],
): VariantDescriptionItem[] {
  return variants
    .map((variant) => {
      const schemaVariant = schema.variants.find((v) => v.name === variant.name);
      const schemaValue = schemaVariant?.values.find((v) => v.name === variant.value);
      if (schemaValue?.description)
        return {
          name: `${variant.name}=${variant.value}`,
          description: schemaValue.description,
        };

      return null;
    })
    .filter((item): item is VariantDescriptionItem => item !== null);
}

export async function ComponentSpecBlock({
  id,
  headingComponent: HeadingComponent = "h3",
  variants,
}: ComponentSpecBlockProps) {
  const rootage = await getRootage();
  const componentSpec = rootage.componentSpecEntities[id];

  if (!componentSpec) {
    throw new Error(`Component spec ${id} not found`);
  }

  return componentSpec.body.map((variantDecl) => {
    const variantKey = stringifyVariants(variantDecl.variants);
    if (variants && !variants.includes(variantKey)) {
      return null;
    }

    const variantDescriptions = getVariantDescriptions(componentSpec.schema, variantDecl.variants);

    return (
      <Fragment key={variantKey}>
        <HeadingComponent>{variantKey}</HeadingComponent>
        {variantDescriptions.length > 0 && (
          <ul className="text-fd-muted-foreground text-sm mt-1 mb-4 list-disc list-inside">
            {variantDescriptions.map((item) => (
              <li key={item.name}>
                {variantDescriptions.length > 1 && (
                  <>
                    <strong>{item.name}</strong>
                    {": "}
                  </>
                )}
                {item.description}
              </li>
            ))}
          </ul>
        )}
        <ComponentVariantTable
          rootage={rootage}
          variant={variantDecl}
          schema={componentSpec.schema}
        />
      </Fragment>
    );
  });
}
