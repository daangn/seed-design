import type { Registry } from "./schema";

export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "app-screen",
      snippets: [
        {
          path: "app-screen.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
        {
          path: "app-bar.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "error-state",
      snippets: [
        {
          path: "error-state.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "field-button",
      snippets: [
        {
          path: "field-button.tsx",
          dependencies: { "@seed-design/react": "~0.3.0", "@seed-design/css": "~0.3.0" },
        },
      ],
    },
    {
      id: "manner-temp",
      snippets: [
        {
          path: "manner-temp.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "manner-temp-badge",
      snippets: [
        {
          path: "manner-temp-badge.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "alert-dialog",
      snippets: [
        {
          path: "alert-dialog.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "bottom-sheet",
      snippets: [
        {
          path: "bottom-sheet.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "action-sheet",
      snippets: [
        {
          path: "action-sheet.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
      deprecated: true,
    },
    {
      id: "extended-action-sheet",
      snippets: [
        {
          path: "extended-action-sheet.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
      deprecated: true,
    },
    {
      id: "avatar",
      snippets: [
        {
          path: "avatar.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "pull-to-refresh",
      snippets: [
        {
          path: "pull-to-refresh.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "loading-indicator",
      snippets: [
        {
          path: "loading-indicator.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "action-button",
      snippets: [
        {
          path: "action-button.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "toggle-button",
      snippets: [
        {
          path: "toggle-button.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "reaction-button",
      snippets: [
        {
          path: "reaction-button.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "callout",
      snippets: [
        {
          path: "callout.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "control-chip",
      snippets: [
        {
          path: "control-chip.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
      deprecated: true,
    },
    {
      id: "chip",
      snippets: [
        {
          path: "chip.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "checkbox",
      snippets: [
        {
          path: "checkbox.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "identity-placeholder",
      snippets: [
        {
          path: "identity-placeholder.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "inline-banner",
      snippets: [
        {
          path: "inline-banner.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
      deprecated: true,
    },
    {
      id: "menu-sheet",
      snippets: [
        {
          path: "menu-sheet.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "snackbar",
      snippets: [
        {
          path: "snackbar.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "help-bubble",
      snippets: [
        {
          path: "help-bubble.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "tabs",
      snippets: [
        {
          path: "tabs.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "chip-tabs",
      snippets: [
        {
          path: "chip-tabs.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "page-banner",
      snippets: [
        {
          path: "page-banner.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "progress-circle",
      snippets: [
        {
          path: "progress-circle.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "radio-group",
      snippets: [
        {
          path: "radio-group.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "select-box",
      snippets: [
        {
          path: "select-box.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "segmented-control",
      snippets: [
        {
          path: "segmented-control.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "switch",
      snippets: [
        {
          path: "switch.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "text-field",
      snippets: [
        {
          path: "text-field.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "contextual-floating-button",
      snippets: [
        {
          path: "contextual-floating-button.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "floating-action-button",
      snippets: [
        {
          path: "floating-action-button.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
    {
      id: "list",
      snippets: [
        {
          path: "list.tsx",
          dependencies: { "@seed-design/react": "~0.2.4", "@seed-design/css": "~0.2.4" },
        },
      ],
    },
  ],
};
