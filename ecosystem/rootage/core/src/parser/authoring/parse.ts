import * as YAML from "yaml";
import type {
  BreakpointsDocument,
  ComponentSpecDocument,
  TokenCollectionsDocument,
  TokensDocument,
} from "../ast";
import * as factory from "../factory";
import { parseComponentSpecDocument } from "./component-spec";
import { parseMetadataDeclaration } from "./metadata";
import type * as Document from "./types";
import { parseTokenCollectionsDocument } from "./token-collections";
import { parseTokensDocument } from "./tokens";

export function fromString(
  text: string,
): TokenCollectionsDocument | TokensDocument | ComponentSpecDocument | BreakpointsDocument {
  const model = YAML.parse(text) as Document.Model;

  return fromObject(model);
}

export function fromObject(
  model: Document.Model,
): TokenCollectionsDocument | TokensDocument | ComponentSpecDocument | BreakpointsDocument {
  switch (model.kind) {
    case "TokenCollections":
      return parseTokenCollectionsDocument(model);
    case "Tokens":
      return parseTokensDocument(model);
    case "ComponentSpec":
      return parseComponentSpecDocument(model);
    case "Breakpoints":
      return parseBreakpointsDocument(model);
    default:
      // @ts-expect-error
      throw new Error(`Unknown document kind: ${model.kind}`);
  }
}

function parseBreakpointsDocument(model: Document.BreakpointsModel): BreakpointsDocument {
  const metadata = parseMetadataDeclaration(model.metadata);
  const entries = Object.entries(model.data.breakpoints)
    .map(([name, minWidth]) => factory.createBreakpointEntry(name, minWidth))
    .sort((a, b) => a.minWidth - b.minWidth);
  return factory.createBreakpointsDocument(metadata, entries);
}
