import { createSectionIndexRoute } from "@/app/_llms/section-index";
import { getLynxSource } from "@/app/source";

export const revalidate = false;

export const GET = createSectionIndexRoute({
  section: "lynx",
  getSource: getLynxSource,
  listHeading: "Documents",
  related: ["react", "ai-integration"],
});
