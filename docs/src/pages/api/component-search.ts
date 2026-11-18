import type { APIRoute } from "astro";
import { buildComponentSearchIndex } from "../../../lib/component-search-index";
import { publicFileExists } from "../../content/public-files";
import { isSectionInBuild } from "../../content/sections";
import { listPages } from "../../content/source";

// archive 빌드에는 components 섹션이 없다(보관본 exporter도 이 endpoint를 복사하지 않는다).
export const GET: APIRoute = async () =>
  Response.json(
    buildComponentSearchIndex(
      isSectionInBuild("components") ? await listPages("components") : [],
      publicFileExists,
    ),
  );
