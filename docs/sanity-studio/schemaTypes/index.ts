import { type SchemaTypeDefinition } from "sanity";

import componentType from "./component";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [componentType],
};
