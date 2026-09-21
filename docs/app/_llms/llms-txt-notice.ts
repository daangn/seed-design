import { baseUrl } from "@/app/metadata";

/**
 * dev가 문서 목록을 내던 `/llms.txt`, `/docs/llms.txt`, `/react/llms.txt`에 목록 대신 내는 안내.
 * 목록은 이제 docs-mcp와 CLI가 문서 인덱스로 만든다.
 */
export const llmsTxtNotice = () =>
  new Response(`# SEED Design

이 사이트는 문서 목록을 llms.txt로 제공하지 않습니다. [Docs MCP](${new URL("/ai-integration/docs-mcp.md", baseUrl)})나 [CLI의 \`docs\` 명령어](${new URL("/react/getting-started/cli/commands.md#docs", baseUrl)})로 SEED 문서를 찾아 읽으세요.
`);
