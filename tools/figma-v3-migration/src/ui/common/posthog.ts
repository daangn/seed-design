import { usePostHog as usePostHogHook } from "posthog-js/react";
import { useFigmaMetadata } from "./context/figma";

const SERVICE_NAME = "figma_v3_migration";

export const usePostHog = () => {
  const posthog = usePostHogHook();
  const { metadata } = useFigmaMetadata();

  const capture = (event: string, properties?: Record<string, unknown>) => {
    posthog?.capture(`${SERVICE_NAME}.${event}`, properties);
  };

  const identify = () => {
    posthog?.identify(metadata?.currentUser?.id, {
      name: metadata?.currentUser?.name,
      pageName: metadata?.currentPage?.name,
      rootName: metadata?.currentRoot?.name,
    });
  };

  return { capture, identify };
};
