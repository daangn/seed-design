import type { TokenCollectionsDocument } from "../ast";
import * as factory from "../factory";
import type * as Document from "./types";
import { parseMetadataDeclaration } from "./metadata";

export function parseTokenCollectionsDocument(
  model: Document.TokenCollectionsModel,
): TokenCollectionsDocument {
  return factory.createTokenCollectionsDocument(
    parseMetadataDeclaration(model.metadata),
    model.data.map((tc) => {
      const modes: string[] = [];
      const modeDescriptions: Record<string, string> = {};

      for (const m of tc.modes) {
        if (typeof m === "string") {
          modes.push(m);
        } else {
          modes.push(m.id);
          if (m.description) {
            modeDescriptions[m.id] = m.description;
          }
        }
      }

      return factory.createTokenCollectionDeclaration(
        tc.name,
        modes,
        Object.keys(modeDescriptions).length > 0 ? modeDescriptions : undefined,
      );
    }),
  );
}
