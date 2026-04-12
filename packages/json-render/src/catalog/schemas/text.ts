import { z } from "zod";

export const textSchema = z.object({
  as: z
    .enum(["span", "p", "h1", "h2", "h3", "h4", "h5", "h6", "strong", "legend", "dt", "dd"])
    .optional(),
  textStyle: z
    .enum([
      "screenTitle",
      "t1Regular",
      "t1Medium",
      "t1Bold",
      "t2Regular",
      "t2Medium",
      "t2Bold",
      "t3Regular",
      "t3Medium",
      "t3Bold",
      "t4Regular",
      "t4Medium",
      "t4Bold",
      "t5Regular",
      "t5Medium",
      "t5Bold",
      "t6Regular",
      "t6Medium",
      "t6Bold",
      "t7Regular",
      "t7Medium",
      "t7Bold",
    ])
    .optional(),
  content: z.string().optional(),
  color: z.string().optional(),
  fontWeight: z.enum(["regular", "medium", "bold"]).optional(),
  maxLines: z.number().optional(),
  align: z.enum(["left", "center", "right"]).optional(),
});

export const textDescription =
  "Typography component. Use content prop for text. textStyle for sizes (t1Bold=largest, t7Regular=smallest). Color tokens: 'fg.neutral', 'fg.neutralSubtle', 'fg.brand'.";
