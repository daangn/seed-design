declare global {
  const Env: {
    MODE: "dev" | "prod";
    POSTHOG_API_KEY: string;
    POSTHOG_HOST: string;
  };
}

export {};
