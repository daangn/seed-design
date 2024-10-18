import { setRelaunchButton } from "@create-figma-plugin/utilities";
import { drawVariableTables } from "draw-variable-tables.mjs";
import { createVariableTables } from "create-variable-tables.mjs";
import { getSwatches } from "get-swatches.mjs";

setRelaunchButton(figma.root, "add", { description: "페이지에 Variable 프리뷰 프레임을 추가해요" });

// const mainFrame = isFirstSelectionMainFrame ? (firstSelection as FrameNode) : createMainFrame();
// if (isFirstSelectionMainFrame) for (const child of mainFrame.children) child.remove();

figma.variables.getLocalVariableCollectionsAsync().then(async (variableCollections) => {
  if (variableCollections.length === 0) {
    figma.notify("보여줄 수 있는 variable collection이 없어요.", { error: true });
    figma.closePlugin();
  }

  const swatches = getSwatches({
    inputFrameNames: {
      default: "Input",
      dark: "Input-darkmode",
    },
  });

  const framesToDraw = await createVariableTables({
    variableCollections,
    swatches,
    collectionNamesToInclude: ["Color"],
  });

  await drawVariableTables({ framesToDraw, possibleSuffixes: ["-pressed"] });

  // figma.currentPage.selection = [mainFrame];
  // figma.viewport.scrollAndZoomIntoView([mainFrame]);

  figma.notify("생성 완료!");

  figma.closePlugin();
});
