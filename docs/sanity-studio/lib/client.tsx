import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: false,
});
