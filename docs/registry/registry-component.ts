import type { RegistryComponent } from "./schema";

export const registryComponent: RegistryComponent = [
  {
    name: "alert-dialog",
    innerDependencies: ["action-button"],
    files: ["component/alert-dialog.tsx"],
  },
  {
    name: "action-button",
    dependencies: ["@radix-ui/react-slot"],
    files: ["component/action-button.tsx"],
  },
  {
    name: "action-chip",
    dependencies: ["@radix-ui/react-slot"],
    files: ["component/action-chip.tsx"],
  },
  {
    name: "badge",
    dependencies: ["@radix-ui/react-slot"],
    files: ["component/badge.tsx"],
  },
  {
    name: "control-chip",
    dependencies: ["@radix-ui/react-slot"],
    files: ["component/control-chip.tsx"],
  },
  {
    name: "checkbox",
    dependencies: ["@seed-design/react-checkbox"],
    files: ["component/checkbox.tsx"],
  },
  {
    name: "tabs",
    dependencies: ["@seed-design/react-tabs"],
    files: ["component/tabs.tsx"],
  },
  {
    name: "chip-tabs",
    dependencies: ["@seed-design/react-tabs"],
    files: ["component/chip-tabs.tsx"],
  },
  {
    name: "expand-button",
    dependencies: ["@radix-ui/react-slot"],
    files: ["component/expand-button.tsx"],
  },
  {
    name: "switch",
    dependencies: ["@seed-design/react-switch"],
    files: ["component/switch.tsx"],
  },
];
