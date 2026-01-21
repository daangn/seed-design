import type {
  LocalVariable,
  RGBA,
  VariableAlias,
  Paint,
  GradientPaint,
  ColorStop,
  Node,
} from "@figma/rest-api-spec";
import { Api as figma } from "figma-api";
import * as fs from "node:fs";
import * as path from "node:path";
import * as YAML from "yaml";

function getKoreanDateString(): string {
  const now = new Date();
  const koreanTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const year = String(koreanTime.getFullYear()).slice(-2);
  const month = String(koreanTime.getMonth() + 1).padStart(2, "0");
  const day = String(koreanTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function rgbaToHex(r: number, g: number, b: number, a: number) {
  // RGBA 값이 유효한지 확인 (NaN, null, undefined 모두 체크)
  if (
    Number.isNaN(r) ||
    Number.isNaN(g) ||
    Number.isNaN(b) ||
    Number.isNaN(a) ||
    r === null ||
    g === null ||
    b === null ||
    a === null ||
    r === undefined ||
    g === undefined ||
    b === undefined ||
    a === undefined
  ) {
    console.warn(`Invalid RGBA values: r=${r}, g=${g}, b=${b}, a=${a}`);
    return "#000000"; // 기본값 반환
  }

  // Convert r, g, b from range [0, 1] to [0, 255]
  const red = Math.round(r * 255);
  const green = Math.round(g * 255);
  const blue = Math.round(b * 255);

  // 변환된 값도 NaN인지 확인
  if (Number.isNaN(red) || Number.isNaN(green) || Number.isNaN(blue)) {
    console.warn(`NaN values after conversion: red=${red}, green=${green}, blue=${blue}`);
    return "#000000";
  }

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
  if (Number.isNaN(alpha)) {
    console.warn(`NaN alpha value after conversion: ${alpha}`);
    return `#${hexRed}${hexGreen}${hexBlue}`;
  }
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

  const resolveValueByMode = (
    value: LocalVariable["valuesByMode"][keyof LocalVariable["valuesByMode"]],
  ) => {
    const isRGBA =
      typeof value === "object" && "r" in value && "g" in value && "b" in value && "a" in value;

    if (isRGBA) return rgbaToHex(value.r, value.g, value.b, value.a);

    const isAlias = typeof value === "object" && value.type === "VARIABLE_ALIAS";

    if (isAlias) {
      const name = paletteMap.get(value.id)?.name;
      if (!name) throw new Error(`${name} is missing palette value`);

      return transformName(name);
    }

    throw new Error(`${value} has unsupported value type`);
  };

  const fgs = variables
    .filter((variable) => variable.name.startsWith("fg/"))
    .sort((a, b) => a.name.localeCompare(b.name));

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

  const bgs = variables
    .filter((variable) => variable.name.startsWith("bg/"))
    .sort((a, b) => a.name.localeCompare(b.name));

  const bgColors = Object.fromEntries(
    bgs.map((bg) => {
      const lightValue = bg.valuesByMode["1928:7"];
      const darkValue = bg.valuesByMode["1928:8"];

      if (!lightValue || !darkValue) {
        throw new Error(`BG ${bg.name} is missing values for light or dark mode`);
      }

      return [
        `$color.${bg.name.split("/").join(".")}`,
        {
          values: {
            "theme-light": resolveValueByMode(lightValue),
            "theme-dark": resolveValueByMode(darkValue),
          },
        },
      ];
    }),
  );

  const strokes = variables
    .filter((variable) => variable.name.startsWith("stroke/"))
    .sort((a, b) => a.name.localeCompare(b.name));

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

  const mannerTemps = variables
    .filter((variable) => variable.name.startsWith("manner-temp/"))
    .sort((a, b) => a.name.localeCompare(b.name));

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

  const bannerBgs = variables
    .filter((variable) => variable.name.startsWith("banner/"))
    .sort((a, b) => a.name.localeCompare(b.name));

  const bannerBgColors = Object.fromEntries(
    bannerBgs.map((bannerBg) => {
      const lightValue = bannerBg.valuesByMode["1928:7"] as RGBA;
      const darkValue = bannerBg.valuesByMode["1928:8"] as RGBA;

      if (!lightValue || !darkValue) {
        throw new Error(`Palette ${bannerBg.name} is missing values for light or dark mode`);
      }

      return [
        transformName(bannerBg.name),
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
      lastUpdated: getKoreanDateString(),
    },
    data: {
      collection: "color",
      tokens: {
        ...paletteColors,
        ...fgColors,
        ...bgColors,
        ...strokeColors,
        ...mannerTempColors,
        ...bannerBgColors,
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
    figmaVariables.filter((variable) => !variable.remote && !variable.deletedButReferenced),
  ),
);

// Figma API 설정 - 환경변수에서 가져오기
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const FIGMA_TOKEN = process.env.FIGMA_PERSONAL_ACCESS_TOKEN;

async function fetchFigmaStyles() {
  if (!FIGMA_TOKEN) {
    console.warn(
      "FIGMA_PERSONAL_ACCESS_TOKEN 환경변수가 설정되지 않았습니다. 스타일 추출을 건너뜁니다.",
    );
    return [];
  }

  if (!FIGMA_FILE_KEY) {
    console.warn("FIGMA_FILE_KEY 환경변수가 설정되지 않았습니다. 스타일 추출을 건너뜁니다.");
    return [];
  }

  try {
    const api = new figma({ personalAccessToken: FIGMA_TOKEN });
    const {
      meta: { styles },
    } = await api.getFileStyles({ file_key: FIGMA_FILE_KEY });
    return styles;
  } catch (error) {
    console.warn("Figma 스타일을 가져오는데 실패했습니다:", error);
    return [];
  }
}

async function fetchFigmaVariables() {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    console.warn("Figma 환경변수가 설정되지 않았습니다. 변수 추출을 건너뜁니다.");
    return [];
  }

  try {
    const api = new figma({ personalAccessToken: FIGMA_TOKEN });
    const {
      meta: { variables },
    } = await api.getLocalVariables({ file_key: FIGMA_FILE_KEY });
    return Object.values(variables);
  } catch (error) {
    console.warn("Figma 변수를 가져오는데 실패했습니다:", error);
    return [];
  }
}

// 변수 ID를 색상 값으로 매핑하는 Map 생성
function createVariableColorMap(
  variables: LocalVariable[],
): Map<string, { light: string; dark: string }> {
  const variableColorMap = new Map<string, { light: string; dark: string }>();

  variables.forEach((variable) => {
    if (variable.resolvedType === "COLOR") {
      const lightValue = variable.valuesByMode["1928:7"] as RGBA;
      const darkValue = variable.valuesByMode["1928:8"] as RGBA;

      if (lightValue && darkValue) {
        variableColorMap.set(variable.id, {
          light: rgbaToHex(lightValue.r, lightValue.g, lightValue.b, lightValue.a),
          dark: rgbaToHex(darkValue.r, darkValue.g, darkValue.b, darkValue.a),
        });
      }
    }
  });

  return variableColorMap;
}

async function fetchStyleNodeDetails(nodeIds: string[]) {
  if (!FIGMA_TOKEN || !FIGMA_FILE_KEY) {
    return {};
  }

  try {
    // API URL을 직접 구성해서 요청
    const idsParam = nodeIds.join(",");
    const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${idsParam}`;

    const response = await fetch(url, {
      headers: {
        "X-Figma-Token": FIGMA_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.nodes;
  } catch (error) {
    console.warn("Figma 노드 상세 정보를 가져오는데 실패했습니다:", error);
    return {};
  }
}

function parseGradientFill(fill: Paint): {
  type: string;
  gradientStops: Array<{ position: number; color: RGBA; boundVariableId?: string }>;
} | null {
  if (
    fill.type !== "GRADIENT_LINEAR" &&
    fill.type !== "GRADIENT_RADIAL" &&
    fill.type !== "GRADIENT_ANGULAR"
  ) {
    return null;
  }

  const gradientFill = fill as GradientPaint;
  const gradientStops = gradientFill.gradientStops?.map((stop: ColorStop) => {
    // ColorVariable 참조가 있는지 확인
    const boundVariableId = stop.boundVariables?.color?.id;

    return {
      position: stop.position,
      color: {
        r: stop.color.r,
        g: stop.color.g,
        b: stop.color.b,
        a: stop.color.a,
      },
      boundVariableId, // Variable ID 저장 (있는 경우)
    };
  });

  return {
    type: gradientFill.type,
    gradientStops: gradientStops || [],
  };
}

function getGradientTypeName(styleName: string): string {
  // 백스페이스 문자 제거 및 방향 정보 제거하고 타입명만 추출
  // 예: "gradient/fade/layer-floating/↑(to-top)" -> "fade-layer-floating"
  const cleanName = styleName
    .replace(/\\b/g, "") // 백스페이스 문자 제거
    .replace(/\/[↑↓→←].*$/, ""); // 방향 부분 제거
  const parts = cleanName.split("/").slice(1); // "gradient/" 제거
  return parts.join("-");
}

function cleanTokenName(name: string): string {
  // 토큰 이름에서 백스페이스 문자 제거 및 정규화
  return name.replace(/\\b/g, "").replace(/[^\w.-]/g, "-");
}

function roundPosition(position: number): number {
  // position 값을 소수점 둘째자리로 반올림 (0.54, 0.43 형식)
  return Math.round(position * 100) / 100;
}

// 테마에 따른 색상 해결 함수
function resolveStopColor(
  stop: { position: number; color: RGBA; boundVariableId?: string },
  theme: "light" | "dark",
  variableColorMap: Map<string, { light: string; dark: string }>,
): string {
  // Variable 참조가 있는 경우 해당 변수의 색상 사용
  if (stop.boundVariableId) {
    const variableColors = variableColorMap.get(stop.boundVariableId);
    if (variableColors) {
      console.log(
        `✅ Variable resolved: ${stop.boundVariableId} -> ${variableColors[theme]} (${theme})`,
      );
      return variableColors[theme];
    }
    console.warn(`❌ Variable not found in map: ${stop.boundVariableId}`);
    // Variable 참조가 있지만 찾을 수 없는 경우 기본값 반환
    return "#000000";
  }

  // Variable 참조가 없는 경우에만 직접 RGBA 색상 사용
  // 단, RGBA 값이 유효한지 먼저 확인
  if (
    Number.isNaN(stop.color.r) ||
    Number.isNaN(stop.color.g) ||
    Number.isNaN(stop.color.b) ||
    Number.isNaN(stop.color.a)
  ) {
    console.warn(
      `❌ Invalid RGBA in stop without variable: r=${stop.color.r}, g=${stop.color.g}, b=${stop.color.b}, a=${stop.color.a}`,
    );
    return "#000000";
  }

  console.log(
    `✅ Using direct RGBA: r=${stop.color.r}, g=${stop.color.g}, b=${stop.color.b}, a=${stop.color.a}`,
  );
  return rgbaToHex(stop.color.r, stop.color.g, stop.color.b, stop.color.a);
}

async function generateGradientTokensFromStyles(): Promise<string> {
  const styles = await fetchFigmaStyles();
  const variables = await fetchFigmaVariables();
  const variableColorMap = createVariableColorMap(variables);

  // 그라디언트 관련 스타일 필터링
  const gradientStyles = styles.filter(
    (style) =>
      style.name.toLowerCase().includes("gradient") ||
      style.description?.toLowerCase().includes("gradient"),
  );

  // 노드 상세 정보 가져오기
  const nodeIds = gradientStyles.map((style) => style.node_id);
  const nodeDetails = await fetchStyleNodeDetails(nodeIds);

  // 타입별로 그룹핑 (방향 무시)
  const groupedStyles = new Map<
    string,
    {
      description: string | undefined;
      gradientStops: Array<{ position: number; color: RGBA; boundVariableId?: string }>;
    }
  >();

  gradientStyles.forEach((style) => {
    const typeName = getGradientTypeName(style.name);

    // 노드 상세 정보에서 fill 정보 추출
    const nodeDetail = nodeDetails[style.node_id];
    if (nodeDetail?.document) {
      // 타입 가드: fills 속성이 있는지 확인
      const document = nodeDetail.document as Node;
      if ("fills" in document && Array.isArray(document.fills)) {
        const fills = document.fills as Paint[];
        if (fills && fills.length > 0) {
          const fill = fills[0]; // 첫 번째 fill 사용
          const gradientInfo = parseGradientFill(fill);
          if (gradientInfo?.gradientStops) {
            groupedStyles.set(typeName, {
              description: style.description,
              gradientStops: gradientInfo.gradientStops,
            });
          }
        }
      }
    }
  });

  // 토큰 생성
  const tokens = Object.fromEntries(
    Array.from(groupedStyles.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([typeName, data]) => [
        `$gradient.${cleanTokenName(typeName)}`,
        {
          description: data.description,
          values: {
            "theme-light": {
              type: "gradient",
              value: data.gradientStops.map((stop) => ({
                color: resolveStopColor(stop, "light", variableColorMap),
                position: roundPosition(stop.position),
              })),
            },
            "theme-dark": {
              type: "gradient",
              value: data.gradientStops.map((stop) => ({
                color: resolveStopColor(stop, "dark", variableColorMap),
                position: roundPosition(stop.position),
              })),
            },
          },
        },
      ]),
  );

  return YAML.stringify({
    kind: "Tokens",
    metadata: {
      id: "gradient",
      name: "Gradient",
      lastUpdated: getKoreanDateString(),
    },
    data: { collection: "color", tokens },
  });
}

async function logGradientStyles() {
  console.log("=== Generating Gradient Tokens from Figma Styles ===");
  const yamlContent = await generateGradientTokensFromStyles();

  const gradientWritePath = path.join(import.meta.dirname, "../packages/rootage/gradient.yaml");
  if (!fs.existsSync(path.dirname(gradientWritePath))) {
    fs.mkdirSync(path.dirname(gradientWritePath), { recursive: true });
  }

  fs.writeFileSync(gradientWritePath, yamlContent);
  console.log(`✅ gradient.yaml 파일이 생성되었습니다: ${gradientWritePath}`);
}

async function generateShadowTokensFromStyles(): Promise<string> {
  const styles = await fetchFigmaStyles();
  const variables = await fetchFigmaVariables();
  const variableColorMap = createVariableColorMap(variables);

  const shadowStyles = styles.filter((style) => style.style_type === "EFFECT");

  const nodeIds = shadowStyles.map((style) => style.node_id);
  const nodeDetails = await fetchStyleNodeDetails(nodeIds);

  const tokens: Record<
    string,
    {
      description?: string;
      values: {
        "theme-light": { type: string; value: Array<Record<string, string>> };
        "theme-dark": { type: string; value: Array<Record<string, string>> };
      };
    }
  > = {};

  for (const style of shadowStyles) {
    const nodeDetail = nodeDetails[style.node_id];
    if (!nodeDetail?.document) continue;

    const document = nodeDetail.document as Node;
    if (!("effects" in document) || !Array.isArray(document.effects)) continue;

    const effects = document.effects as Array<{
      type: string;
      visible?: boolean;
      radius?: number;
      color?: RGBA;
      offset?: { x: number; y: number };
      spread?: number;
      blendMode?: string;
      boundVariables?: {
        color?: { id: string };
      };
    }>;

    const shadowEffects = effects.filter(
      (effect) => effect.visible && effect.type === "DROP_SHADOW",
    );

    if (shadowEffects.length === 0) continue;

    // "shadow/layer-floating" -> "$shadow.layer-floating"
    const tokenName = `$shadow.${style.name.replace(/^shadow\//, "").replace(/\//g, ".")}`;

    const lightShadowValues = shadowEffects.map((effect) => {
      const offset = effect.offset || { x: 0, y: 0 };
      let color: string;

      // resolve boundVariables
      if (effect.boundVariables?.color?.id) {
        const variableColors = variableColorMap.get(effect.boundVariables.color.id);
        color = variableColors?.light || "#00000014";
      } else {
        const rgba = effect.color || { r: 0, g: 0, b: 0, a: 0 };
        color = rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);
      }

      return {
        offsetX: `${offset.x}px`,
        offsetY: `${offset.y}px`,
        blur: `${effect.radius || 0}px`,
        spread: `${effect.spread || 0}px`,
        color,
      };
    });

    const darkShadowValues = shadowEffects.map((effect) => {
      const offset = effect.offset || { x: 0, y: 0 };
      let color: string;

      // resolve boundVariables
      if (effect.boundVariables?.color?.id) {
        const variableColors = variableColorMap.get(effect.boundVariables.color.id);
        color = variableColors?.dark || "#00000014";
      } else {
        const rgba = effect.color || { r: 0, g: 0, b: 0, a: 0 };
        color = rgbaToHex(rgba.r, rgba.g, rgba.b, rgba.a);
      }

      return {
        offsetX: `${offset.x}px`,
        offsetY: `${offset.y}px`,
        blur: `${effect.radius || 0}px`,
        spread: `${effect.spread || 0}px`,
        color,
      };
    });

    tokens[tokenName] = {
      ...(style.description && {
        description: style.description,
      }),
      values: {
        "theme-light": {
          type: "shadow",
          value: lightShadowValues,
        },
        "theme-dark": {
          type: "shadow",
          value: darkShadowValues,
        },
      },
    };
  }

  const sortedTokens = Object.fromEntries(
    Object.entries(tokens).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)),
  );

  return YAML.stringify({
    kind: "Tokens",
    metadata: {
      id: "shadow",
      name: "Shadow",
      lastUpdated: getKoreanDateString(),
    },
    data: { collection: "color", tokens: sortedTokens },
  });
}

async function logShadowStyles() {
  console.log("=== Generating Shadow Tokens from Figma Effect Styles ===");
  const yamlContent = await generateShadowTokensFromStyles();

  const shadowWritePath = path.join(import.meta.dirname, "../packages/rootage/shadow.yaml");
  if (!fs.existsSync(path.dirname(shadowWritePath))) {
    fs.mkdirSync(path.dirname(shadowWritePath), { recursive: true });
  }

  fs.writeFileSync(shadowWritePath, yamlContent);
  console.log(`✅ shadow.yaml 파일이 생성되었습니다: ${shadowWritePath}`);
}

// 그라디언트 스타일에서 토큰 생성
logGradientStyles().catch(console.error);

// 섀도우 스타일에서 토큰 생성
logShadowStyles().catch(console.error);
