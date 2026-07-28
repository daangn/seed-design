import type { SeedDoctorKnowledge } from "../../knowledge/types";

/** 실제 rootage/registry 데이터에서 발췌한 테스트용 지식 (네트워크 없음) */
export const FIXTURE_KNOWLEDGE: SeedDoctorKnowledge = {
  components: [
    { id: "action-button", name: "Action Button" },
    { id: "bottom-sheet", name: "Bottom Sheet" },
    { id: "floating-action-button", name: "Floating Action Button" },
    { id: "fab", name: "Fab" },
  ],
  deprecatedComponents: [
    { id: "fab", name: "Fab", message: "Use contextual-floating-button instead." },
    { id: "action-sheet", name: "Action Sheet", message: "Use menu-sheet instead." },
    {
      id: "action-sheet-item",
      name: "Action Sheet Item",
      message: "Use menu-sheet-item instead.",
    },
  ],
  deprecatedSnippetItems: [
    {
      registryId: "ui",
      itemId: "action-sheet",
      snippetPaths: ["action-sheet.tsx", "action-sheet.jsx"],
      message: "Use menu-sheet instead.",
    },
    {
      registryId: "ui",
      itemId: "error-state",
      snippetPaths: ["error-state.tsx", "error-state.jsx"],
    },
  ],
  snippetItems: [
    {
      registryId: "ui",
      itemId: "action-button",
      snippetPaths: ["action-button.tsx", "action-button.jsx"],
      requires: { "@seed-design/react": "^2.0.0", "@seed-design/css": "^2.0.0" },
    },
    {
      registryId: "ui",
      itemId: "action-sheet",
      snippetPaths: ["action-sheet.tsx", "action-sheet.jsx"],
      requires: { "@seed-design/react": "^2.0.0", "@seed-design/css": "^2.0.0" },
    },
  ],
  componentVariantSpecs: [
    {
      id: "action-button",
      name: "Action Button",
      variants: {
        variant: [
          "brandSolid",
          "neutralSolid",
          "neutralWeak",
          "criticalSolid",
          "neutralOutline",
          "brandOutline",
          "ghost",
        ],
        size: ["xsmall", "small", "medium", "large"],
        layout: ["withText", "iconOnly"],
      },
    },
  ],
};
