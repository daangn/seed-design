"use client";

import type { Activity } from "@stackflow/core";
import { Box, Flex, HStack, PrefixIcon, SuffixIcon, Text, VStack } from "@seed-design/react";
import { IconChevronLeftLine, IconChevronRightLine } from "@karrotmarket/react-monochrome-icon";
import { useEffect, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { ProgressCircle } from "seed-design/ui/progress-circle";
import { Switch } from "seed-design/ui/switch";
import { useSimpleReveal } from "simple-reveal";

interface StackflowIframePreviewProps {
  path: string;
}

type SerializedActivity = Pick<Activity, "id" | "name" | "isActive" | "transitionState">;

export function StackflowIframePreview({ path }: StackflowIframePreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [activityStack, setActivityStack] = useState<SerializedActivity[]>([]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      switch (event.data.type) {
        case "URL_CHANGE": {
          if (typeof event.data.url !== "string") return;

          setCurrentUrl(event.data.url);

          break;
        }

        case "STACK_CHANGE": {
          if (!Array.isArray(event.data.stack)) return;

          setActivityStack(event.data.stack);

          break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleBack = () => {
    const iframe = document.querySelector("iframe");
    iframe?.contentWindow?.postMessage({ type: "NAVIGATE_BACK" }, "*");
  };

  const handleForward = () => {
    const iframe = document.querySelector("iframe");
    iframe?.contentWindow?.postMessage({ type: "NAVIGATE_FORWARD" }, "*");
  };

  const { cn, ref, style } = useSimpleReveal({
    delay: 200,
    rootMargin: "-200px",
    initialTransform: "scale(0.95)",
  });

  return (
    <HStack
      position="relative"
      width="full"
      justify="center"
      gap="x8"
      ref={ref}
      className={cn()}
      style={{ margin: "3rem 0", ...style }}
    >
      <VStack gap="x4" align="center" width="360px">
        <Box
          width="360px"
          height="640px"
          position="relative"
          borderWidth={1}
          borderColor="stroke.neutralWeak"
          borderRadius="r2"
          overflowX="hidden"
          overflowY="hidden"
        >
          <IframePreview path={path} onLoad={() => setIsLoaded(true)} />
          <LoadingOverlay visible={!isLoaded} />
        </Box>
        <Navigation url={currentUrl} onBack={handleBack} onForward={handleForward} />
      </VStack>
      <ActivityStackPanel activities={activityStack} />
    </HStack>
  );
}

function IframePreview({ path, onLoad }: { path: string; onLoad: () => void }) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => setRendered(true), []);

  if (!rendered) return null;

  return (
    <iframe
      // getStackflowSpaUrl should be run in a browser
      src={getStackflowSpaUrl(path)}
      title="Stackflow Example"
      onLoad={onLoad}
      style={{ width: "100%", height: "100%", border: "none" }}
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
    />
  );
}

function ActivityStackPanel({ activities }: { activities: SerializedActivity[] }) {
  const [hideExitDone, setHideExitDone] = useState(true);

  const filteredActivities = activities.filter(
    (activity) => !(hideExitDone && activity.transitionState === "exit-done"),
  );

  return (
    <VStack gap="x4" justify="space-between" align="flex-start">
      <Switch
        size="16"
        tone="neutral"
        label="Hide exit-done activities"
        checked={hideExitDone}
        onCheckedChange={setHideExitDone}
      />
      <Flex gap="x2" direction="column-reverse" pb="80px" width="300px">
        {filteredActivities.map((activity) => (
          <HStack key={activity.id} gap="x2" align="center">
            <Flex
              minWidth="200px"
              px="x2_5"
              py="x2"
              align="center"
              borderRadius="r2"
              background={activity.isActive ? "bg.brandWeak" : "bg.neutralWeak"}
            >
              <Text
                textStyle={activity.isActive ? "t3Bold" : "t3Regular"}
                color={activity.isActive ? "fg.brand" : "fg.neutralSubtle"}
                className="font-mono"
              >
                {activity.name}
              </Text>
            </Flex>
            <Text
              textStyle="t2Medium"
              className="font-mono"
              color={activity.transitionState.endsWith("active") ? "fg.brand" : "fg.neutralSubtle"}
            >
              {activity.transitionState}
            </Text>
          </HStack>
        ))}
      </Flex>
    </VStack>
  );
}

function LoadingOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <Flex position="absolute" top={0} left={0} right={0} bottom={0} justify="center" align="center">
      <ProgressCircle size="24" />
    </Flex>
  );
}

function Navigation({
  url,
  onBack,
  onForward,
}: {
  url: string | null;
  onBack: () => void;
  onForward: () => void;
}) {
  return (
    <VStack gap="x4" align="center" width="full">
      {url ? (
        (() => {
          const { origin, path } = formatUrl(url);

          return (
            <Text
              className="font-mono transition-opacity opacity-100"
              align="center"
              textStyle="t3Medium"
              color="fg.neutralSubtle"
            >
              <Text textStyle="t3Medium">{origin}</Text>
              <Text textStyle="t3Bold" color="fg.neutral" className="empty:hidden">
                {path}
              </Text>
            </Text>
          );
        })()
      ) : (
        <Text
          className="font-mono transition-opacity opacity-0"
          align="center"
          textStyle="t3Medium"
          color="fg.neutralSubtle"
        >
          Loading...
        </Text>
      )}
      <HStack gap="x2" align="center">
        <ActionButton variant="ghost" size="small" onClick={onBack} disabled={!url}>
          <PrefixIcon svg={<IconChevronLeftLine />} />
          Back
        </ActionButton>
        <ActionButton variant="ghost" size="small" onClick={onForward} disabled={!url}>
          Forward
          <SuffixIcon svg={<IconChevronRightLine />} />
        </ActionButton>
      </HStack>
    </VStack>
  );
}

function getStackflowSpaUrl(path: string): string {
  const baseURL = (() => {
    // Local development
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5173";
    }

    // Branch previews
    // Docs URL: https://<branch>.seed-design-v3.pages.dev
    // QA URL:   https://<branch>.seed-design-qa.pages.dev
    if (window.location.hostname.endsWith(".seed-design-v3.pages.dev")) {
      const branch = window.location.hostname.split(".")[0];

      return `https://${branch}.seed-design-qa.pages.dev`;
    }

    // Production
    return "https://seed-design-qa.pages.dev";
  })();

  return new URL(path, baseURL).toString();
}

function formatUrl(urlString: string) {
  const url = new URL(urlString);
  const path = url
    .toString()
    .replace(new RegExp(`^${url.origin}`), "")
    .replace(/\/$/g, "");

  return { origin: url.origin, path };
}
