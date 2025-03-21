import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Logger } from "./logger";
import { NoOpLogger } from "./logger";

/**
 * Configuration for the Figma MCP Server
 */
export interface ServerConfig {
  figmaApiKey: string;
  port: number;
  configSources: {
    figmaApiKey: ConfigSource;
    port: ConfigSource;
  };
}

/**
 * Source of configuration value
 */
type ConfigSource = "cli" | "env" | "default";

/**
 * Command line arguments
 */
interface CliArgs {
  "figma-api-key"?: string;
  port?: number;
}

/**
 * Configuration manager for the Figma MCP Server
 */
export class ConfigManager {
  private readonly isStdioMode: boolean;
  private readonly logger: Logger;

  /**
   * Creates a new ConfigManager instance
   */
  constructor(options: { isStdioMode: boolean; logger?: Logger }) {
    this.isStdioMode = options.isStdioMode;
    this.logger = options.logger || NoOpLogger;
  }

  /**
   * Gets the server configuration from command line arguments and environment variables
   */
  getServerConfig(): ServerConfig {
    // Parse command line arguments
    const argv = this.parseCommandLineArgs();

    // Initialize config with default values
    const config: ServerConfig = {
      figmaApiKey: "",
      port: 3333,
      configSources: {
        figmaApiKey: "env",
        port: "default",
      },
    };

    // Handle FIGMA_API_KEY
    this.configureFigmaApiKey(config, argv);

    // Handle PORT
    this.configurePort(config, argv);

    // Validate configuration
    this.validateConfig(config);

    // Log configuration sources
    this.logConfig(config);

    return config;
  }

  /**
   * Parses command line arguments
   */
  private parseCommandLineArgs(): CliArgs {
    return yargs(hideBin(process.argv))
      .options({
        "figma-api-key": {
          type: "string",
          description: "Figma API key",
        },
        port: {
          type: "number",
          description: "Port to run the server on",
        },
      })
      .help()
      .parseSync() as CliArgs;
  }

  /**
   * Configures the Figma API key
   */
  private configureFigmaApiKey(config: ServerConfig, argv: CliArgs): void {
    if (argv["figma-api-key"]) {
      config.figmaApiKey = argv["figma-api-key"];
      config.configSources.figmaApiKey = "cli";
    } else if (process.env["FIGMA_API_KEY"]) {
      config.figmaApiKey = process.env["FIGMA_API_KEY"];
      config.configSources.figmaApiKey = "env";
    }
  }

  /**
   * Configures the server port
   */
  private configurePort(config: ServerConfig, argv: CliArgs): void {
    if (argv.port) {
      config.port = argv.port;
      config.configSources.port = "cli";
    } else if (process.env["PORT"]) {
      config.port = Number.parseInt(process.env["PORT"], 10);
      config.configSources.port = "env";
    }
  }

  /**
   * Validates the configuration
   */
  private validateConfig(config: ServerConfig): void {
    if (!config.figmaApiKey) {
      this.logger.error(
        "FIGMA_API_KEY is required (via CLI argument --figma-api-key or .env file)",
      );
      process.exit(1);
    }
  }

  /**
   * Logs the configuration
   */
  private logConfig(config: ServerConfig): void {
    if (this.isStdioMode) {
      return;
    }

    this.logger.log("\nConfiguration:");
    this.logger.log(
      `- FIGMA_API_KEY: ${this.maskApiKey(config.figmaApiKey)} (source: ${config.configSources.figmaApiKey})`,
    );
    this.logger.log(`- PORT: ${config.port} (source: ${config.configSources.port})`);
    this.logger.log(""); // Empty line for better readability
  }

  /**
   * Masks an API key for secure logging
   */
  private maskApiKey(key: string): string {
    if (key.length <= 4) return "****";
    return `****${key.slice(-4)}`;
  }
}

/**
 * Gets the server configuration
 */
export function getServerConfig(isStdioMode: boolean): ServerConfig {
  const configManager = new ConfigManager({ isStdioMode });
  return configManager.getServerConfig();
}
