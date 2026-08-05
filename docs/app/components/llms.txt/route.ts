import { createSectionIndexRoute } from "@/app/_llms/section-index";
import { getComponentsSource } from "@/app/source";

export const revalidate = false;

export const GET = createSectionIndexRoute({
  section: "components",
  getSource: getComponentsSource,
  listHeading: "Components",
  related: ["foundations", "react"],
});
