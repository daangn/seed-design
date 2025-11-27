"use client";

import type { Activity } from "@stackflow/core";
import { Box, Flex, HStack, Text, VStack } from "@seed-design/react";
import { IconArrowUpRightFill } from "@karrotmarket/react-monochrome-icon";
import { useEffect, useRef, useState } from "react";
import { ProgressCircle } from "seed-design/ui/progress-circle";
import { useSimpleReveal } from "simple-reveal";

interface StackflowIframePreviewProps {
  path: string;
}

type SerializedActivity = Pick<Activity, "id" | "name" | "isActive" | "transitionState">;

export function StackflowIframePreview({ path }: StackflowIframePreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [activityStack, setActivityStack] = useState<SerializedActivity[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only handle messages from this specific iframe
      if (event.source !== iframeRef.current?.contentWindow) return;

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

  const { cn, ref, style } = useSimpleReveal({
    delay: 200,
    rootMargin: "-200px",
    initialTransform: "scale(0.95)",
  });

  return (
    <VStack gap="x6" align="center" width="full" className={cn()} style={style} ref={ref}>
      <HStack gap="x8" wrap justify="center">
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
          <IframePreview path={path} onLoad={() => setIsLoaded(true)} iframeRef={iframeRef} />
          <LoadingOverlay visible={!isLoaded} />
        </Box>
        <ActivityStackPanel
          disabled={!isLoaded}
          activities={activityStack}
          getActivityHref={getActivityGitHubUrl}
        />
      </HStack>
      <Navigation url={currentUrl} />
    </VStack>
  );
}

function IframePreview({
  path,
  onLoad,
  iframeRef,
}: {
  path: string;
  onLoad: () => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => setRendered(true), []);

  if (!rendered) return null;

  return (
    <iframe
      ref={iframeRef}
      // getStackflowSpaUrl should be run in a browser
      src={getStackflowSpaUrl(path)}
      title="Stackflow Example"
      onLoad={onLoad}
      style={{ width: "100%", height: "100%", border: "none" }}
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
      loading="lazy"
    />
  );
}

function ActivityStackPanel({
  activities,
  getActivityHref,
}: {
  disabled?: boolean;
  activities: SerializedActivity[];
  getActivityHref: (activityName: string) => string;
}) {
  return (
    <Flex gap="x2" direction="column-reverse" width="300px">
      {activities
        .filter((activity) => activity.transitionState !== "exit-done")
        .map((activity) => (
          <VStack key={activity.id} gap="x2" align="flex-start">
            <HStack
              asChild
              px="x3"
              py="x3"
              gap="x1_5"
              align="center"
              borderRadius="r2"
              color={activity.isActive ? "fg.brand" : "fg.neutral"}
              background={activity.isActive ? "bg.brandWeak" : "bg.neutralWeak"}
              className="no-underline"
            >
              <a href={getActivityHref(activity.name)} target="_blank" rel="noreferrer">
                <Text
                  lineHeight="130%"
                  textStyle={activity.isActive ? "t2Bold" : "t2Regular"}
                  textDecorationLine="underline"
                  className="font-mono"
                >
                  {activity.name}
                </Text>
                <IconArrowUpRightFill size={10} className="flex-none" />
              </a>
            </HStack>
            <Text
              textStyle="t1Medium"
              className="font-mono"
              color={activity.transitionState.endsWith("active") ? "fg.brand" : "fg.neutralSubtle"}
            >
              {activity.transitionState}
            </Text>
          </VStack>
        ))}
    </Flex>
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

function Navigation({ url }: { url: string | null }) {
  if (!url)
    return (
      <Text
        className="font-mono transition-opacity opacity-0"
        align="center"
        textStyle="t1Medium"
        color="fg.neutralSubtle"
      >
        Loading...
      </Text>
    );

  const { origin, path } = formatUrl(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="font-mono transition-opacity opacity-100 text-center line-clamp-1 break-all decoration-neutral-400"
    >
      <Text textStyle="t1Medium" color="fg.neutralSubtle">
        {origin}
      </Text>
      <Text textStyle="t1Bold" color="fg.neutralMuted" className="empty:hidden">
        {path}
      </Text>
    </a>
  );
}

function getStackflowSpaUrl(path: string): string {
  const baseURL = (() => {
    if (process.env.NODE_ENV === "development") {
      // TODO: this can be better
      // 1. dev server can be at any host in a local network
      // 2. be in sync with actual dev server port
      return "http://localhost:5173";
    }

    // Branch previews
    // Docs URL: https://<branch>.seed-design.pages.dev
    // QA URL:   https://<branch>.seed-design-qa.pages.dev
    if (window.location.hostname.endsWith(".seed-design.pages.dev")) {
      const branch = window.location.hostname.split(".")[0];

      return `https://${branch}.seed-design-qa.pages.dev`;
    }

    // Production
    return "https://qa.seed-design.io";
  })();

  return new URL(path, baseURL).toString();
}

function getActivityGitHubUrl(activityName: string) {
  return `https://github.com/daangn/seed-design/blob/dev/examples/stackflow-spa/src/activities/${activityName}.tsx`;
}

function formatUrl(urlString: string) {
  const url = new URL(urlString);
  const path = url.toString().replace(new RegExp(`^${url.origin}`), "");

  if (path === "/") {
    return { origin: `${url.origin}/`, path: "" };
  }

  return { origin: url.origin, path };
}
