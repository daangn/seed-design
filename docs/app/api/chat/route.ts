import { handleChatRequest } from "./handle-chat-request";

export async function POST(req: Request) {
  return handleChatRequest(req);
}
