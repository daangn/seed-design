import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import { receive } from "@stackflow/compat-await-push";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";
import { useSnackbarAdapter, Snackbar, SnackbarAvoidOverlap } from "seed-design/ui/snackbar";
import { AppBar, AppBarLeft, AppBarMain, AppBarBackButton } from "seed-design/ui/app-bar";
import { useState, type FormEventHandler } from "react";
import {
  Divider,
  HStack,
  ScrollFog,
  Text,
  VStack,
  type unstable_StyleProps,
} from "@seed-design/react";
import { SegmentedControl, SegmentedControlItem } from "seed-design/ui/segmented-control";
import { ActionButton } from "seed-design/ui/action-button";
import { PageBanner } from "seed-design/ui/page-banner";
import { Checkbox, CheckboxGroup } from "seed-design/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "seed-design/ui/radio-group";
import {
  CheckSelectBox,
  CheckSelectBoxCheckmark,
  CheckSelectBoxGroup,
  RadioSelectBoxItem,
  RadioSelectBoxRadiomark,
  RadioSelectBoxRoot,
} from "seed-design/ui/select-box";
import { Slider } from "seed-design/ui/slider";
import { FieldButton, FieldButtonPlaceholder, FieldButtonValue } from "seed-design/ui/field-button";
import { AttachmentField, AttachmentInput } from "seed-design/ui/attachment-field";
import {
  IconExclamationmarkCircleFill,
  IconEnvelopeLine,
  IconFlameLine,
  IconTruckLine,
  IconPaperplaneTiltedLine,
  IconFigureWalkLine,
} from "@karrotmarket/react-monochrome-icon";
import { IconGift, IconWonShield } from "@karrotmarket/react-multicolor-icon";

declare module "@stackflow/config" {
  interface Register {
    ActivityForm: {};
  }
}

const formatter = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" });

