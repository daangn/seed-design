import type { APIRoute } from "astro";
import { buildComponentSearchIndex } from "../../../lib/component-search-index";
import { publicFileExists } from "../../content/public-files";
import { listPages } from "../../content/source";

export const GET: APIRoute = async () =>
  Response.json(buildComponentSearchIndex(await listPages("components"), publicFileExists));
