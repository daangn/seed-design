import type { Registry } from "./schema";

export const registryUI: Registry = {
  name: "ui",
  items: [
    {
      name: "app-screen",
      files: [{ path: "app-screen.tsx" }, { path: "app-bar.tsx" }],
    },
    {
      name: "error-state",
      files: [{ path: "error-state.tsx" }],
    },
    {
      name: "manner-temp",
      files: [{ path: "manner-temp.tsx" }],
    },
    {
      name: "manner-temp-badge",
      files: [{ path: "manner-temp-badge.tsx" }],
    },
    {
      name: "alert-dialog",
      files: [{ path: "alert-dialog.tsx" }],
    },
    {
      name: "bottom-sheet",
      files: [{ path: "bottom-sheet.tsx" }],
    },
    {
      name: "action-sheet",
      files: [{ path: "action-sheet.tsx" }],
      deprecated: true,
    },
    {
      name: "extended-action-sheet",
      files: [{ path: "extended-action-sheet.tsx" }],
      deprecated: true,
    },
    {
      name: "avatar",
      files: [{ path: "avatar.tsx" }],
    },
    {
      name: "pull-to-refresh",
      files: [{ path: "pull-to-refresh.tsx" }],
    },
    {
      name: "loading-indicator",
      files: [{ path: "loading-indicator.tsx" }],
    },
    {
      name: "action-button",
      files: [{ path: "action-button.tsx" }],
    },
    {
      name: "toggle-button",
      files: [{ path: "toggle-button.tsx" }],
    },
    {
      name: "reaction-button",
      files: [{ path: "reaction-button.tsx" }],
    },
    {
      name: "callout",
      files: [{ path: "callout.tsx" }],
    },
    {
      name: "control-chip",
      files: [{ path: "control-chip.tsx" }],
      deprecated: true,
    },
    {
      name: "chip",
      files: [{ path: "chip.tsx" }],
    },
    {
      name: "checkbox",
      files: [{ path: "checkbox.tsx" }],
    },
    {
      name: "identity-placeholder",
      files: [{ path: "identity-placeholder.tsx" }],
    },
    {
      name: "inline-banner",
      files: [{ path: "inline-banner.tsx" }],
      deprecated: true,
    },
    {
      name: "menu-sheet",
      files: [{ path: "menu-sheet.tsx" }],
    },
    {
      name: "snackbar",
      files: [{ path: "snackbar.tsx" }],
    },
    {
      name: "help-bubble",
      files: [{ path: "help-bubble.tsx" }],
    },
    {
      name: "tabs",
      files: [{ path: "tabs.tsx" }],
    },
    {
      name: "chip-tabs",
      files: [{ path: "chip-tabs.tsx" }],
    },
    {
      name: "page-banner",
      files: [{ path: "page-banner.tsx" }],
    },
    {
      name: "progress-circle",
      files: [{ path: "progress-circle.tsx" }],
    },
    {
      name: "radio-group",
      files: [{ path: "radio-group.tsx" }],
    },
    {
      name: "select-box",
      files: [{ path: "select-box.tsx" }],
    },
    {
      name: "segmented-control",
      files: [{ path: "segmented-control.tsx" }],
    },
    {
      name: "switch",
      files: [{ path: "switch.tsx" }],
    },
    {
      name: "text-field",
      files: [{ path: "text-field.tsx" }],
    },
    {
      name: "contextual-floating-button",
      files: [{ path: "contextual-floating-button.tsx" }],
    },
    {
      name: "floating-action-button",
      files: [{ path: "floating-action-button.tsx" }],
    },
    {
      name: "list",
      files: [{ path: "list.tsx" }],
    },
  ],
};
