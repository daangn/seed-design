import * as YAML from "yaml";
import * as fs from "node:fs";
import * as path from "node:path";
import type { LocalVariable, VariableAlias } from "@figma/rest-api-spec";

function rgbaToHex(r: number, g: number, b: number, a: number) {
  // Convert r, g, b from range [0, 1] to [0, 255]
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);

  // Convert to hex string with padding
  const hexRed = red.toString(16).padStart(2, "0");
  const hexGreen = green.toString(16).padStart(2, "0");
  const hexBlue = blue.toString(16).padStart(2, "0");

  if (a === 1) {
    // Return #RRGGBB if alpha is 1
    return `#${hexRed}${hexGreen}${hexBlue}`;
  }
  // Convert alpha from range [0, 1] to [0, 255]
  const alpha = Math.round(a * 255);
  const hexAlpha = alpha.toString(16).padStart(2, "0");
  // Return #RRGGBBAA
  return `#${hexRed}${hexGreen}${hexBlue}${hexAlpha}`;
}

function getColorRootageTokens(variables: LocalVariable[]): string {
  function transformName(str: string) {
    return `$color.${str.split("/").join(".")}`;
  }

  const palettes = variables.filter((variable) =>
    variable.name.startsWith("palette/"),
  ) as LocalVariable[];

  const paletteMap = new Map<string, LocalVariable>(
    palettes.map((palette) => [palette.id, palette]),
  );

  const paletteColors = Object.fromEntries(
    palettes.map((palette) => {
      const lightValue = palette.valuesByMode["1928:7"] as RGBA;
      const darkValue = palette.valuesByMode["1928:8"] as RGBA;

      if (!lightValue || !darkValue) {
        throw new Error(`Palette ${palette.name} is missing values for light or dark mode`);
      }

      return [
        transformName(palette.name),
        {
          values: {
            "theme-light": rgbaToHex(lightValue.r, lightValue.g, lightValue.b, lightValue.a),
            "theme-dark": rgbaToHex(darkValue.r, darkValue.g, darkValue.b, darkValue.a),
          },
        },
      ];
    }),
  );

  const fgs = variables.filter((variable) => variable.name.startsWith("fg/"));

  const fgColors = Object.fromEntries(
    fgs.map((fg) => {
      const lightValue = fg.valuesByMode["1928:7"] as VariableAlias;
      const darkValue = fg.valuesByMode["1928:8"] as VariableAlias;

      if (!lightValue || !darkValue) {
        throw new Error(`FG ${fg.name} is missing values for light or dark mode`);
      }

      const lightName = paletteMap.get(lightValue.id)?.name;
      const darkName = paletteMap.get(darkValue.id)?.name;

      if (!lightName || !darkName) {
        throw new Error(`FG ${fg.name} is missing palette values for light or dark mode`);
      }

      return [
        `$color.${fg.name.split("/").join(".")}`,
        {
          values: {
            "theme-light": transformName(lightName),
            "theme-dark": transformName(darkName),
          },
        },
      ];
    }),
  );

  const bgs = variables.filter((variable) => variable.name.startsWith("bg/"));

  const bgColors = Object.fromEntries(
    bgs.map((bg) => {
      const lightValue = bg.valuesByMode["1928:7"];
      const darkValue = bg.valuesByMode["1928:8"];

      if (!lightValue || !darkValue) {
        throw new Error(`BG ${bg.name} is missing values for light or dark mode`);
      }

      // Check if values are RGBA (hex) or VariableAlias (palette reference)
      const isLightRGBA =
        "r" in lightValue && "g" in lightValue && "b" in lightValue && "a" in lightValue;
      const isDarkRGBA =
        "r" in darkValue && "g" in darkValue && "b" in darkValue && "a" in darkValue;

      let lightColor: string;
      let darkColor: string;

      if (isLightRGBA) {
        const rgba = lightValue as any;
        lightColor = rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);
      } else {
        const alias = lightValue as VariableAlias;
        const lightName = paletteMap.get(alias.id)?.name;
        if (!lightName) {
          throw new Error(`BG ${bg.name} is missing palette value for light mode`);
        }
        lightColor = transformName(lightName);
      }

      if (isDarkRGBA) {
        const rgba = darkValue as any;
        darkColor = rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);
      } else {
        const alias = darkValue as VariableAlias;
        const darkName = paletteMap.get(alias.id)?.name;
        if (!darkName) {
          throw new Error(`BG ${bg.name} is missing palette value for dark mode`);
        }
        darkColor = transformName(darkName);
      }

      return [
        `$color.${bg.name.split("/").join(".")}`,
        {
          values: {
            "theme-light": lightColor,
            "theme-dark": darkColor,
          },
        },
      ];
    }),
  );

  const strokes = variables.filter((variable) => variable.name.startsWith("stroke/"));

  const strokeColors = Object.fromEntries(
    strokes.map((stroke) => {
      const lightValue = stroke.valuesByMode["1928:7"] as VariableAlias;
      const darkValue = stroke.valuesByMode["1928:8"] as VariableAlias;

      if (!lightValue || !darkValue) {
        throw new Error(`Stroke ${stroke.name} is missing values for light or dark mode`);
      }

      const lightName = paletteMap.get(lightValue.id)?.name;
      const darkName = paletteMap.get(darkValue.id)?.name;

      if (!lightName || !darkName) {
        throw new Error(`Stroke ${stroke.name} is missing palette values for light or dark mode`);
      }

      return [
        `$color.${stroke.name.split("/").join(".")}`,
        {
          values: {
            "theme-light": transformName(lightName),
            "theme-dark": transformName(darkName),
          },
        },
      ];
    }),
  );

  const mannerTemps = variables.filter((variable) => variable.name.startsWith("manner-temp/"));

  const mannerTempColors = Object.fromEntries(
    mannerTemps.map((mannerTemp) => {
      const lightValue = mannerTemp.valuesByMode["1928:7"] as RGBA;
      const darkValue = mannerTemp.valuesByMode["1928:8"] as RGBA;

      if (!lightValue || !darkValue) {
        throw new Error(`Palette ${mannerTemp.name} is missing values for light or dark mode`);
      }

      return [
        transformName(mannerTemp.name),
        {
          values: {
            "theme-light": rgbaToHex(lightValue.r, lightValue.g, lightValue.b, lightValue.a),
            "theme-dark": rgbaToHex(darkValue.r, darkValue.g, darkValue.b, darkValue.a),
          },
        },
      ];
    }),
  );

  return YAML.stringify({
    kind: "Tokens",
    metadata: {
      id: "color",
      name: "Color",
    },
    data: {
      collection: "color",
      tokens: {
        ...paletteColors,
        ...fgColors,
        ...bgColors,
        ...strokeColors,
        ...mannerTempColors,
      },
    },
  });
}

const figmaVariables = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, "./data/variables.json"), "utf-8"),
) as LocalVariable[];

const writePath = path.join(import.meta.dirname, "../packages/rootage/color.yaml");
if (!fs.existsSync(path.dirname(writePath))) {
  fs.mkdirSync(path.dirname(writePath), { recursive: true });
}

fs.writeFileSync(
  writePath,
  getColorRootageTokens(
    figmaVariables
      .filter((variable) => !variable.remote && !variable.deletedButReferenced)
      .sort((a, b) => {
        const aParts = a.name.split("-");
        const bParts = b.name.split("-");
        const aName = aParts.slice(0, -1).join("-");
        const bName = bParts.slice(0, -1).join("-");
        const aIndex = Number(aParts[aParts.length - 1]);
        const bIndex = Number(bParts[bParts.length - 1]);
        if (aName === bName) {
          return aIndex - bIndex;
        }

        return aName.localeCompare(bName);
      }),
  ),
);
