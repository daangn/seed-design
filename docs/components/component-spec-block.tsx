import { Fragment } from "react";
import { ComponentVariantTable } from "./component-variant-table";
import { getRootage } from "./rootage";
import { stringifyVariants } from "./rootage";

interface ComponentSpecTableProps {
  id: string;

  headingComponent?: "h3" | "h4";

  variants?: string[];
}

export async function ComponentSpecBlock({
  id,
  headingComponent: HeadingComponent = "h3",
  variants,
}: ComponentSpecTableProps) {
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

    return (
      <Fragment key={variantKey}>
        <HeadingComponent>{variantKey}</HeadingComponent>
        <ComponentVariantTable rootage={rootage} variant={variantDecl} />
      </Fragment>
    );
  });
}
