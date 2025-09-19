import { useState } from "react";
import { type ActivityComponentType } from "@stackflow/react/future";
import { AppBar, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TabsRoot, TabsTrigger, TabsList } from "seed-design/ui/tabs";
import { ErrorState } from "seed-design/ui/error-state";
import { SnackbarProvider } from "seed-design/ui/snackbar";
import { Recommendations } from "@/examples/react/demo/tabs/recommendations";

declare module "@stackflow/config" {
  interface Register {
    "demo/index": unknown;
  }
}

const TABS = [
  { label: "추천", value: "recommendations" },
  { label: "구독", value: "subscriptions" },
] as const satisfies {
  label: string;
  value: string;
}[];

type Tab = (typeof TABS)[number]["value"];

const DemoActivity: ActivityComponentType<"demo/index"> = () => {
  const [tab, setTab] = useState<Tab>("recommendations");

  return (
    <SnackbarProvider>
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: "::-webkit-scrollbar{display:none}",
        }}
      />
      <AppScreen>
        <AppBar tone="layer">
          <AppBarMain title="Demo" />
        </AppBar>
        <AppScreenContent>
          <TabsRoot
            value={tab}
            onValueChange={(value) => setTab(value as Tab)}
            triggerLayout="fill"
            size="medium"
            stickyList
            style={{ height: "100%", overflowY: "auto" }}
          >
            <TabsList>
              {TABS.map(({ label, value }) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tab === "recommendations" && <Recommendations />}
            {tab === "subscriptions" && (
              <ErrorState
                title="구독한 글이 없습니다."
                description="추천 글을 확인해보세요."
                primaryActionProps={{
                  children: "추천 글 보기",
                  onClick: () => setTab("recommendations"),
                }}
              />
            )}
          </TabsRoot>
        </AppScreenContent>
      </AppScreen>
    </SnackbarProvider>
  );
};

export default DemoActivity;
