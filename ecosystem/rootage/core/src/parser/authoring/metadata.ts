import type { MetadataDeclaration } from "../ast";
import * as factory from "../factory";

export function parseMetadataDeclaration(
  metadata: Record<string, string | number | boolean>,
): MetadataDeclaration {
  return factory.createMetadataDeclaration(
    Object.entries(metadata).map(([k, v]) => factory.createMetadataFieldDeclaration(k, v)),
  );
}
