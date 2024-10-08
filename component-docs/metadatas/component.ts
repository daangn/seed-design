import type { ComponentMetadataSchema } from "../schemas/component";

export const componentMetadatas: ComponentMetadataSchema[] = [
  {
    name: "alert-dialog",
    type: "component",
    innerDependencies: ["action-button"],
    snippets: ["component/alert-dialog.tsx"],
  },
  {
    name: "action-button",
    type: "component",
    dependencies: ["@radix-ui/react-slot"],
    snippets: ["component/action-button.tsx"],
  },
  {
    name: "checkbox",
    type: "component",
    dependencies: ["@seed-design/react-checkbox"],
    snippets: ["component/checkbox.tsx"],
  },
  {
    name: "tabs",
    type: "component",
    dependencies: ["@seed-design/react-tabs"],
    snippets: ["component/tabs.tsx"],
  },
  {
    name: "chip-tabs",
    type: "component",
    dependencies: ["@seed-design/react-tabs"],
    snippets: ["component/chip-tabs.tsx"],
  },
  {
    name: "expand-button",
    type: "component",
    dependencies: ["@radix-ui/react-slot"],
    snippets: ["component/expand-button.tsx"],
  },
  {
    name: "switch",
    type: "component",
    dependencies: ["@seed-design/react-switch"],
    snippets: ["component/switch.tsx"],
  },
];
