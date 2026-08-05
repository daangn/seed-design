import { createSectionIndexRoute } from "@/app/_llms/section-index";
import { getBreezeSource } from "@/app/source";

export const revalidate = false;

export const GET = createSectionIndexRoute({
  section: "breeze",
  getSource: getBreezeSource,
  listHeading: "Components",
  related: ["react", "docs"],
});
