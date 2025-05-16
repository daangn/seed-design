import { typographyMappings } from "@seed-design/migration-index/typography";
import * as changeCase from "change-case";
import type {
  GroupedSerializedTextStyleSuggestionsResults,
  SerializedTextStyleSuggestionsResults,
} from "../../shared/types";
import {
  getAllTextNodesInSceneNodes,
  getClosestInstanceNode,
  serializeInstanceNode,
  serializeTextNode,
} from "../../shared/utils/nodes";
import { serializeTextStyle } from "../../shared/utils/styles";
import {
  getFontWeight,
  getFontWeightLabel,
  getLineHeightUnitString,
  getTextPropertyDifferences,
} from "../../shared/utils/text-node-properties";
import * as v2TextStyles from "../data/__generated__/v2-styles";
import * as v3TextStyles from "../data/__generated__/v3-styles";

const v3TextStyleKeys = Object.values(v3TextStyles).map(({ key }) => key);

export async function getSerializedTextStyleSuggestions({
  nodeIds,
}: {
  nodeIds: SceneNode["id"][];
  systemComponentKeys: string[];
}): Promise<GroupedSerializedTextStyleSuggestionsResults> {
  const nodes = (await Promise.all(nodeIds.map((id) => figma.getNodeByIdAsync(id)))).filter(
    (node) => node !== null && node.type !== "DOCUMENT" && node.type !== "PAGE",
  );

  const textNodesInTarget = getAllTextNodesInSceneNodes(nodes);

  // figma.teamLibrary에서는 variable만 확인할 수 있고, style은 확인할 수 없다.
  // 하드코딩한 key를 가지고 있는 게 현재로서는 최선

  let textStyles: TextStyle[] = [];
  try {
    const styles = await Promise.all(
      v3TextStyleKeys.map((key) => figma.importStyleByKeyAsync(key)),
    );
    textStyles = styles.filter(({ type }) => type === "TEXT") as TextStyle[];

    // library 추가되어있지 않아도 typography import는 가능함.
    if (textStyles.length === 0) {
      figma.notify(
        "Typography를 찾을 수 없습니다. 최신 버전의 라이브러리가 추가되었는지 확인해주세요.",
        {
          error: true,
          timeout: 5000,
        },
      );
      return [];
    }
  } catch {
    figma.notify(
      "Typography를 찾을 수 없습니다. 최신 버전의 라이브러리가 추가되었는지 확인해주세요.",
      {
        error: true,
        timeout: 5000,
      },
    );
    return [];
  }

  const results = [];

  for await (const textNode of textNodesInTarget) {
    // 디자인시스템 컴포넌트 내에 있는 경우 typography 제안 생략
    // if (await isNodeWithinSystemComponents({ node: textNode, systemComponentKeys })) continue;

    const suggestions = await getTextStyleSuggestions(textNode, textStyles);

    const minDistance = Math.min(...suggestions.map(({ distance }) => distance));

    if (minDistance === 0) {
      results.push({
        textNode,
        closestInstanceNode: getClosestInstanceNode(textNode),
        suggestions: suggestions.filter(({ distance }) => distance === minDistance),
      });

      continue;
    }

    const isAllSuggestionsEquivalent =
      suggestions.length > 0 &&
      suggestions.every(
        ({ differences }) =>
          suggestions[0].differences.fontSize === differences.fontSize &&
          suggestions[0].differences.fontWeight === differences.fontWeight &&
          suggestions[0].differences.lineHeight === differences.lineHeight,
      );

    results.push({
      textNode,
      closestInstanceNode: getClosestInstanceNode(textNode),
      suggestions: isAllSuggestionsEquivalent ? suggestions : suggestions.slice(0, 1),
    });
  }

  const serializedResults: SerializedTextStyleSuggestionsResults = results.map(
    ({ textNode, closestInstanceNode, suggestions, ...rest }) => ({
      ...rest,
      selectedNewTextStyleId: textStyles.find(({ id }) => id === textNode.textStyleId)?.id ?? null,
      textNode: serializeTextNode(textNode),
      closestInstanceNode: closestInstanceNode ? serializeInstanceNode(closestInstanceNode) : null,
      suggestions: suggestions.map(({ textStyle, ...rest }) => ({
        ...rest,
        textStyle: serializeTextStyle(textStyle),
      })),
    }),
  );

  const grouped = await groupSerializedTextStyleSuggestionsResults(serializedResults);

  const sorted = grouped.sort((a, b) => {
    const aUnselectedCount = a.items.filter(
      ({ selectedNewTextStyleId }) => selectedNewTextStyleId === null,
    ).length;
    const bUnselectedCount = b.items.filter(
      ({ selectedNewTextStyleId }) => selectedNewTextStyleId === null,
    ).length;

    if (aUnselectedCount < a.items.length && bUnselectedCount === b.items.length) return 1;
    if (aUnselectedCount === a.items.length && bUnselectedCount < b.items.length) return -1;

    if (a.items[0].suggestions.length === 0 && b.items[0].suggestions.length > 0) return 1;
    if (a.items[0].suggestions.length > 0 && b.items[0].suggestions.length === 0) return -1;

    if (aUnselectedCount - bUnselectedCount > 0) return 1;
    if (aUnselectedCount - bUnselectedCount < 0) return -1;

    return a.groupId.localeCompare(b.groupId);
  });

  return sorted;
}

