import * as v3TextStyles from "@/features/design-system/data/__generated__/v3-styles";
import * as v2TextStyles from "@/features/design-system/data/__generated__/v2-styles";
import { typographyMappings } from "@seed-design/migration-index/typography";
import type {
  SerializedTextStyleSuggestionsResults,
  GroupedSerializedTextStyleSuggestionsResults,
} from "@/features/design-system/types";
import {
  getAllTextNodesInSceneNodes,
  getClosestInstanceNode,
  isNodeWithinSystemComponents,
  serializeInstanceNode,
  serializeTextNode,
} from "@/features/design-system/utils/nodes";
import { serializeTextStyle } from "@/features/design-system/utils/styles";
import {
  getFontWeight,
  getFontWeightLabel,
  getLineHeightUnitString,
  getTextPropertyDifferences,
} from "@/features/design-system/utils/text-node-properties";
import * as changeCase from "change-case";

const v3TextStyleKeys = Object.values(v3TextStyles).map(({ key }) => key);

export async function getSerializedTextStyleSuggestions({
  nodeIds,
  systemComponentKeys,
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

    // library 추가되어있지 않아도 텍스트 스타일 import는 가능함.
    if (textStyles.length === 0) {
      throw new Error(
        "텍스트 스타일을 찾을 수 없습니다. 최신 버전의 라이브러리가 추가되었는지 확인해주세요.",
      );
    }
  } catch {
    throw new Error(
      "텍스트 스타일을 찾을 수 없습니다. 최신 버전의 라이브러리가 추가되었는지 확인해주세요.",
    );
  }

  const results = [];

  for await (const textNode of textNodesInTarget) {
    if (await isNodeWithinSystemComponents({ node: textNode, systemComponentKeys })) continue;

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
  // 현재 노드의 스타일 키를 가져옵니다
  const currentStyleId = textNode.getStyledTextSegments(["textStyleId"])[0]?.textStyleId;

  if (!currentStyleId) return [];

  const currentStyle = Object.values(v2TextStyles).find((style) => style.key === currentStyleId);
  if (!currentStyle) return [];

  // v2 스타일 이름에서 플랫폼 정보를 제거하고 실제 스타일 이름만 추출
  const [, ...styleParts] = currentStyle.name.split("/");
  const v2StyleName = styleParts.join("/");

  // V2 스타일에서 V3 스타일로의 매핑을 찾습니다
  const mapping = typographyMappings.find((mapping) => {
    const semanticName = mapping.previous.split(".").pop() ?? "";
    return changeCase.kebabCase(semanticName) === v2StyleName;
  });

  if (!mapping) return [];

  // deprecated된 스타일이고 대체 스타일이 있는 경우
  const nextStyles = mapping.next.length > 0 ? mapping.next : mapping.alternative || [];

  if (nextStyles.length === 0) return [];

  const suggestions = await Promise.all(
    nextStyles.map(async (nextStyleName) => {
      // nextStyleName을 kebab-case로 변환 (예: t1Bold -> t1-bold)
      const kebabNextStyleName = `scale/${changeCase.kebabCase(nextStyleName)}`;

      const matchedStyle = availableTextStyles.find((style) => style.name === kebabNextStyleName);

      if (!matchedStyle) return null;

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
