import type { TokenCollectionsDocument } from "../ast";
import * as factory from "../factory";
import type * as Document from "./types";
import { parseMetadataDeclaration } from "./metadata";

export function parseTokenCollectionsDocument(
  model: Document.TokenCollectionsModel,
): TokenCollectionsDocument {
  return factory.createTokenCollectionsDocument(
    parseMetadataDeclaration(model.metadata),
    model.data.map((tc) => factory.createTokenCollectionDeclaration(tc.name, tc.modes)),
  );
}
