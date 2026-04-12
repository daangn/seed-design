import { z } from "zod";

export const alertDialogRootSchema = z.object({
  open: z.boolean().optional(),
  defaultOpen: z.boolean().optional(),
});

export const alertDialogRootDescription =
  "Alert dialog container. Must contain AlertDialogContent. Use open/defaultOpen to control visibility.";

export const alertDialogContentSchema = z.object({});

export const alertDialogContentDescription =
  "Alert dialog content wrapper. Must be inside AlertDialogRoot. Contains AlertDialogHeader and AlertDialogFooter.";

export const alertDialogHeaderSchema = z.object({});

export const alertDialogHeaderDescription =
  "Alert dialog header section. Contains AlertDialogTitle and AlertDialogDescription.";

export const alertDialogTitleSchema = z.object({
  text: z.string().optional(),
});

export const alertDialogTitleDescription = "Alert dialog title. Use text prop for title content.";

export const alertDialogDescriptionSchema = z.object({
  text: z.string().optional(),
});

export const alertDialogDescriptionDescription =
  "Alert dialog description. Use text prop for description content.";

export const alertDialogFooterSchema = z.object({});

export const alertDialogFooterDescription =
  "Alert dialog footer section for action buttons. Contains AlertDialogAction components.";

export const alertDialogActionSchema = z.object({
  label: z.string().optional(),
  variant: z
    .enum(["brandSolid", "neutralSolid", "neutralWeak", "dangerSolid", "dangerWeak"])
    .optional(),
});

export const alertDialogActionDescription =
  "Alert dialog action button. Use label prop for button text. variant='neutralWeak' for cancel, 'brandSolid' for confirm.";
