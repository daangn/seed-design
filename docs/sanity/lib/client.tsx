import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, viewerToken } from "../env";

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  token: viewerToken,
  useCdn: false,
});
