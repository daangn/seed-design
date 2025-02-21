import type { ComponentSpecDocument, TokenCollectionsDocument, TokensDocument } from "../ast";
import { parseComponentSpecDocument } from "./component-spec";
import type * as Document from "./types";
import { parseTokenCollectionsDocument } from "./token-collections";
import { parseTokensDocument } from "./tokens";

export function fromString(
  text: string,
): TokenCollectionsDocument | TokensDocument | ComponentSpecDocument {
  const model = JSON.parse(text) as Document.Model;

  return fromObject(model);
}

export function fromObject(
  model: Document.Model,
): TokenCollectionsDocument | TokensDocument | ComponentSpecDocument {
  switch (model.kind) {
    case "TokenCollections":
      return parseTokenCollectionsDocument(model);
    case "Tokens":
      return parseTokensDocument(model);
    case "ComponentSpec":
      return parseComponentSpecDocument(model);
    default:
      // @ts-expect-error
      throw new Error(`Unknown document kind: ${model.kind}`);
  }
}
