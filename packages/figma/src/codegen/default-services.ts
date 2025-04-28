import {
  createIconService,
  createStyleService,
  createVariableService,
  iconRepository,
  styleRepository,
  variableRepository,
} from "@/entities";

export const styleService = createStyleService({
  styleRepository,
});
export const variableService = createVariableService({
  variableRepository,
  inferCompareFunction: (a, b) => {
    const scoreFn = (name: string) => {
      let score = 0;
      if (name.includes("bg")) {
        score += 100;
      }
      if (name.includes("fg")) {
        score += 100;
      }
      if (name.includes("stroke")) {
        score += 100;
      }
      if (name.includes("spacing-x")) {
        score -= 100;
      }
      if (name.includes("spacing-y")) {
        score -= 100;
      }
      if (name.endsWith("pressed")) {
        score -= 100;
      }
      return score;
    };

    return scoreFn(b.name) - scoreFn(a.name);
  },
});
export const iconService = createIconService({
  iconRepository,
});
