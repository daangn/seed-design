import type { Meta, StoryObj } from "@storybook/nextjs";
import type { WheelPickerOption } from "@seed-design/react-wheel-picker";
import { Grid, Text, VStack } from "@seed-design/react";
import * as React from "react";
import {
  InternalWheelPickerColumn,
  InternalWheelPickerRoot,
} from "../../packages/react/src/components/private/WheelPicker";
import "./InternalWheelPicker.css";
import { SeedThemeDecorator } from "./components/decorator";
import { VariantTable } from "./components/variant-table";
import { createStoryWithParameters } from "./utils/parameters";

interface ColumnCase {
  label: string;
  options: WheelPickerOption[];
  loop: boolean;
  defaultValue?: string;
}

interface WheelPickerCaseProps {
  label: string;
  columns: ColumnCase[];
}

const createNumberOptions = (start: number, end: number, padStart = 0): WheelPickerOption[] =>
  Array.from({ length: end - start + 1 }, (_, index) => {
    const value = String(start + index);

    return {
      value,
      label: value.padStart(padStart, "0"),
    };
  });

const createTextOptions = (...values: string[]): WheelPickerOption[] =>
  values.map((value) => ({ value, label: value }));

const conditionMap = {
  case: {
    "2개 컬럼 / 반복 없음": {
      label: "화면 설정",
      columns: [
        {
          label: "테마",
          options: createTextOptions("라이트", "시스템", "다크"),
          loop: false,
          defaultValue: "시스템",
        },
        {
          label: "밀도",
          options: createTextOptions("좁게", "보통", "넓게"),
          loop: false,
          defaultValue: "보통",
        },
      ],
    },
    "2개 컬럼 / 모두 반복": {
      label: "2차원 좌표",
      columns: [
        { label: "X", options: createNumberOptions(0, 9), loop: true, defaultValue: "4" },
        { label: "Y", options: createNumberOptions(0, 9), loop: true, defaultValue: "7" },
      ],
    },
    "2개 컬럼 / 혼합": {
      label: "수량 선택",
      columns: [
        {
          label: "단위",
          options: createTextOptions("개", "묶음", "상자"),
          loop: false,
          defaultValue: "묶음",
        },
        { label: "수량", options: createNumberOptions(1, 12), loop: true, defaultValue: "6" },
      ],
    },
    "3개 컬럼 / 반복 없음": {
      label: "RGB 색상",
      columns: ["R", "G", "B"].map((label, index) => ({
        label,
        options: createNumberOptions(0, 255, 3),
        loop: false,
        defaultValue: String([64, 128, 192][index]),
      })),
    },
    "3개 컬럼 / 모두 반복": {
      label: "버전 번호",
      columns: ["Major", "Minor", "Patch"].map((label, index) => ({
        label,
        options: createNumberOptions(0, 9),
        loop: true,
        defaultValue: String([2, 4, 1][index]),
      })),
    },
    "3개 컬럼 / 혼합": {
      label: "상품 옵션",
      columns: [
        {
          label: "색상",
          options: createTextOptions("검정", "회색", "흰색"),
          loop: false,
          defaultValue: "회색",
        },
        { label: "너비", options: createNumberOptions(90, 120), loop: true, defaultValue: "100" },
        { label: "높이", options: createNumberOptions(90, 120), loop: true, defaultValue: "110" },
      ],
    },
    "4개 컬럼 / 반복 없음": {
      label: "검색 필터",
      columns: [
        {
          label: "범위",
          options: createTextOptions("전체", "제목", "본문"),
          loop: false,
          defaultValue: "전체",
        },
        {
          label: "정렬",
          options: createTextOptions("최신", "관련", "인기"),
          loop: false,
          defaultValue: "관련",
        },
        {
          label: "기간",
          options: createTextOptions("전체", "오늘", "이번 주"),
          loop: false,
          defaultValue: "오늘",
        },
        {
          label: "상태",
          options: createTextOptions("전체", "진행", "완료"),
          loop: false,
          defaultValue: "진행",
        },
      ],
    },
    "4개 컬럼 / 모두 반복": {
      label: "4자리 코드",
      columns: ["첫째", "둘째", "셋째", "넷째"].map((label, index) => ({
        label,
        options: createTextOptions(
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
        ),
        loop: true,
        defaultValue: ["2", "A", "7", "F"][index],
      })),
    },
    "4개 컬럼 / 혼합": {
      label: "배송 조건",
      columns: [
        {
          label: "국가",
          options: createTextOptions("한국", "일본", "미국"),
          loop: false,
          defaultValue: "한국",
        },
        {
          label: "권역",
          options: createTextOptions("동부", "중부", "서부"),
          loop: false,
          defaultValue: "중부",
        },
        { label: "월", options: createNumberOptions(1, 12), loop: true, defaultValue: "7" },
        { label: "일", options: createNumberOptions(1, 31), loop: true, defaultValue: "27" },
      ],
    },
  },
} satisfies Record<string, Record<string, WheelPickerCaseProps>>;

