import type { Registry } from "./schema";

export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "accordion",
      snippets: [
        {
          path: "accordion.tsx",
          dependencies: { "@seed-design/react": "~1.2.10", "@seed-design/css": "~1.2.10" },
        },
      ],
    },
    {
      id: "app-screen",
      snippets: [
        {
          path: "app-screen.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
        {
          path: "app-bar.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "error-state",
      deprecated: true,
      snippets: [
        {
          path: "error-state.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
    {
      id: "field-button",
      snippets: [
        {
          path: "field-button.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
    {
      id: "manner-temp",
      snippets: [
        {
          path: "manner-temp.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "manner-temp-badge",
      snippets: [
        {
          path: "manner-temp-badge.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "alert-dialog",
      snippets: [
        {
          path: "alert-dialog.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "side-panel",
      snippets: [
        {
          path: "side-panel.tsx",
          dependencies: {
            "@seed-design/react": "~1.3.0",
            "@seed-design/css": "~1.3.0",
            "@karrotmarket/react-monochrome-icon": "^1.0.0",
          },
        },
      ],
    },
    {
      id: "responsive-side-panel",
      snippets: [
        {
          path: "responsive-side-panel.tsx",
          dependencies: {
            "@seed-design/react": "~1.3.0",
            "@seed-design/css": "~1.3.0",
          },
        },
      ],
    },
    {
      id: "bottom-sheet",
      snippets: [
        {
          path: "bottom-sheet.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
    {
      id: "action-sheet",
      snippets: [
        {
          path: "action-sheet.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
      deprecated: true,
    },
    {
      id: "extended-action-sheet",
      snippets: [
        {
          path: "extended-action-sheet.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
      deprecated: true,
    },
    {
      id: "avatar",
      snippets: [
        {
          path: "avatar.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "pull-to-refresh",
      snippets: [
        {
          path: "pull-to-refresh.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "loading-indicator",
      snippets: [
        {
          path: "loading-indicator.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "action-button",
      snippets: [
        {
          path: "action-button.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "toggle-button",
      snippets: [
        {
          path: "toggle-button.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "reaction-button",
      snippets: [
        {
          path: "reaction-button.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "callout",
      snippets: [
        {
          path: "callout.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "control-chip",
      snippets: [
        {
          path: "control-chip.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
      deprecated: true,
    },
    {
      id: "chip",
      snippets: [
        {
          path: "chip.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "checkbox",
      snippets: [
        {
          path: "checkbox.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "content-placeholder",
      snippets: [
        {
          path: "content-placeholder.tsx",
          dependencies: { "@seed-design/react": "~1.2.8", "@seed-design/css": "~1.2.6" },
        },
      ],
    },
    {
      id: "identity-placeholder",
      snippets: [
        {
          path: "identity-placeholder.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "inline-banner",
      snippets: [
        {
          path: "inline-banner.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
      deprecated: true,
    },
    {
      id: "menu",
      snippets: [
        {
          path: "menu.tsx",
          dependencies: { "@seed-design/react": "~1.3.0", "@seed-design/css": "~1.3.0" },
        },
      ],
    },
    {
      id: "menu-sheet",
      snippets: [
        {
          path: "menu-sheet.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "slider",
      snippets: [
        {
          path: "slider.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
    {
      id: "snackbar",
      snippets: [
        {
          path: "snackbar.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "help-bubble",
      snippets: [
        {
          path: "help-bubble.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "tabs",
      snippets: [
        {
          path: "tabs.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "chip-tabs",
      snippets: [
        {
          path: "chip-tabs.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "tag-group",
      snippets: [
        {
          path: "tag-group.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "page-banner",
      snippets: [
        {
          path: "page-banner.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
    {
      id: "progress-circle",
      snippets: [
        {
          path: "progress-circle.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "radio-group",
      snippets: [
        {
          path: "radio-group.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "select-box",
      snippets: [
        {
          path: "select-box.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "segmented-control",
      snippets: [
        {
          path: "segmented-control.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "switch",
      snippets: [
        {
          path: "switch.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "text-field",
      snippets: [
        {
          path: "text-field.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
    {
      id: "attachment-field",
      snippets: [
        {
          path: "attachment-field.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
      ],
    },
    {
      id: "attachment-field-reorderable",
      snippets: [
        {
          path: "attachment-field.tsx",
          dependencies: { "@seed-design/react": "~1.2.0", "@seed-design/css": "~1.2.0" },
        },
        {
          path: "attachment-field-reorderable.tsx",
          dependencies: {
            "@seed-design/react": "~1.2.0",
            "@seed-design/css": "~1.2.0",
            "@dnd-kit/react": "^0.4.0",
            "@dnd-kit/abstract": "^0.4.0",
            "@dnd-kit/dom": "^0.4.0",
          },
        },
      ],
    },
    {
      id: "contextual-floating-button",
      snippets: [
        {
          path: "contextual-floating-button.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "floating-action-button",
      snippets: [
        {
          path: "floating-action-button.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "list",
      snippets: [
        {
          path: "list.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
        {
          path: "list-header.tsx",
          dependencies: { "@seed-design/react": "~1.0.0", "@seed-design/css": "~1.0.0" },
        },
      ],
    },
    {
      id: "result-section",
      snippets: [
        {
          path: "result-section.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
    {
      id: "side-navigation",
      snippets: [
        {
          path: "side-navigation.tsx",
          dependencies: { "@seed-design/react": "~1.1.0", "@seed-design/css": "~1.1.0" },
        },
      ],
    },
  ],
};
