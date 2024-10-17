import { setRelaunchButton } from "@create-figma-plugin/utilities";
import { COMBINATION_INPUT_FRAME_NAMES, RELAUNCH_DATA_MESSAGES, SUFFIXES } from "./constants.mjs";
import { createMainFrame } from "./node.mjs";
import { writeVariables } from "./utils.mjs";

setRelaunchButton(figma.root, "add", {
  description: "페이지에 Variable 프리뷰 프레임을 추가해요",
});

const firstSelection = figma.currentPage.selection[0];

const isFirstSelectionMainFrame =
  firstSelection &&
  firstSelection.type === "FRAME" &&
  firstSelection.getRelaunchData()?.update === RELAUNCH_DATA_MESSAGES.UPDATE;

const mainFrame = isFirstSelectionMainFrame ? (firstSelection as FrameNode) : createMainFrame();
if (isFirstSelectionMainFrame) for (const child of mainFrame.children) child.remove();

figma.variables.getLocalVariableCollectionsAsync().then((variableCollections) => {
  if (variableCollections.length === 0) {
    figma.notify("보여줄 수 있는 variable collection이 없어요.", {
      error: true,
    });
    figma.closePlugin();
  }

  writeVariables({
    mainFrame,
    variableCollections,
    combinationFrameNames: {
      default: COMBINATION_INPUT_FRAME_NAMES.DEFAULT,
      dark: COMBINATION_INPUT_FRAME_NAMES.DARK,
    },
    possibleSuffixes: SUFFIXES,
  }).then(() => {
    figma.currentPage.selection = [mainFrame];
    figma.viewport.scrollAndZoomIntoView([mainFrame]);

    figma.notify("생성 완료!");

    figma.closePlugin();
  });
});
