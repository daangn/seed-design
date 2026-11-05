import { pageSchema } from "fumadocs-core/source/schema";
import z from "zod";
import { COVER_IMAGE_PATH_ERROR_MESSAGE, isValidCoverImagePath } from "./cover-image";

export const updatesFrontmatterSchema = pageSchema
  .extend({
    publishedAt: z.iso.datetime({ offset: true }).or(z.date()).optional(),
    category: z.enum(["post", "release"]).default("post"),
    coverImage: z
      .string()
      .refine(isValidCoverImagePath, { message: COVER_IMAGE_PATH_ERROR_MESSAGE })
      .optional(),
    coverImageFigmaId: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.category === "post" && !data.description) {
      context.addIssue({
        code: "custom",
        path: ["description"],
        message: "Post updates require a description.",
      });
    }
  });
