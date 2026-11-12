import type { APIRoute } from "astro";
import { buildComponentSearchIndex } from "@/lib/component-search-index";

export const GET: APIRoute = async () => Response.json(await buildComponentSearchIndex());
