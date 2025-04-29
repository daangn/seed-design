import { Box } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import { useState } from "react";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { ActionButton } from "../seed-design/ui/action-button";

const ITER = 5000;

const ManyBoxes = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {Array.from({ length: ITER }).map((_, i) => (
        <Box key={i} width="50px" height="50px" bg="bg.brandSolid" />
      ))}
    </div>
  );
};

const MyDiv = () => {
  return <div style={{ width: "50px", height: "50px", backgroundColor: "red" }} />;
};

const ManyDivs = () => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {Array.from({ length: ITER }).map((_, i) => (
        <MyDiv key={i} />
      ))}
    </div>
  );
};

const MyUtilityDiv = () => {
  return <div className="w-50px h-50px bg-brandSolid" />;
};

const ManyUtilityClasses = () => {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: ITER }).map((_, i) => (
        <MyUtilityDiv key={i} />
      ))}
    </div>
  );
};

export function PerfTest() {
  const [mode, setMode] = useState<undefined | "box" | "div" | "utility">(undefined);

  return (
    <div>
      <ActionButton onClick={() => setMode(undefined)}>Reset</ActionButton>
      <ActionButton onClick={() => setMode("box")}>Box</ActionButton>
      <ActionButton onClick={() => setMode("div")}>Div</ActionButton>
      <ActionButton onClick={() => setMode("utility")}>Utility</ActionButton>
      {mode === "box" && <ManyBoxes />}
      {mode === "div" && <ManyDivs />}
      {mode === "utility" && <ManyUtilityClasses />}
    </div>
  );
}

const ActivityPerfCheck: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Performance Check</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <PerfTest />
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPerfCheck;
