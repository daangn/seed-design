import type { Registry } from "../schema";

const lynxSeedPackageRanges = {
  "@seed-design/lynx-react": "^1.0.0",
  "@seed-design/lynx-css": "^1.0.0",
};

const lynxSeedIconPackageRanges = {
  ...lynxSeedPackageRanges,
  "@karrotmarket/lynx-monochrome-icon": ">=1.20.0 <2.0.0",
};

const attachmentReorderablePackageRanges = {
  ...lynxSeedIconPackageRanges,
  "@seed-design/lynx-react-sortable": "^1.0.0",
};

// Lynx UI registry. Each item must have a matching snippet file under
// `./ui/<id>.tsx` and a corresponding component implementation in
// `@seed-design/lynx-react`. See `docs/registry/react/registry-ui.ts`
// for the React-side registry that this list mirrors a subset of.
export const registryUI: Registry = {
  id: "ui",
  items: [
    {
      id: "accordion",
      snippets: [
        {
          path: "accordion.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "app-bar",
      snippets: [
        {
          path: "app-bar.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "badge",
      snippets: [
        {
          path: "badge.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "bottom-sheet",
      snippets: [
        {
          path: "bottom-sheet.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "alert-dialog",
      snippets: [
        {
          path: "alert-dialog.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "dialog",
      snippets: [
        {
          path: "dialog.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "callout",
      snippets: [
        {
          path: "callout.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "checkbox",
      snippets: [
        {
          path: "checkbox.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "chip-tabs",
      snippets: [
        {
          path: "chip-tabs.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "field-button",
      snippets: [
        {
          path: "field-button.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "floating-action-button",
      snippets: [
        {
          path: "floating-action-button.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "attachment-display-field",
      snippets: [
        {
          path: "attachment-display-field.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "avatar",
      snippets: [{ path: "avatar.tsx", dependencies: lynxSeedPackageRanges }],
    },
    {
      id: "identity-placeholder",
      snippets: [
        {
          path: "identity-placeholder.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "attachment-field",
      snippets: [
        {
          path: "attachment-field.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "attachment-display-field-reorderable",
      snippets: [
        {
          path: "attachment-display-field-reorderable.tsx",
          dependencies: attachmentReorderablePackageRanges,
        },
      ],
    },
    {
      id: "attachment-field-reorderable",
      snippets: [
        {
          path: "attachment-field-reorderable.tsx",
          dependencies: attachmentReorderablePackageRanges,
        },
      ],
    },
    {
      id: "list",
      snippets: [
        {
          path: "list.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
        {
          path: "list-header.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "manner-temp",
      snippets: [
        {
          path: "manner-temp.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "manner-temp-badge",
      snippets: [
        {
          path: "manner-temp-badge.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "menu",
      snippets: [
        {
          path: "menu.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "menu-sheet",
      snippets: [
        {
          path: "menu-sheet.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "help-bubble",
      snippets: [
        {
          path: "help-bubble.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "progress-circle",
      snippets: [
        {
          path: "progress-circle.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "page-banner",
      snippets: [
        {
          path: "page-banner.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "quantity-picker",
      snippets: [
        {
          path: "quantity-picker.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "radio-group",
      snippets: [
        {
          path: "radio-group.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "pull-to-refresh",
      snippets: [
        {
          path: "pull-to-refresh.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "result-section",
      snippets: [
        {
          path: "result-section.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "segmented-control",
      snippets: [
        {
          path: "segmented-control.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "select",
      snippets: [
        {
          path: "select.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "select-box",
      snippets: [
        {
          path: "select-box.tsx",
          dependencies: lynxSeedIconPackageRanges,
        },
      ],
    },
    {
      id: "slider",
      snippets: [
        {
          path: "slider.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "switch",
      snippets: [
        {
          path: "switch.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "tabs",
      snippets: [
        {
          path: "tabs.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "tag-group",
      snippets: [
        {
          path: "tag-group.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "text-field",
      snippets: [
        {
          path: "text-field.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
    {
      id: "wheel-picker",
      snippets: [
        {
          path: "wheel-picker.tsx",
          dependencies: lynxSeedPackageRanges,
        },
      ],
    },
  ],
};
