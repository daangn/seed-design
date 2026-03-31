import type { TokenCollectionsDocument } from "../ast";
import type * as Document from "./types";
import * as factory from "../factory";
import { parseMetadataDeclaration } from "./metadata";

export function parseTokenCollectionsDocument(
  model: Document.TokenCollectionsModel,
): TokenCollectionsDocument {
  return factory.createTokenCollectionsDocument(
    parseMetadataDeclaration(model.metadata),
    model.data.map((tc) => factory.createTokenCollectionDeclaration(tc.name, tc.modes)),
  );
}
