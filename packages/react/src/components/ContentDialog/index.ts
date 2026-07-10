// NOTE: dialog naming is mid-rename; rootage/vars already use the new names, recipes and react components still use the old ones.
// Semantically (= snippet naming), this component is the Dialog:
//   snippet AlertDialog → react Dialog        → recipe "dialog"         → vars alertDialog
//   snippet Dialog      → react ContentDialog → recipe "content-dialog" → vars dialog

export {
  ContentDialogBackdrop,
  ContentDialogPositioner,
  ContentDialogContent,
  ContentDialogBody,
  ContentDialogDescription,
  ContentDialogFooter,
  ContentDialogHeader,
  ContentDialogRoot,
  ContentDialogTitle,
  ContentDialogTrigger,
  ContentDialogAction,
  ContentDialogCloseButton,
  type ContentDialogBackdropProps,
  type ContentDialogPositionerProps,
  type ContentDialogContentProps,
  type ContentDialogBodyProps,
  type ContentDialogDescriptionProps,
  type ContentDialogFooterProps,
  type ContentDialogHeaderProps,
  type ContentDialogRootProps,
  type ContentDialogTitleProps,
  type ContentDialogTriggerProps,
  type ContentDialogActionProps,
  type ContentDialogCloseButtonProps,
} from "./ContentDialog";

export * as ContentDialog from "./ContentDialog.namespace";