export function groupSerializedTextStyleSuggestionsResults(
  serializedResults: SerializedTextStyleSuggestionsResults,
) {
  const grouped: GroupedSerializedTextStyleSuggestionsResults = [];

  for (const result of serializedResults) {
    const { fontSize, fontWeight, lineHeight } = result.textNode;
    const groupId =
      fontSize === null || fontWeight === null || lineHeight === null
        ? "Mixed"
        : `${fontSize} ${getFontWeightLabel(fontWeight)} ${getLineHeightUnitString(lineHeight, fontSize)}`;

    const group = grouped.find(({ groupId: groupIdToCompare }) => groupIdToCompare === groupId);

    if (group) {
      group.items.push(result);

      continue;
    }

    grouped.push({ groupId, items: [result] });
  }

  return grouped;
}

// 가정: 마이그레이션 대상 화면은 iOS 기준으로 디자인되어 있다.
// 혹시 모르니 property에 android같은 정보 있으면 실행 전 알려주는 것도 좋을 듯
export async function getTextStyleSuggestions(
  textNode: TextNode,
  availableTextStyles: TextStyle[],
) {
  const closestTextStyle = getClosestTextStyle(availableTextStyles, textNode);

  if (closestTextStyle) return closestTextStyle;

  const currentStyleId = textNode.getStyledTextSegments(["textStyleId"])[0]?.textStyleId;

  if (!currentStyleId) return [];

  let currentStyle = Object.values(v2TextStyles).find((style) => style.key === currentStyleId);

  // currentStyleId로 스타일을 찾지 못한 경우, 텍스트 노드의 실제 스타일 이름을 가져와서
  // v2TextStyles에서 비슷한 이름을 가진 스타일을 찾는다
  if (!currentStyle) {
    // 텍스트 노드에서 스타일 이름을 가져옵니다
    try {
      const textStyle = (await figma.getStyleByIdAsync(currentStyleId)) as TextStyle | null;

      if (textStyle) {
        const styleName = textStyle.name;

        // name에 포함된 경우도 찾아봅니다
        currentStyle = Object.values(v2TextStyles).find(
          (style) => styleName.includes(style.name) || style.name.includes(styleName),
        );
      }
    } catch (error) {
      console.log("typography 이름 가져오기 실패", error);
    }
  }

  // 그래도 찾지 못한 경우 빈 배열 반환
  if (!currentStyle) {
    console.log("currentStyle을 찾을 수 없음");
    return [];
  }

  // v2 스타일 이름에서 플랫폼 정보를 제거하고 실제 스타일 이름만 추출
  const [, ...styleParts] = currentStyle.name.split("/");
  const v2StyleName = styleParts.join("/");

  // v2StyleName에서 '.'이 있는 경우 마지막 세그먼트 추출
  const v2Name = v2StyleName.includes(".")
    ? (v2StyleName.split(".").pop() ?? v2StyleName)
    : v2StyleName;

  // V2 스타일에서 V3 스타일로의 매핑을 찾습니다
  // find 대신 filter를 사용하여 일치하는 모든 매핑을 찾습니다
  const mappings = typographyMappings.filter((mapping) => {
    const semanticName = mapping.previous.split(".").pop() ?? "";

    // 정확한 매칭을 위해 여러 방식으로 비교
    return changeCase.kebabCase(semanticName) === changeCase.kebabCase(v2Name);
  });

  if (mappings.length === 0) return [];

  // 모든 매핑에서 nextStyles 수집
  const allNextStyles = mappings.flatMap((mapping) => {
    // deprecated된 스타일이고 대체 스타일이 있는 경우
    return mapping.next.length > 0 ? mapping.next : mapping.alternative || [];
  });
  // 중복 제거
  const uniqueNextStyles = Array.from(new Set(allNextStyles));

  if (uniqueNextStyles.length === 0) return [];

  const suggestions = await Promise.all(
    uniqueNextStyles.map((nextStyleName) => {
      // nextStyleName을 kebab-case로 변환 (예: t1Bold -> t1-bold)
      const kebabNextStyleName = `scale/${changeCase.kebabCase(nextStyleName)}`;

      const matchedStyle = availableTextStyles.find((style) => style.name === kebabNextStyleName);

      if (!matchedStyle) {
        return null;
      }

      return {
        distance: 0, // 매핑 테이블에 있는 경우 완벽한 매칭으로 간주
        textStyle: matchedStyle,
        differences: {
          fontSize: 0,
          fontWeight: 0,
          lineHeight: 0,
        },
      };
    }),
  );

  return suggestions.filter(
    (suggestion): suggestion is NonNullable<typeof suggestion> => suggestion !== null,
  );
}

