import { z } from "zod";

export const avatarSchema = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  size: z.enum(["20", "24", "36", "42", "48", "56", "64", "80", "96", "108"]).optional(),
});

export const avatarDescription =
  "User avatar image. Default size is '48'. Use src for image URL, alt for accessibility text.";
