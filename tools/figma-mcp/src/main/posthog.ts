const EVENT_PREFIX = "seed_figma_mcp_plugin";

interface CaptureOptions {
  event: string;
  properties?: Record<string, unknown>;
}

async function capture({ event, properties }: CaptureOptions) {
  if (Env.MODE === "dev") {
    console.log("capture", event, properties);

    return;
  }

  try {
    const url = `${Env.POSTHOG_HOST}/capture`;
    const headers = {
      "Content-Type": "application/json",
    };

    const payload = {
      api_key: Env.POSTHOG_API_KEY,
      event: `${EVENT_PREFIX}.${event}`,
      distinct_id: `figma.${figma.currentUser?.name}`,
      properties: {
        ...properties,
        $process_person_profile: false,
      },
      timestamp: new Date(),
    };

    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(error);
  }
}

export const posthog = {
  capture,
};
