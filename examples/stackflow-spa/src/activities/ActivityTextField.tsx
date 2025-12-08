import type { StaticActivityComponentType } from "@stackflow/react/future";

import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useSnackbarAdapter, Snackbar, SnackbarAvoidOverlap } from "seed-design/ui/snackbar";
import { AppBar, AppBarLeft, AppBarMain, AppBarBackButton } from "seed-design/ui/app-bar";
import { useRef, type FormEventHandler } from "react";
import { ScrollFog, Text, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";
import { PageBanner } from "seed-design/ui/page-banner";
import {
  IconExclamationmarkCircleFill,
  IconHashLine,
  IconLocationpinFill,
} from "@karrotmarket/react-monochrome-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityTextField: {};
  }
}

const ActivityTextField: StaticActivityComponentType<"ActivityTextField"> = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const snackbar = useSnackbarAdapter();

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    if (!formRef.current) return;

    event.preventDefault();

    const formData = new FormData(formRef.current);

    snackbar.create({
      render: () => <Snackbar message={JSON.stringify(Object.fromEntries(formData.entries()))} />,
    });
  };

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Text Field</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <VStack height="full">
          <VStack>
            <PageBanner
              tone="warning"
              variant="solid"
              prefixIcon={<IconExclamationmarkCircleFill />}
              description="입력된 정보는 브라우저에 의해 자동완성될 수 있지만 다른 곳에 저장되지 않습니다. 그럼에도 실제 정보는 입력하지 마세요."
            />
          </VStack>
          <VStack grow asChild justify="space-between" minHeight="0">
            <form ref={formRef} onSubmit={onSubmit}>
              <ScrollFog placement={["bottom"]}>
                <VStack
                  gap="spacingY.componentDefault"
                  px="spacingX.globalGutter"
                  py="x3"
                  minHeight="0"
                >
                  <TextField
                    name="name"
                    label="이름"
                    required
                    showRequiredIndicator
                    description="이름을 입력해주세요."
                  >
                    <TextFieldInput placeholder="김하늘" autoComplete="name" />
                  </TextField>
                  <TextField
                    name="email"
                    label="이메일"
                    required
                    showRequiredIndicator
                    description="이메일 형식으로 입력해주세요."
                  >
                    <TextFieldInput
                      placeholder="foo@bar.baz"
                      inputMode="email"
                      autoComplete="email"
                    />
                  </TextField>
                  <TextField
                    name="address"
                    label="주소"
                    required
                    showRequiredIndicator
                    maxGraphemeCount={100}
                    prefixIcon={<IconLocationpinFill />}
                    suffix="KR"
                  >
                    <TextFieldInput placeholder="대한민국 …" autoComplete="street-address" />
                  </TextField>
                  <VStack
                    p="x3"
                    bg="bg.layerBasement"
                    borderRadius="r4"
                    borderWidth={1}
                    borderColor="stroke.neutralMuted"
                    gap="x4"
                  >
                    <Text textStyle="t2Bold">layer-basement</Text>
                    <TextField
                      name="phone"
                      label="휴대폰 번호"
                      indicator="layer-basement"
                      prefixIcon={<IconHashLine />}
                      required
                      showRequiredIndicator
                    >
                      <TextFieldInput
                        placeholder="010-1234-5678"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </TextField>
                    <TextField
                      name="phone2"
                      prefixIcon={<IconHashLine />}
                      required
                      showRequiredIndicator
                      variant="underline"
                    >
                      <TextFieldInput
                        placeholder="010-1234-5678"
                        inputMode="tel"
                        autoComplete="tel"
                      />
                    </TextField>
                  </VStack>
                </VStack>
              </ScrollFog>
              <SnackbarAvoidOverlap>
                <VStack
                  px="spacingX.globalGutter"
                  pb="safeArea"
                  gap="x2"
                  width="full"
                  style={{ boxSizing: "border-box" }}
                >
                  <VStack py="x3">
                    <ActionButton flexGrow variant="neutralSolid" size="large" type="submit">
                      제출
                    </ActionButton>
                  </VStack>
                </VStack>
              </SnackbarAvoidOverlap>
            </form>
          </VStack>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityTextField;