const ActivityForm: StaticActivityComponentType<"ActivityForm"> = () => {
  const snackbar = useSnackbarAdapter();

  const { push } = useFlow();

  const [category, setCategory] = useState<{ value: string; label: string } | null>(null);
  const [bg, setBg] =
    useState<Extract<unstable_StyleProps["bg"], "bg.layerDefault" | "bg.layerBasement">>(
      "bg.layerDefault",
    );

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = Object.fromEntries(
      Array.from(new Set(formData.keys())).map((key) => [key, formData.getAll(key)]),
    );

    snackbar.create({
      render: () => <Snackbar message={JSON.stringify(payload)} />,
    });
  };

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Form Components</AppBarMain>
      </AppBar>
      <AppScreenContent>
        <VStack height="full">
          <VStack gap="x2" pb="x2" bg={bg} style={{ transition: "background-color 0.2s" }}>
            <PageBanner
              tone="warning"
              variant="solid"
              prefixIcon={<IconExclamationmarkCircleFill />}
              description="입력된 정보는 브라우저에 의해 자동완성될 수 있지만 다른 곳에 저장되지 않습니다. 그럼에도 실제 정보는 입력하지 마세요."
            />
            <VStack px="spacingX.globalGutter" align="center">
              <SegmentedControl
                defaultValue="bg.layerDefault"
                aria-label="배경색 선택"
                onValueChange={(value) => setBg(value as typeof bg)}
              >
                <SegmentedControlItem value="bg.layerDefault">Default</SegmentedControlItem>
                <SegmentedControlItem value="bg.layerBasement">Basement</SegmentedControlItem>
              </SegmentedControl>
            </VStack>
          </VStack>
          <VStack grow asChild justify="space-between" minHeight="0">
            <form onSubmit={onSubmit}>
              <ScrollFog placement={["bottom"]}>
                <VStack
                  gap="x4"
                  px="spacingX.globalGutter"
                  py="x4"
                  minHeight="0"
                  bg={bg}
                  style={{ transition: "background-color 0.2s" }}
                >
                  <TextField
                    name="name"
                    label="이름"
                    labelWeight="bold"
                    variant="underline"
                    required
                    showRequiredIndicator
                    description="이름을 입력해주세요."
                  >
                    <TextFieldInput placeholder="김하늘" autoComplete="name" />
                  </TextField>
                  <HStack gap="x2">
                    <TextField
                      name="email"
                      label="이메일"
                      indicator="필수"
                      description="이메일 형식으로 입력해주세요."
                      prefixIcon={<IconEnvelopeLine />}
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
                      description="상세 주소까지 입력해주세요."
                      maxGraphemeCount={100}
                    >
                      <TextFieldInput placeholder="대한민국 …" autoComplete="street-address" />
                    </TextField>
                  </HStack>
                  <Divider />
                  <FieldButton
                    label="카테고리 선택"
                    labelWeight="bold"
                    showRequiredIndicator
                    description="원하는 카테고리를 선택해주세요."
                    name="category"
                    values={category ? [category.value] : []}
                    buttonProps={{
                      onClick: async () => {
                        const result = await receive<{ value: string; label: string }>(
                          push("ActivityCategorySheet", { defaultValue: category?.value }),
                        );

                        if (result) setCategory(result);
                      },
                      "aria-label": `카테고리 선택${category ? `, 현재 선택됨: ${category.label}` : ""}`,
                    }}
                  >
                    {category ? (
                      <FieldButtonValue>{category.label}</FieldButtonValue>
                    ) : (
                      <FieldButtonPlaceholder>카테고리를 선택해주세요</FieldButtonPlaceholder>
                    )}
                  </FieldButton>
                  <RadioSelectBoxRoot
                    label="배송 방법 선택"
                    labelWeight="bold"
                    showRequiredIndicator
                    description="원하는 배송 방법을 선택해주세요."
                    name="shipping"
                    defaultValue="standard"
                    columns={2}
                  >
                    <RadioSelectBoxItem
                      value="express"
                      label="빠른 배송 (1-2일)"
                      prefixIcon={<IconFlameLine />}
                      suffix={<RadioSelectBoxRadiomark />}
                    />
                    <RadioSelectBoxItem
                      value="standard"
                      label="일반 배송 (3-5일)"
                      prefixIcon={<IconTruckLine />}
                      suffix={<RadioSelectBoxRadiomark />}
                    />
                    <RadioSelectBoxItem
                      value="drone"
                      label="드론 배송 (당일)"
                      prefixIcon={<IconPaperplaneTiltedLine />}
                      suffix={<RadioSelectBoxRadiomark />}
                    />
                    <RadioSelectBoxItem
                      value="pickup"
                      label="직접 수령"
                      prefixIcon={<IconFigureWalkLine />}
                      suffix={<RadioSelectBoxRadiomark />}
                      disabled
                    />
                  </RadioSelectBoxRoot>
                  <AttachmentField
                    label="첨부 파일"
                    labelWeight="bold"
                    indicator="선택"
                    description="사진, 영수증 등을 첨부해주세요. (최대 3장)"
                    name="attachments"
                    accept="image/*"
                    maxFiles={3}
                  >
                    <AttachmentInput />
                  </AttachmentField>
                  <Divider />
                  <CheckSelectBoxGroup
                    label="추가 서비스"
                    labelWeight="bold"
                    indicator="선택"
                    description="원하는 추가 서비스를 선택해주세요."
                  >
                    <CheckSelectBox
                      label="선물 포장"
                      description="고급 포장지로 선물 포장해 드립니다."
                      inputProps={{ name: "extra", value: "gift-wrap" }}
                      prefixIcon={<IconGift />}
                      suffix={<CheckSelectBoxCheckmark />}
                      footer={
                        <HStack px="x5" pb="x4" gap="x3" align="center">
                          <Text textStyle="t4Medium" color="fg.neutralMuted">
                            +3,000원이 추가됩니다.
                          </Text>
                        </HStack>
                      }
                    />
                    <CheckSelectBox
                      label="보험 가입"
                      description="배송 중 파손 시 100% 보상"
                      inputProps={{ name: "extra", value: "insurance" }}
                      prefixIcon={<IconWonShield />}
                      suffix={<CheckSelectBoxCheckmark />}
                      footer={
                        <HStack px="x5" pb="x4" gap="x3" align="center">
                          <Text textStyle="t4Medium" color="fg.neutralMuted">
                            +5,000원이 추가됩니다.
                          </Text>
                        </HStack>
                      }
                    />
                  </CheckSelectBoxGroup>
                  <Divider />
                  <CheckboxGroup
                    label="좋아하는 과일"
                    labelWeight="bold"
                    indicator="선택"
                    description="좋아하는 과일을 모두 선택해주세요."
                  >
                    <Checkbox
                      label="사과"
                      tone="neutral"
                      size="large"
                      inputProps={{ name: "fruit", value: "apple" }}
                    />
                    <Checkbox
                      label="바나나"
                      tone="neutral"
                      size="large"
                      inputProps={{ name: "fruit", value: "banana" }}
                    />
                    <Checkbox
                      label="오렌지"
                      tone="neutral"
                      size="large"
                      inputProps={{ name: "fruit", value: "orange" }}
                    />
                  </CheckboxGroup>
                  <Slider
                    label="얼마나 좋아하시나요?"
                    labelWeight="bold"
                    min={0}
                    max={10}
                    defaultValues={[5]}
                    ticks={[2, 4, 6, 8]}
                    markers={[
                      { value: 0, label: "별로" },
                      { value: 10, label: "최고" },
                    ]}
                    description="좋아하는 정도를 0~10 사이로 선택해주세요."
                    name="like-level"
                  />
                  <Divider />
                  <Slider
                    label="예산 범위"
                    indicator="선택"
                    invalid
                    errorMessage="Fugiat nisi exercitation incididunt qui incididunt in id laborum voluptate."
                    min={0}
                    max={1_000_000}
                    step={50_000}
                    defaultValues={[200_000, 500_000]}
                    description="원하는 예산 범위를 선택해주세요."
                    getAriaLabel={(i) => (i === 0 ? "최소" : "최대")}
                    getAriaValuetext={(i) => `${i}원`}
                    getValueIndicatorLabel={({ value }) => formatter.format(value)}
                    name="budget-range"
                  />
                  <Divider />
                  <RadioGroup
                    label="선호하는 연락 방법"
                    labelWeight="bold"
                    showRequiredIndicator
                    description="연락 받고 싶은 방법을 선택해주세요."
                    name="contact"
                    defaultValue="email"
                  >
                    <RadioGroupItem value="email" label="이메일" tone="neutral" size="large" />
                    <RadioGroupItem value="phone" label="전화" tone="neutral" size="large" />
                    <RadioGroupItem value="sms" label="문자" tone="neutral" size="large" />
                  </RadioGroup>
                  <CheckboxGroup
                    label="약관 동의"
                    showRequiredIndicator
                    description="서비스 이용을 위해 약관에 동의해주세요."
                  >
                    <Checkbox
                      label="이용약관 동의 (필수)"
                      tone="neutral"
                      size="large"
                      inputProps={{ name: "agreement", value: "terms" }}
                    />
                    <Checkbox
                      label="개인정보 처리방침 동의 (필수)"
                      tone="neutral"
                      size="large"
                      inputProps={{ name: "agreement", value: "privacy" }}
                    />
                    <Checkbox
                      label="마케팅 수신 동의 (선택)"
                      tone="neutral"
                      size="large"
                      inputProps={{ name: "agreement", value: "marketing" }}
                    />
                  </CheckboxGroup>
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
export default ActivityForm;
