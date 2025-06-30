import { DEFAULT_PREFERENCES, SETTINGS_KEY } from "../shared/constants";
import { events } from "../shared/event";
import type { FigmaMetadata } from "../shared/types";
import { loadSettingsAsync } from "../shared/utils/setting";
import { SYSTEM_COMPONENT_KEYS_ALL, SYSTEM_COMPONENT_KEYS_V3_ONLY } from "./data/component";
import { applyColorVariable } from "./services/apply-color-variable";
import { applyTextStyles } from "./services/apply-text-style";
import { getColorVariableSuggestions } from "./services/get-color-variable-suggestions";
import { getComponentInSelection } from "./services/get-component-in-selection";
import { getSelectedComponentInfo } from "./services/get-selected-info";
import { getSerializedTextStyleSuggestions } from "./services/get-text-style-suggestions";
import { swapComponent } from "./services/swap-component";

// 플러그인 UI 크기 설정
figma.showUI(__html__, {
  width: 460,
  height: 640,
});

/**
 * BaseNode를 직렬화하는 함수
 * UI에서 사용할 수 있는 형태로 데이터를 변환합니다.
 */
function serializeBaseNode(node: BaseNode) {
  const baseData = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  // TextNode인 경우 characters 추가
  if (node.type === "TEXT") {
    return {
      ...baseData,
      characters: (node as TextNode).characters,
    };
  }

  return baseData;
}

// Figma 메타데이터 가져오기
function getFigmaMetadata(): FigmaMetadata {
  return {
    currentUser: {
      id: figma.currentUser?.id || "",
      name: figma.currentUser?.name || "",
    },
    currentPage: {
      id: figma.currentPage.id,
      name: figma.currentPage.name,
    },
    currentRoot: {
      name: figma.root.name,
    },
    fileKey: figma.fileKey || "",
  };
}

// 메인 로직
async function main() {
  figma.skipInvisibleInstanceChildren = true;

  const currentPreferences = await loadSettingsAsync(DEFAULT_PREFERENCES, SETTINGS_KEY);

  // Figma 메타데이터 전송
  events("send-figma-metadata").emit(getFigmaMetadata());

  // 선택 변경 이벤트 리스너
  figma.on("selectionchange", () => {
    const currentSelections = [...figma.currentPage.selection];

    events("announce-selection").emit({
      serializedSelections: currentSelections.map(serializeBaseNode),
    });
  });

  events("request-component-suggestions").on(async () => {
    const targetIds = [...figma.currentPage.selection].map(({ id }) => id);

    events("announce-target").emit({
      serializedTargets: [...figma.currentPage.selection].map(serializeBaseNode),
    });

    const results = await getComponentInSelection({ nodeIds: targetIds });

    events("suggest-components").emit({ results });
    figma.notify("컴포넌트 검사가 완료되었습니다.", {
      timeout: 1000,
    });
  });

  // 현재 선택 및 타겟 노드 정보 전송
  events("announce-selection").emit({
    serializedSelections: [...figma.currentPage.selection].map(serializeBaseNode),
  });

  events("announce-target").emit({
    serializedTargets: [...figma.currentPage.selection].map(serializeBaseNode),
  });

  // 노드 포커스 이벤트 처리
  events("focus-node").on(async ({ nodeIds }) => {
    const nodes = (
      await Promise.all(nodeIds.map((nodeId) => figma.getNodeByIdAsync(nodeId)))
    ).filter(
      (node) => node !== null && node.type !== "DOCUMENT" && node.type !== "PAGE",
    ) as SceneNode[];

    if (nodes.length > 0) {
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    }
  });

  // 타겟 노드 업데이트 요청 처리
  events("request-announce-target").on(async ({ nodeIds }) => {
    const nodes = (
      await Promise.all(nodeIds.map((nodeId) => figma.getNodeByIdAsync(nodeId)))
    ).filter(
      (node) => node !== null && node.type !== "DOCUMENT" && node.type !== "PAGE",
    ) as SceneNode[];

    events("announce-target").emit({
      serializedTargets: nodes.map(serializeBaseNode),
    });
  });

  // 텍스트 스타일 제안 요청 처리
  events("request-text-style-suggestions").on(async () => {
    const targetIds = [...figma.currentPage.selection].map(({ id }) => id);

    events("announce-target").emit({
      serializedTargets: [...figma.currentPage.selection].map(serializeBaseNode),
    });

    try {
      const results = await getSerializedTextStyleSuggestions({
        nodeIds: targetIds,
        systemComponentKeys: [],
      });

      events("suggest-text-styles").emit({ results });
      figma.notify("타이포그래피 검사가 완료되었습니다.", {
        timeout: 1000,
      });
    } catch (error) {
      console.error("텍스트 스타일 제안 요청 처리 중 오류:", error);
    }
  });

  // 텍스트 스타일 적용 처리
  events("apply-text-style").on(async ({ textNodeIds, textStyleId }) => {
    await applyTextStyles(textNodeIds, textStyleId);
    figma.notify("텍스트 스타일이 적용되었습니다.", {
      timeout: 1000,
    });
    figma.commitUndo();
  });

  // 컬러 제안 요청 처리
  events("request-color-suggestions").on(async ({ nodeIds }) => {
    const targetIds = nodeIds || [...figma.currentPage.selection].map(({ id }) => id);

    try {
      const results = await getColorVariableSuggestions({
        nodeIds: targetIds,
        systemComponentKeys:
          currentPreferences["inspect-v2-components-on-color-migration"] === true
            ? SYSTEM_COMPONENT_KEYS_V3_ONLY
            : SYSTEM_COMPONENT_KEYS_ALL,
      });

      events("suggest-color-variables").emit({ results });
      events("announce-target").emit({
        serializedTargets: [...figma.currentPage.selection].map(serializeBaseNode),
      });
      figma.notify("컬러 변수 검사가 완료되었습니다.", {
        timeout: 1000,
      });
    } catch (error) {
      console.error("컬러 제안 요청 처리 중 오류:", error);
    }
  });

  // 컬러 변수 적용 처리
  events("apply-color-variable").on(async ({ oldValue, consumerNodeIds, variableId }) => {
    await applyColorVariable({ oldValue, consumerNodeIds, variableId });
    figma.notify("컬러 변수가 적용되었습니다.", {
      timeout: 1000,
    });
    figma.commitUndo();
  });

  events("swap-component").on(async ({ instanceNode, selectedVariants }) => {
    const results = await swapComponent(instanceNode, selectedVariants);
    events("swap-result").emit({ results });
    figma.notify("컴포넌트 교체가 완료되었습니다.", {
      timeout: 1000,
    });
  });

  events("swap-all-components").on(async ({ instanceNodes, selectedVariants }) => {
    const results = await Promise.all(
      instanceNodes.map((instanceNode) => swapComponent(instanceNode, selectedVariants)),
    );
    const swapResult = Object.assign({}, ...results);
    events("swap-result").emit({ results: swapResult });
    figma.notify("컴포넌트 교체가 완료되었습니다.", {
      timeout: 1000,
    });
  });

  events("get-selected-info").on(async () => {
    const selectedInfo = await getSelectedComponentInfo();
    console.log(selectedInfo);
  });
}

// 메인 함수 실행
main().catch((error) => {
  console.error("플러그인 실행 중 오류:", error);
});
