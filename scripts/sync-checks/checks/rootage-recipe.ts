import type { PairSyncCheck } from "../types";

export const rootageRecipeCheck: PairSyncCheck = {
  kind: "pair",
  id: "rootage-recipe",
  name: "Rootage Spec → Recipe",
  onlyWhenTargetExists: true,
  source: {
    pattern: /^packages\/rootage\/components\/([^.]+)\.yaml$/,
  },
  targets: [
    {
      id: "recipe",
      name: "CSS Recipe",
      path: (name) => `packages/qvism-preset/src/recipes/${name}.ts`,
      severity: "warning",
      message: "rootage 스펙 변경 시 recipe 확인 필요",
    },
  ],
};
