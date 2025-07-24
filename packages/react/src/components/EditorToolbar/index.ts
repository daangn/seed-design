export {
  EditorToolbarRoot,
  EditorToolbarItem,
  EditorToolbarLabel,
  EditorToolbarIcon,
  EditorToolbarPrefixIcon,
} from "./EditorToolbar";

export type {
  EditorToolbarRootProps,
  EditorToolbarItemProps,
  EditorToolbarLabelProps,
  EditorToolbarIconProps,
  EditorToolbarPrefixIconProps,
} from "./EditorToolbar";

import {
  EditorToolbarRoot,
  EditorToolbarItem,
  EditorToolbarLabel,
  EditorToolbarIcon,
  EditorToolbarPrefixIcon,
} from "./EditorToolbar";

export const EditorToolbar = Object.assign(EditorToolbarRoot, {
  Root: EditorToolbarRoot,
  Item: EditorToolbarItem,
  Label: EditorToolbarLabel,
  Icon: EditorToolbarIcon,
  PrefixIcon: EditorToolbarPrefixIcon,
});