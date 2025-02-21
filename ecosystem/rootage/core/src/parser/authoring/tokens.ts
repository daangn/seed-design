import type {
  ColorHexLit,
  CubicBezierLit,
  DimensionLit,
  DurationLit,
  GradientLit,
  NumberLit,
  ShadowLit,
  TokenDeclaration,
  TokenLit,
  TokensDocument,
} from "../ast";
import * as factory from "../factory";
import type * as Document from "./types";
import { isTokenRef } from "./is-token-ref";
import { parseMetadataDeclaration } from "./metadata";
import { parseValue } from "./value";

export function parseTokensDocument(model: Document.TokensModel): TokensDocument {
  return factory.createTokensDocument(
    parseMetadataDeclaration(model.metadata),
    parseTokenDeclarations(model.data),
  );
}

export function parseTokenDeclarations(data: Document.TokensData): TokenDeclaration[] {
  const out: TokenDeclaration[] = [];
  const collectionName = data.collection;

  // Each token entry => a single TokenDeclaration
  for (const [tokenRef, tokenData] of Object.entries(data.tokens)) {
    // Now gather all "modes" => array of { mode, value: AST literal or token lit }
    const modeValues = Object.entries(tokenData.values).map(([mode, val]) => ({
      mode,
      value: isTokenRef(val) ? factory.createTokenLit(val) : parseValue(val),
    }));
    const baseKind = modeValues.find(({ value }) => !isTokenRef(value))?.value.kind ?? "TokenLit";

    // Depending on `baseType`, pick the appropriate TokenDeclaration kind.
    // TODO: We should try to resolve TokenLit types from references.
    switch (baseKind) {
      case "ColorHexLit":
        out.push(
          factory.createColorTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createColorTokenValueDeclaration(mode, value as ColorHexLit | TokenLit),
            ),
            tokenData.description,
          ),
        );
        break;
      case "DimensionLit":
        out.push(
          factory.createDimensionTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createDimensionTokenValueDeclaration(mode, value as DimensionLit | TokenLit),
            ),
            tokenData.description,
          ),
        );
        break;
      case "NumberLit":
        out.push(
          factory.createNumberTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createNumberTokenValueDeclaration(mode, value as NumberLit | TokenLit),
            ),
            tokenData.description,
          ),
        );
        break;
      case "DurationLit":
        out.push(
          factory.createDurationTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createDurationTokenValueDeclaration(mode, value as DurationLit | TokenLit),
            ),
            tokenData.description,
          ),
        );
        break;
      case "CubicBezierLit":
        out.push(
          factory.createCubicBezierTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createCubicBezierTokenValueDeclaration(
                mode,
                value as CubicBezierLit | TokenLit,
              ),
            ),
            tokenData.description,
          ),
        );
        break;
      case "ShadowLit":
        out.push(
          factory.createShadowTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createShadowTokenValueDeclaration(mode, value as ShadowLit | TokenLit),
            ),
            tokenData.description,
          ),
        );
        break;
      case "GradientLit":
        out.push(
          factory.createGradientTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createGradientTokenValueDeclaration(mode, value as GradientLit | TokenLit),
            ),
            tokenData.description,
          ),
        );
        break;
      default:
        out.push(
          factory.createUnresolvedTokenDeclaration(
            collectionName,
            factory.createTokenLit(tokenRef),
            modeValues.map(({ mode, value }) =>
              factory.createUnresolvedTokenValueDeclaration(mode, value as TokenLit),
            ),
            tokenData.description,
          ),
        );
    }
  }

  return out;
}