function getTextStyleDifferences(textStyle: TextStyle, textNode: TextNode) {
  const { fontSize, fontWeight, lineHeight } = textNode;

  // textStyle의 속성들은 mode가 달라져도 기본 mode(V3 Typo에서 iOS)의 값으로 나온다.
  // (모드별 값을 알고 싶으면 boundVariables 참고 필요)
  // 따라서, iOS 기준으로 그려진 대상 화면 - iOS 기준 textStyle 속성 값을 바로 비교 가능.
  const {
    fontSize: styleFontSize,
    lineHeight: styleLineHeight,
    fontName: { style: styleFontStyle },
  } = textStyle;

  const styleFontWeight = getFontWeight(styleFontStyle);

  if (!styleFontWeight) return null;

  return getTextPropertyDifferences(
    { fontSize: styleFontSize, fontWeight: styleFontWeight, lineHeight: styleLineHeight },
    { fontSize, fontWeight, lineHeight },
  );
}

function getClosestTextStyle(availableTextStyles: TextStyle[], textNode: TextNode) {
  return availableTextStyles
    .map((textStyle) => {
      const differences = getTextStyleDifferences(textStyle, textNode);

      if (!differences) return null;

      if (
        differences.fontSize === null ||
        differences.fontWeight === null ||
        differences.lineHeight === null
      )
        return null;

      // o: 정확히 일치하는 경우
      if (
        differences.fontSize === 0 &&
        differences.fontWeight === 0 &&
        differences.lineHeight === 0
      )
        return { distance: 0, textStyle, differences };

      // o: fontSize와 fontWeight가 일치하는 경우
      if (differences.fontSize === 0 && differences.fontWeight === 0)
        return { distance: 1, textStyle, differences };

      // o: fontSize가 1px 차이나고 lineHeight가 0인 경우
      if (differences.fontSize === 1 && differences.fontWeight === 0) {
        return { distance: 1, textStyle, differences };
      }

      return null;
    })
    .filter((suggestion) => suggestion !== null)
    .sort((a, b) => {
      if (a.distance === b.distance)
        return Math.abs(a.differences.lineHeight ?? 0) - Math.abs(b.differences.lineHeight ?? 0);

      return a.distance - b.distance;
    });
}
