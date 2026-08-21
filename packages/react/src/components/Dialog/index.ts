// NOTE: dialog naming is mid-rename; rootage/vars already use the new names, recipes and react components still use the old ones.
// Semantically (= snippet naming), this component is the AlertDialog:
//   snippet AlertDialog → react Dialog        → recipe "dialog"         → vars alertDialog
//   snippet Dialog      → react ContentDialog → recipe "content-dialog" → vars dialog

export {
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogAction,
  type DialogBackdropProps,
  type DialogPositionerProps,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogFooterProps,
  type DialogHeaderProps,
  type DialogRootProps,
  type DialogTitleProps,
  type DialogTriggerProps,
  type DialogActionProps,
} from "./Dialog";

export * as Dialog from "./Dialog.namespace";
