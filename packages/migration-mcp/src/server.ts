import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Transformers, transformerNames } from "@seed-design/codemod/transformers";

// 도구 구현 임포트
import { analyzeTokens } from "./tools/analyze-tokens.js";
import { runCodemod } from "./tools/run-codemod.js";
import { generateMigrationPlan } from "./tools/migration-plan.js";

// 리소스 구현 임포트
import { migrationGuideResource } from "./resources/migration-guide.js";
import { tokenMappingsResource } from "./resources/token-mappings.js";
import { commonIssuesResource } from "./resources/common-issues.js";

class SeedMigrationServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "seed-foundation-migration",
        version: "1.0.0",
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      },
    );

    this.setupToolHandlers();
    this.setupResourceHandlers();

    // 에러 핸들링
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // 도구 목록 핸들러
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "analyze_tokens",
          description: "프로젝트에서 SEED 디자인 토큰 사용 패턴을 분석합니다",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: {
                type: "string",
                description: "분석할 프로젝트 경로",
              },
              includePatterns: {
                type: "array",
                items: { type: "string" },
                description: '분석에 포함할 파일 패턴 (예: "**/*.tsx")',
              },
            },
            required: ["projectPath"],
          },
        },
        {
          name: "run_codemod",
          description: "SEED 디자인 토큰 마이그레이션을 위한 Codemod를 실행합니다",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: {
                type: "string",
                description: "Codemod를 실행할 프로젝트 경로",
              },
              transformName: {
                type: "string",
                description: "실행할 transform 이름",
                enum: [...transformerNames, "all"],
              },
              targetPath: {
                type: "string",
                description: '변환할 대상 경로 (예: "src")',
              },
              options: {
                type: "object",
                description: "추가 옵션",
                properties: {
                  log: { type: "boolean" },
                  ignoreConfig: { type: "string" },
                },
              },
            },
            required: ["projectPath", "transformName", "targetPath"],
          },
        },
        {
          name: "summarize_changes",
          description: "마이그레이션 변경사항을 요약합니다",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: {
                type: "string",
                description: "요약할 프로젝트 경로",
              },
              beforeCommit: {
                type: "string",
                description: "마이그레이션 전 커밋 해시 (선택사항)",
              },
              afterCommit: {
                type: "string",
                description: "마이그레이션 후 커밋 해시 (선택사항)",
              },
            },
            required: ["projectPath"],
          },
        },
        {
          name: "generate_migration_plan",
          description: "프로젝트 분석 결과를 바탕으로 마이그레이션 계획을 생성합니다",
          inputSchema: {
            type: "object",
            properties: {
              projectPath: {
                type: "string",
                description: "계획을 생성할 프로젝트 경로",
              },
              analysisResult: {
                type: "object",
                description: "토큰 분석 결과 (선택사항)",
              },
            },
            required: ["projectPath"],
          },
        },
      ],
    }));

    // 도구 호출 핸들러
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      // 인수가 없는 경우 오류 발생
      if (!request.params.arguments) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `도구 실행에 필요한 인수가 제공되지 않았습니다: ${request.params.name}`,
        );
      }

      switch (request.params.name) {
        case "analyze_tokens":
          return await analyzeTokens(request.params.arguments as any);
        case "run_codemod":
          return await runCodemod(request.params.arguments as any);
        case "generate_migration_plan":
          return await generateMigrationPlan(request.params.arguments as any);
        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
      }
    });
  }

  private setupResourceHandlers() {
    // 리소스 목록 핸들러
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: "seed-migration://guide",
          name: "SEED 디자인 마이그레이션 가이드",
          mimeType: "application/json",
          description: "SEED 디자인 V2에서 V3로의 마이그레이션 가이드",
        },
        {
          uri: "seed-migration://token-mappings",
          name: "토큰 매핑 테이블",
          mimeType: "application/json",
          description: "V2에서 V3로의 토큰 매핑 정보",
        },
        {
          uri: "seed-migration://common-issues",
          name: "일반적인 마이그레이션 문제",
          mimeType: "application/json",
          description: "마이그레이션 중 발생할 수 있는 일반적인 문제와 해결책",
        },
      ],
    }));

    // 리소스 읽기 핸들러
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      switch (uri) {
        case "seed-migration://guide":
          return migrationGuideResource();
        case "seed-migration://token-mappings":
          return tokenMappingsResource();
        case "seed-migration://common-issues":
          return commonIssuesResource();
        default:
          throw new McpError(ErrorCode.InvalidRequest, `Unknown resource URI: ${uri}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("SEED Migration MCP server running on stdio");
  }
}

export default SeedMigrationServer;
