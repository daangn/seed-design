import type { PairSyncCheck } from "../types";
import { kebabToPascal } from "../utils/naming";

export const headlessReactCheck: PairSyncCheck = {
  kind: "pair",
  id: "headless-react",
  name: "Headless → React 컴포넌트",
  source: {
    pattern: /^packages\/react-headless\/([^/]+)\/src\//,
    exclude: ["primitive", "supports", "use-controllable-state", "portal"],
  },
  targets: [
    {
      id: "styled",
      name: "Styled 컴포넌트",
      path: (name) => `packages/react/src/components/${kebabToPascal(name)}/`,
      severity: "warning",
      message: "headless 변경 시 styled 컴포넌트 확인 필요",
    },
  ],
};
