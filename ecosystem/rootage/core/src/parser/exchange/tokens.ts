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
  // For each token, we guess the type of token from the first mode's value type.
  for (const [tokenRef, tokenData] of Object.entries(data.tokens)) {
    // get the first mode's value to guess the type
    const firstMode = Object.keys(tokenData.values)[0]!;
    const firstValue = tokenData.values[firstMode]!;

    // We'll do a quick check: if it's not a plain object or union with type,
    // handle that scenario. (Could be a token reference again, etc.)
    const baseType = firstValue.type;

    // Now gather all "modes" => array of { mode, value: AST literal or token lit }
    const modeValues = Object.entries(tokenData.values).map(([mode, val]) => ({
      mode,
      value: parseValue(val), // parseValue returns the appropriate *Lit or TokenLit
    }));

    // Depending on `baseType`, pick the appropriate TokenDeclaration kind.
    switch (baseType) {
      case "color":
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
      case "dimension":
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
      case "number":
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
      case "duration":
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
      case "cubicBezier":
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
      case "shadow":
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
      case "gradient":
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
      // If none matched (e.g. if it's a reference to another token),
      // you might fallback to color or throw an error. We'll just throw here.
      default:
        throw new Error(`Token '${tokenRef}' has unrecognized/unsupported value type: ${baseType}`);
    }
  }

  return out;
}
