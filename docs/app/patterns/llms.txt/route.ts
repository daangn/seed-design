import { createSectionIndexRoute } from "@/app/_llms/section-index";
import { getPatternsSource } from "@/app/source";

export const revalidate = false;

export const GET = createSectionIndexRoute({
  section: "patterns",
  getSource: getPatternsSource,
  listHeading: "Documents",
  related: ["components", "foundations"],
});
