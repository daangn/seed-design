import { handleChatRequest } from "../../app/api/chat/handle-chat-request";

interface PagesFunctionContext {
  request: Request;
  env: Record<string, unknown>;
}

export async function onRequestPost(context: PagesFunctionContext) {
  return handleChatRequest(context.request, { env: context.env });
}
