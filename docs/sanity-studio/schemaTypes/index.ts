import { type SchemaTypeDefinition } from "sanity";

import blockContentType from "./blockContent";
import blogType from "./blog";
import categoryType from "./category";
import componentType from "./component";
import { doDontSectionType } from "./doDontType";
import guidelineType from "./guideline";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    guidelineType,
    blogType,
    categoryType,
    doDontSectionType,
    componentType,
  ],
};
