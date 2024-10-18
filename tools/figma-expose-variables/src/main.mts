import { setRelaunchButton } from "@create-figma-plugin/utilities";
import { drawVariableTables } from "draw-variable-tables.mjs";
import { createVariableTables } from "create-variable-tables.mjs";
import { getSwatches } from "get-swatches.mjs";
import { drawVariableTablesContainer } from "draw-layer.mjs";
import { isSceneNodeVariableTablesContainer } from "utils.mjs";

setRelaunchButton(figma.root, "add", { description: "페이지에 Variable 프리뷰 프레임을 추가해요" });

const firstSelection = figma.currentPage.selection[0];

const isFirstSelectionVariableTablesContainer =
  firstSelection && isSceneNodeVariableTablesContainer(firstSelection);

const variableTablesContainer = isFirstSelectionVariableTablesContainer
  ? firstSelection
  : drawVariableTablesContainer();

if (isFirstSelectionVariableTablesContainer)
  for (const child of variableTablesContainer.children) child.remove();

const swatches = getSwatches({
  inputFrameNames: {
    default: "Input",
    dark: "Input-darkmode",
  },
});

figma.variables.getLocalVariableCollectionsAsync().then(async (variableCollections) => {
  if (variableCollections.length === 0) {
    figma.notify("보여줄 수 있는 variable collection이 없어요.", { error: true });
    figma.closePlugin();
  }

  const variableTables = await createVariableTables({
    variableCollections,
    swatches,
    collectionNamesToInclude: ["Color"],
  });

  await drawVariableTables(
    {
      variableTables,
      possibleSuffixes: ["-pressed"],
    },
    variableTablesContainer,
  );

  figma.currentPage.selection = [variableTablesContainer];
  figma.viewport.scrollAndZoomIntoView([variableTablesContainer]);

  figma.notify("생성 완료!");
  figma.closePlugin();
});
