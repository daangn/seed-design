import type { APIRoute } from "astro";
import { rootLlmsIndex } from "../../lib/llms/section-index";

export const GET: APIRoute = () => new Response(rootLlmsIndex());
