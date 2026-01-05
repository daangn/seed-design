declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "dev" | "prod";
      POSTHOG_API_KEY?: string;
      POSTHOG_HOST?: string;
      DISABLE_TELEMETRY?: "true" | "false";
      SEED_DISABLE_TELEMETRY?: "true" | "false";
    }
  }
}

export {};
