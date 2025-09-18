import type { Registry } from "./schema";

export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "app-screen",
      snippets: [{ path: "app-screen.tsx" }, { path: "app-bar.tsx" }],
    },
    {
      id: "error-state",
      snippets: [{ path: "error-state.tsx" }],
    },
    {
      id: "manner-temp",
      snippets: [{ path: "manner-temp.tsx" }],
    },
    {
      id: "manner-temp-badge",
      snippets: [{ path: "manner-temp-badge.tsx" }],
    },
    {
      id: "alert-dialog",
      snippets: [{ path: "alert-dialog.tsx" }],
    },
    {
      id: "bottom-sheet",
      snippets: [{ path: "bottom-sheet.tsx" }],
    },
    {
      id: "action-sheet",
      snippets: [{ path: "action-sheet.tsx" }],
      deprecated: true,
    },
    {
      id: "extended-action-sheet",
      snippets: [{ path: "extended-action-sheet.tsx" }],
      deprecated: true,
    },
    {
      id: "avatar",
      snippets: [{ path: "avatar.tsx" }],
    },
    {
      id: "pull-to-refresh",
      snippets: [{ path: "pull-to-refresh.tsx" }],
    },
    {
      id: "loading-indicator",
      snippets: [{ path: "loading-indicator.tsx" }],
    },
    {
      id: "action-button",
      snippets: [{ path: "action-button.tsx" }],
    },
    {
      id: "toggle-button",
      snippets: [{ path: "toggle-button.tsx" }],
    },
    {
      id: "reaction-button",
      snippets: [{ path: "reaction-button.tsx" }],
    },
    {
      id: "callout",
      snippets: [{ path: "callout.tsx" }],
    },
    {
      id: "control-chip",
      snippets: [{ path: "control-chip.tsx" }],
      deprecated: true,
    },
    {
      id: "chip",
      snippets: [{ path: "chip.tsx" }],
    },
    {
      id: "checkbox",
      snippets: [{ path: "checkbox.tsx" }],
    },
    {
      id: "identity-placeholder",
      snippets: [{ path: "identity-placeholder.tsx" }],
    },
    {
      id: "inline-banner",
      snippets: [{ path: "inline-banner.tsx" }],
      deprecated: true,
    },
    {
      id: "menu-sheet",
      snippets: [{ path: "menu-sheet.tsx" }],
    },
    {
      id: "snackbar",
      snippets: [{ path: "snackbar.tsx" }],
    },
    {
      id: "help-bubble",
      snippets: [{ path: "help-bubble.tsx" }],
    },
    {
      id: "tabs",
      snippets: [{ path: "tabs.tsx" }],
    },
    {
      id: "chip-tabs",
      snippets: [{ path: "chip-tabs.tsx" }],
    },
    {
      id: "page-banner",
      snippets: [{ path: "page-banner.tsx" }],
    },
    {
      id: "progress-circle",
      snippets: [{ path: "progress-circle.tsx" }],
    },
    {
      id: "radio-group",
      snippets: [{ path: "radio-group.tsx" }],
    },
    {
      id: "select-box",
      snippets: [{ path: "select-box.tsx" }],
    },
    {
      id: "segmented-control",
      snippets: [{ path: "segmented-control.tsx" }],
    },
    {
      id: "switch",
      snippets: [{ path: "switch.tsx" }],
    },
    {
      id: "text-field",
      snippets: [{ path: "text-field.tsx" }],
    },
    {
      id: "contextual-floating-button",
      snippets: [{ path: "contextual-floating-button.tsx" }],
    },
    {
      id: "floating-action-button",
      snippets: [{ path: "floating-action-button.tsx" }],
    },
    {
      id: "list",
      snippets: [{ path: "list.tsx" }],
    },
  ],
};
