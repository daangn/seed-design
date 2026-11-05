import { VStack } from "@seed-design/react";
import type { StaticActivityComponentType } from "@stackflow/react/future";
import { ActionButton } from "seed-design/ui/action-button";
import { AppBar, AppBarBackButton, AppBarLeft, AppBarMain } from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TextField, TextFieldTextarea } from "seed-design/ui/text-field";

declare module "@stackflow/config" {
  interface Register {
    ActivityE2ETextareaAutoresizeScroll: {};
  }
}

const LONG_VALUE = Array.from({ length: 40 }, (_, index) => `${index + 1}번째 줄`).join("\n");

const ActivityE2ETextareaAutoresizeScroll: StaticActivityComponentType<
  "ActivityE2ETextareaAutoresizeScroll"
> = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>E2E Textarea Autoresize Scroll</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <VStack gap="x4" p="x5">
          <TextField label="본문" defaultValue={LONG_VALUE}>
            <TextFieldTextarea data-testid="autoresize-textarea" />
          </TextField>
          <ActionButton size="large" variant="neutralSolid">
            게시
          </ActionButton>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityE2ETextareaAutoresizeScroll;
