import { createSectionIndexRoute } from "@/app/_llms/section-index";
import { getFoundationsSource } from "@/app/source";

export const revalidate = false;

export const GET = createSectionIndexRoute({
  section: "foundations",
  getSource: getFoundationsSource,
  listHeading: "Documents",
  related: ["components", "react"],
});
