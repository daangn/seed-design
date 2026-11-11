import type { APIRoute } from "astro";
import { buildTokenSearchIndex } from "@/lib/token-search-index";

export const GET: APIRoute = async () => Response.json(await buildTokenSearchIndex());
