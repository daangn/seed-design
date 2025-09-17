import type { Registry } from "./schema";

export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "app-screen",
      files: [{ path: "app-screen.tsx" }, { path: "app-bar.tsx" }],
    },
    {
      id: "error-state",
      files: [{ path: "error-state.tsx" }],
    },
    {
      id: "manner-temp",
      files: [{ path: "manner-temp.tsx" }],
    },
    {
      id: "manner-temp-badge",
      files: [{ path: "manner-temp-badge.tsx" }],
    },
    {
      id: "alert-dialog",
      files: [{ path: "alert-dialog.tsx" }],
    },
    {
      id: "bottom-sheet",
      files: [{ path: "bottom-sheet.tsx" }],
    },
    {
      id: "action-sheet",
      files: [{ path: "action-sheet.tsx" }],
      deprecated: true,
    },
    {
      id: "extended-action-sheet",
      files: [{ path: "extended-action-sheet.tsx" }],
      deprecated: true,
    },
    {
      id: "avatar",
      files: [{ path: "avatar.tsx" }],
    },
    {
      id: "pull-to-refresh",
      files: [{ path: "pull-to-refresh.tsx" }],
    },
    {
      id: "loading-indicator",
      files: [{ path: "loading-indicator.tsx" }],
    },
    {
      id: "action-button",
      files: [{ path: "action-button.tsx" }],
    },
    {
      id: "toggle-button",
      files: [{ path: "toggle-button.tsx" }],
    },
    {
      id: "reaction-button",
      files: [{ path: "reaction-button.tsx" }],
    },
    {
      id: "callout",
      files: [{ path: "callout.tsx" }],
    },
    {
      id: "control-chip",
      files: [{ path: "control-chip.tsx" }],
      deprecated: true,
    },
    {
      id: "chip",
      files: [{ path: "chip.tsx" }],
    },
    {
      id: "checkbox",
      files: [{ path: "checkbox.tsx" }],
    },
    {
      id: "identity-placeholder",
      files: [{ path: "identity-placeholder.tsx" }],
    },
    {
      id: "inline-banner",
      files: [{ path: "inline-banner.tsx" }],
      deprecated: true,
    },
    {
      id: "menu-sheet",
      files: [{ path: "menu-sheet.tsx" }],
    },
    {
      id: "snackbar",
      files: [{ path: "snackbar.tsx" }],
    },
    {
      id: "help-bubble",
      files: [{ path: "help-bubble.tsx" }],
    },
    {
      id: "tabs",
      files: [{ path: "tabs.tsx" }],
    },
    {
      id: "chip-tabs",
      files: [{ path: "chip-tabs.tsx" }],
    },
    {
      id: "page-banner",
      files: [{ path: "page-banner.tsx" }],
    },
    {
      id: "progress-circle",
      files: [{ path: "progress-circle.tsx" }],
    },
    {
      id: "radio-group",
      files: [{ path: "radio-group.tsx" }],
    },
    {
      id: "select-box",
      files: [{ path: "select-box.tsx" }],
    },
    {
      id: "segmented-control",
      files: [{ path: "segmented-control.tsx" }],
    },
    {
      id: "switch",
      files: [{ path: "switch.tsx" }],
    },
    {
      id: "text-field",
      files: [{ path: "text-field.tsx" }],
    },
    {
      id: "contextual-floating-button",
      files: [{ path: "contextual-floating-button.tsx" }],
    },
    {
      id: "floating-action-button",
      files: [{ path: "floating-action-button.tsx" }],
    },
    {
      id: "list",
      files: [{ path: "list.tsx" }],
    },
  ],
};
