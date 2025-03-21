import { z } from "zod";

export const transformOptionsSchema = z.object({
  list: z.boolean().optional(),
  log: z.boolean().optional(),
  track: z.boolean().optional(),
  parser: z.enum(["babel", "babylon", "flow", "ts", "tsx"]).optional(),
  extensions: z.string().optional(),
  ignoreConfig: z.string().optional(),
  match: z.any().optional(),
});
