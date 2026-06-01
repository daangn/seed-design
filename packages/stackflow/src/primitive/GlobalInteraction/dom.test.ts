import { describe, expect, it } from "bun:test";
import { appBarAnatomy } from "../AppBar/anatomy";
import { appScreenAnatomy } from "../AppScreen/anatomy";
import {
  findTransitionTargets,
  setIntermediateExitPositions,
  setPostExitPositions,
} from "./dom";

function appendPart(root: HTMLElement, part: string) {
  const el = document.createElement("div");
  el.dataset["part"] = part;
  root.append(el);
  return el;
}

function createActivity({
  id,
  isActive,
  isTop,
}: {
  id: string;
  isActive?: boolean;
  isTop?: boolean;
}) {
  const activity = document.createElement("section");
  activity.dataset["part"] = appScreenAnatomy.activity;
  activity.dataset["activityId"] = id;

  if (isActive) {
    activity.dataset["activityIsActive"] = "";
  }
  if (isTop) {
    activity.dataset["activityIsTop"] = "";
  }

  const layer = appendPart(activity, appScreenAnatomy.layer);
  const dim = appendPart(activity, appScreenAnatomy.dim);
  const title = appendPart(activity, appBarAnatomy.main);
  const icon = appendPart(activity, appBarAnatomy.icon);
  const appBarRoot = appendPart(activity, appBarAnatomy.root);
  const appBarBackground = appendPart(activity, appBarAnatomy.background);

  return {
    activity,
    layer,
    dim,
    title,
    icon,
    appBarRoot,
    appBarBackground,
  };
}

function createStack() {
  const stack = document.createElement("div");
  const root = createActivity({ id: "root", isActive: true });
  const middleExit = createActivity({ id: "middle-exit" });
  const topExit = createActivity({ id: "top-exit", isTop: true });

  stack.append(root.activity, middleExit.activity, topExit.activity);

  return {
    stack,
    root,
    middleExit,
    topExit,
  };
}

describe("findTransitionTargets", () => {
  it("uses the immediate previous activity as behind target by default", () => {
    const { stack, middleExit } = createStack();

    const targets = findTransitionTargets(stack);

    expect(targets.behindLayer).toBe(middleExit.layer);
    expect(targets.intermediateLayers).toEqual([]);
  });

  it("uses the active activity as behind target for pop transitions", () => {
    const { stack, root, middleExit } = createStack();

    const targets = findTransitionTargets(stack, { direction: "pop" });

    expect(targets.behindLayer).toBe(root.layer);
    expect(targets.intermediateLayers).toEqual([middleExit.layer]);
  });
});

describe("setIntermediateExitPositions", () => {
  it("hides intermediate exiting activities without touching the active behind activity", () => {
    const { stack, root, middleExit } = createStack();
    const targets = findTransitionTargets(stack, { direction: "pop" });

    setIntermediateExitPositions(targets, "slideFromRightIOS");

    expect(root.layer.style.transform).toBe("");
    expect(middleExit.layer.style.transform).toBe("translate3d(100%, 0, 0)");
    expect(middleExit.dim.style.opacity).toBe("0");
    expect(middleExit.appBarRoot.style.opacity).toBe("0");
  });
});

describe("setPostExitPositions", () => {
  it("clears stale active behind styles and keeps intermediate exiting activities hidden", () => {
    const { stack, root, middleExit, topExit } = createStack();
    const targets = findTransitionTargets(stack, { direction: "pop" });

    root.layer.style.transform = "translate3d(-30%, 0, 0)";
    middleExit.layer.style.transform = "translate3d(-30%, 0, 0)";

    setPostExitPositions(targets, "slideFromRightIOS");

    expect(root.layer.style.transform).toBe("");
    expect(middleExit.layer.style.transform).toBe("translate3d(100%, 0, 0)");
    expect(middleExit.appBarRoot.style.opacity).toBe("0");
    expect(topExit.layer.style.transform).toBe("translate3d(100%, 0, 0)");
  });
});
