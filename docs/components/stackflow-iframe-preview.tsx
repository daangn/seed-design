"use client";

import type { Activity } from "@stackflow/core";
import { Box, Flex, HStack, PrefixIcon, SuffixIcon, Text, VStack } from "@seed-design/react";
import {
  IconArrowUpRightFill,
  IconChevronLeftLine,
  IconChevronRightLine,
} from "@karrotmarket/react-monochrome-icon";
import { useEffect, useRef, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import { ProgressCircle } from "seed-design/ui/progress-circle";
import { Switch } from "seed-design/ui/switch";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { useSimpleReveal } from "simple-reveal";
import type { AppScreenVariant } from "@seed-design/css/recipes/app-screen";

interface StackflowIframePreviewProps {
  path: string;
}

type SerializedActivity = Pick<Activity, "id" | "name" | "isActive" | "transitionState">;

export function StackflowIframePreview({ path }: StackflowIframePreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [activityStack, setActivityStack] = useState<SerializedActivity[]>([]);
  const [theme, setTheme] = useState<AppScreenVariant["theme"]>("android");
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

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage({ type: "THEME_CHANGE", theme }, "*");
  }, [theme]);

  const handleBack = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "NAVIGATE_BACK" }, "*");
  };

  const handleForward = () => {
    iframeRef.current?.contentWindow?.postMessage({ type: "NAVIGATE_FORWARD" }, "*");
  };

  const { cn, ref, style } = useSimpleReveal({
    delay: 200,
    rootMargin: "-200px",
    initialTransform: "scale(0.95)",
  });

  return (
    <VStack gap="x8" align="center" width="full" className={cn()} style={style} ref={ref}>
      <HStack gap="x8" wrap justify="center">
        <VStack align="center" gap="spacingY.componentDefault">
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
          <SegmentedControl
            aria-label="Theme"
            disabled={!isLoaded}
            value={theme}
            onValueChange={(value) => setTheme(value as AppScreenVariant["theme"])}
          >
            <SegmentedControlItem value="android">android</SegmentedControlItem>
            <SegmentedControlItem value="cupertino">cupertino</SegmentedControlItem>
          </SegmentedControl>
        </VStack>
        <ActivityStackPanel
          disabled={!isLoaded}
          activities={activityStack}
          getActivityHref={getActivityGitHubUrl}
        />
      </HStack>
      <Navigation url={currentUrl} onBack={handleBack} onForward={handleForward} />
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
  disabled,
  activities,
  getActivityHref,
}: {
  disabled?: boolean;
  activities: SerializedActivity[];
  getActivityHref: (activityName: string) => string;
}) {
  const [hideExitDone, setHideExitDone] = useState(true);

  const filteredActivities = activities.filter(
    (activity) => !(hideExitDone && activity.transitionState === "exit-done"),
  );

  return (
    <VStack gap="x4" justify="space-between" align="flex-start">
      <Flex gap="x2" direction="column-reverse" width="300px" grow>
        {filteredActivities.map((activity) => (
          <VStack key={activity.id} gap="x2" align="flex-start">
            <HStack
              asChild
              minWidth="200px"
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
                  textStyle={activity.isActive ? "t2Bold" : "t2Regular"}
                  textDecorationLine="underline"
                  className="font-mono"
                >
                  {activity.name}
                </Text>
                <IconArrowUpRightFill size={12} />
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
      <Switch
        size="16"
        tone="neutral"
        label="Hide exit-done activities"
        checked={hideExitDone}
        onCheckedChange={setHideExitDone}
        disabled={disabled}
      />
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
      <HStack gap="x1_5" align="center">
        <ActionButton variant="ghost" size="small" onClick={onBack} disabled={!url}>
          <PrefixIcon svg={<IconChevronLeftLine />} />
          Back
        </ActionButton>
        <ActionButton variant="ghost" size="small" onClick={onForward} disabled={!url}>
          Forward
          <SuffixIcon svg={<IconChevronRightLine />} />
        </ActionButton>
      </HStack>
      {url ? (
        (() => {
          const { origin, path } = formatUrl(url);

          return (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="font-mono transition-opacity opacity-100 text-center line-clamp-1 break-all"
            >
              <Text textStyle="t1Medium" color="fg.neutralSubtle">
                {origin}
              </Text>
              <Text textStyle="t1Bold" color="fg.neutral" className="empty:hidden">
                {path}
              </Text>
            </a>
          );
        })()
      ) : (
        <Text
          className="font-mono transition-opacity opacity-0"
          align="center"
          textStyle="t1Medium"
          color="fg.neutralSubtle"
        >
          Loading...
        </Text>
      )}
    </VStack>
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
    return "https://seed-design-qa.pages.dev";
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