function WheelPickerCase({ label, columns }: WheelPickerCaseProps) {
  const [values, setValues] = React.useState(() =>
    columns.map(
      (column) =>
        column.defaultValue ?? column.options[Math.floor(column.options.length / 2)]?.value ?? "",
    ),
  );

  const handleValueChange = React.useCallback((columnIndex: number, nextValue: string) => {
    setValues((currentValues) =>
      currentValues.map((currentValue, index) =>
        index === columnIndex ? nextValue : currentValue,
      ),
    );
  }, []);

  return (
    <VStack gap="x3">
      <Text fontSize="t5" fontWeight="bold">
        {label}
      </Text>
      <Grid width="320px" columns={columns.length}>
        {columns.map((column) => (
          <Text
            key={column.label}
            as="p"
            align="center"
            fontSize="t2"
            fontWeight={column.loop ? "bold" : "regular"}
            color={column.loop ? "fg.neutral" : "fg.neutralMuted"}
          >
            {column.label} · {column.loop ? "loop" : "finite"}
          </Text>
        ))}
      </Grid>
      <InternalWheelPickerRoot
        aria-label={label}
        itemSize={44}
        visibleItemCount={5}
        fogSize={52}
        className="internal-wheel-picker"
        selectionIndicatorClassName="internal-wheel-picker__selection-indicator"
      >
        {columns.map((column, columnIndex) => (
          <InternalWheelPickerColumn
            key={column.label}
            aria-label={column.label}
            options={column.options}
            value={values[columnIndex]}
            onValueChange={(nextValue) => handleValueChange(columnIndex, nextValue)}
            loop={column.loop}
            data-loop={column.loop ? "" : undefined}
            data-finite={column.loop ? undefined : ""}
            className="internal-wheel-picker__column"
            itemClassName="internal-wheel-picker__item"
          />
        ))}
      </InternalWheelPickerRoot>
      <Text as="p" fontSize="t4" color="fg.neutralMuted" aria-live="polite">
        선택값: {values.join(" · ")}
      </Text>
    </VStack>
  );
}

const meta = {
  title: "Internal/WheelPicker",
  component: WheelPickerCase,
  decorators: [SeedThemeDecorator],
} satisfies Meta<typeof WheelPickerCase>;

export default meta;

type Story = StoryObj<typeof meta>;

const CommonStory: Story = {
  args: conditionMap.case["2개 컬럼 / 반복 없음"],
  render: (args) => (
    <VariantTable
      Component={meta.component}
      variantMap={{}}
      conditionMap={conditionMap}
      {...args}
    />
  ),
};

export const LightTheme = CommonStory;

export const DarkTheme = createStoryWithParameters({
  ...CommonStory,
  parameters: { theme: "dark" },
});

export const FontScalingExtraSmall = createStoryWithParameters({
  ...CommonStory,
  parameters: { fontScale: "Extra Small" },
});

export const FontScalingExtraExtraExtraLarge = createStoryWithParameters({
  ...CommonStory,
  parameters: { fontScale: "Extra Extra Extra Large" },
});
