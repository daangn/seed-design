import type { ComponentMetadatas } from "../schemas/component";

export const componentMetadatas: ComponentMetadatas = [
  {
    name: "box-button",
    type: "component",
    dependencies: ["@radix-ui/react-slot"],
    snippets: ["box-button.tsx"],
  },
  {
    name: "alert-dialog",
    type: "component",
    dependencies: ["@radix-ui/react-slot"],
    innerDependencies: ["box-button"],
    snippets: ["alert-dialog.tsx"],
  },
];
