import { COMBINATION_INPUT_FRAME_NAMES, MAIN_FRAME_RELAUNCH_DATA, SUFFIXES } from "./constants";
import { createMainFrame, writeVariables } from "./utils";

const firstSelection = figma.currentPage.selection[0];

const isFirstSelectionMainFrame =
  firstSelection &&
  firstSelection.type === "FRAME" &&
  firstSelection.getRelaunchData()?.update === MAIN_FRAME_RELAUNCH_DATA.UPDATE;

const mainFrame = isFirstSelectionMainFrame ? (firstSelection as FrameNode) : createMainFrame();
if (isFirstSelectionMainFrame) for (const child of mainFrame.children) child.remove();

const variableCollections = figma.variables.getLocalVariableCollections();

if (variableCollections.length === 0) {
  figma.notify("보여줄 수 있는 variable collection이 없어요.", { error: true });
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
