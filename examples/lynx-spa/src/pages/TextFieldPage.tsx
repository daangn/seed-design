import IconChevronDownFill from "@karrotmarket/lynx-monochrome-icon/IconChevronDownFill";
import IconMagnifyingglassLine from "@karrotmarket/lynx-monochrome-icon/IconMagnifyingglassLine";
import IconPlusCircleFill from "@karrotmarket/lynx-monochrome-icon/IconPlusCircleFill";
import IconPlusFill from "@karrotmarket/lynx-monochrome-icon/IconPlusFill";
import IconWonLine from "@karrotmarket/lynx-monochrome-icon/IconWonLine";
import { useCallback, useState } from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { textInput } from "@seed-design/lynx-css/recipes/text-input";
import { KeyboardAvoidingScrollView } from "@seed-design/lynx-react";

import { Checkbox } from "../seed-design/ui/checkbox";
import {
  TextField,
  type TextFieldProps,
  TextFieldInput,
  TextFieldTextarea,
  type TextFieldTextareaProps,
} from "../seed-design/ui/text-field";

type DebugLayout = {
  width: number;
  height: number;
};

type DebugTextLayoutChangeHandler = NonNullable<IntrinsicElements["text"]["bindlayoutchange"]>;
type DebugViewLayoutChangeHandler = NonNullable<IntrinsicElements["view"]["bindlayoutchange"]>;

const introductionTextareaClasses = textInput({ variant: "outline", size: "large" });

function IntroductionTextareaExample() {
  const [introduction, setIntroduction] = useState("소개 입력 예시 (반가워요)");
  const [nativeLayout, setNativeLayout] = useState<DebugLayout | null>(null);
  const [mirrorTextLayout, setMirrorTextLayout] = useState<DebugLayout | null>(null);
  const [mirrorRootLayout, setMirrorRootLayout] = useState<DebugLayout | null>(null);
  const [nativeHeightHistory, setNativeHeightHistory] = useState<number[]>([]);
  const [mirrorHeightHistory, setMirrorHeightHistory] = useState<number[]>([]);

  const handleIntroductionValueChange: NonNullable<TextFieldProps["onValueChange"]> = ({
    slicedValue,
  }) => {
    "background only";
    setIntroduction(slicedValue);
  };

  const handleNativeLayoutChange = useCallback<
    NonNullable<TextFieldTextareaProps["bindlayoutchange"]>
  >((event) => {
    "background only";

    const nextLayout = { width: event.detail.width, height: event.detail.height };
    setNativeLayout((current) =>
      current?.width === nextLayout.width && current.height === nextLayout.height
        ? current
        : nextLayout,
    );
    setNativeHeightHistory((current) => {
      if (current[current.length - 1] === nextLayout.height) return current;
      return [...current, nextLayout.height].slice(-8);
    });
  }, []);

  const handleMirrorTextLayoutChange = useCallback<DebugTextLayoutChangeHandler>((event) => {
    "background only";

    const nextLayout = { width: event.detail.width, height: event.detail.height };
    setMirrorTextLayout((current) =>
      current?.width === nextLayout.width && current.height === nextLayout.height
        ? current
        : nextLayout,
    );
    setMirrorHeightHistory((current) => {
      if (current[current.length - 1] === nextLayout.height) return current;
      return [...current, nextLayout.height].slice(-8);
    });
  }, []);

  const handleMirrorRootLayoutChange = useCallback<DebugViewLayoutChangeHandler>((event) => {
    "background only";

    const nextLayout = { width: event.detail.width, height: event.detail.height };
    setMirrorRootLayout((current) =>
      current?.width === nextLayout.width && current.height === nextLayout.height
        ? current
        : nextLayout,
    );
  }, []);

  const lineCount = introduction.split("\n").length;
  const nativeTextDelta =
    nativeLayout && mirrorTextLayout ? nativeLayout.height - mirrorTextLayout.height : null;
  const nativeBoxDelta =
    nativeLayout && mirrorRootLayout ? nativeLayout.height - mirrorRootLayout.height : null;
  const mirrorValue = `${introduction}\u200b`;

  return (
    <view className="flex flex-col gap-x2">
      <TextField
        label="소개"
        value={introduction}
        maxGraphemeCount={80}
        onValueChange={handleIntroductionValueChange}
        description="내용에 따라 높이가 자동으로 늘어납니다."
      >
        <TextFieldTextarea
          id="text-field-debug-native-textarea"
          accessibility-label="소개"
          placeholder="여러 줄 소개를 입력해 주세요"
          android-set-soft-input-mode="nothing"
          bindlayoutchange={handleNativeLayoutChange}
        />
      </TextField>

      <view className="flex flex-col gap-x1_5 rounded-r2 bg-bg-neutral-weak py-x2">
        <view className="flex flex-col gap-x0_5 px-x3">
          <text className="t3-bold text-fg-critical">DEBUG · Textarea intrinsic</text>
          <text className="t2-regular text-fg-neutral-subtle">
            {`줄 ${lineCount} · trailing newline ${introduction.endsWith("\n") ? "yes" : "no"}`}
          </text>
          <text className="t2-regular text-fg-neutral-subtle">
            text reference 16sp / 22sp · Android native line-spacing 3.2px 보정
          </text>
          <text className="t2-regular text-fg-neutral-subtle">
            {`native border-box ${nativeLayout?.width ?? "-"}×${nativeLayout?.height ?? "-"} · reference root ${mirrorRootLayout?.width ?? "-"}×${mirrorRootLayout?.height ?? "-"}`}
          </text>
          <text className="t2-regular text-fg-neutral-subtle">
            {`box delta ${nativeBoxDelta ?? "-"} · Android native가 vertical padding 소유`}
          </text>
          <text className="t2-regular text-fg-neutral-subtle">
            {`reference text ${mirrorTextLayout?.width ?? "-"}×${mirrorTextLayout?.height ?? "-"} · text delta ${nativeTextDelta ?? "-"}`}
          </text>
          <text className="t2-regular text-fg-neutral-subtle">
            {`native border-box H ${nativeHeightHistory.join(" → ") || "-"}`}
          </text>
          <text className="t2-regular text-fg-neutral-subtle">
            {`reference text H ${mirrorHeightHistory.join(" → ") || "-"}`}
          </text>
        </view>

        <view
          id="text-field-debug-mirror-root"
          className={`${introductionTextareaClasses.root} bg-bg-layer-default`}
        >
          <view
            className={`${introductionTextareaClasses.textareaRoot} ${introductionTextareaClasses.textareaAutoresizeRoot} bg-bg-neutral-weak`}
            bindlayoutchange={handleMirrorRootLayoutChange}
          >
            <text
              id="text-field-debug-mirror-text"
              className={`${introductionTextareaClasses.value} ${introductionTextareaClasses.textareaValue} bg-bg-brand-weak`}
              bindlayoutchange={handleMirrorTextLayoutChange}
            >
              {mirrorValue}
            </text>
          </view>
        </view>
      </view>
    </view>
  );
}

function LayoutComparisonExample() {
  const [comparisonValue, setComparisonValue] = useState("제목 입력 예시");
  const [isComparisonOverlapped, setIsComparisonOverlapped] = useState(false);

  const handleComparisonValueChange: NonNullable<TextFieldProps["onValueChange"]> = ({
    slicedValue,
  }) => {
    "background only";
    setComparisonValue(slicedValue);
  };

  const handleComparisonOverlapChange = (checked: boolean) => {
    "background only";
    setIsComparisonOverlapped(checked);
  };

  const comparisonFieldClassName = isComparisonOverlapped
    ? "absolute top-0 right-0 bottom-0 left-0 opacity-50"
    : "flex-1 min-w-0";

  return (
    <view className="flex flex-col gap-x3">
      <text className="t5-bold text-fg-neutral">활성화/비활성화 레이아웃 비교</text>

      <view className="flex flex-row gap-x2">
        <text className="flex-1 t3-medium text-fg-neutral-muted">활성화</text>
        <text className="flex-1 t3-medium text-fg-neutral-muted">비활성화</text>
      </view>

      <view
        id="text-field-layout-comparison"
        className={isComparisonOverlapped ? "relative h-x13" : "flex flex-row gap-x2 h-x13"}
      >
        <view id="text-field-layout-enabled" className={comparisonFieldClassName}>
          <TextField value={comparisonValue} onValueChange={handleComparisonValueChange}>
            <TextFieldInput
              id="text-field-layout-enabled-input"
              accessibility-label="활성화된 비교 입력"
            />
          </TextField>
        </view>

        <view id="text-field-layout-disabled" className={comparisonFieldClassName}>
          <TextField value={comparisonValue} disabled>
            <TextFieldInput
              id="text-field-layout-disabled-input"
              accessibility-label="비활성화된 비교 입력"
            />
          </TextField>
        </view>
      </view>

      <view id="text-field-layout-overlap-toggle">
        <Checkbox
          label="두 필드 겹쳐 보기"
          checked={isComparisonOverlapped}
          onCheckedChange={handleComparisonOverlapChange}
        />
      </view>
    </view>
  );
}

export function TextFieldPage() {
  return (
    <KeyboardAvoidingScrollView className="flex flex-col flex-1 px-x4 pb-x10">
      <view className="flex flex-col gap-x6">
        <text className="t8-bold text-fg-neutral">TextField</text>

        <text className="t5-bold text-fg-neutral">Field</text>

        <TextField
          label="제목"
          required
          showRequiredIndicator
          name="title"
          description="한 줄 native input 예시입니다."
        >
          <TextFieldInput accessibility-label="제목" placeholder="제목을 입력해 주세요" />
        </TextField>

        <TextField
          label="선택 필드"
          labelWeight="bold"
          indicator="선택"
          description="굵은 라벨과 선택 indicator 예시입니다."
        >
          <TextFieldInput accessibility-label="선택 필드" placeholder="선택 사항을 입력해 주세요" />
        </TextField>

        <TextField
          label="오류 상태"
          defaultValue="유효하지 않은 값"
          invalid
          errorMessage="오류가 발생한 이유를 써주세요."
          maxGraphemeCount={20}
        >
          <TextFieldInput accessibility-label="오류 상태 입력" />
        </TextField>

        <TextField
          label="읽기 전용"
          defaultValue="읽기만 가능한 값"
          readOnly
          description="포커스와 값 변경이 제한되는지 확인합니다."
        >
          <TextFieldInput accessibility-label="읽기 전용 입력" />
        </TextField>

        <TextField label="비활성화" defaultValue="수정할 수 없는 값" disabled>
          <TextFieldInput accessibility-label="비활성화된 입력" />
        </TextField>

        <text className="t5-bold text-fg-neutral">Text Input</text>

        <TextField
          label="URL"
          prefix="https://"
          suffix=".com"
          description="prefix와 suffix text 예시입니다."
        >
          <TextFieldInput accessibility-label="URL" placeholder="example" />
        </TextField>

        <TextField
          label="아이콘 조합"
          prefixIcon={<IconPlusFill />}
          suffixIcon={<IconChevronDownFill />}
          description="prefixIcon과 suffixIcon 예시입니다."
        >
          <TextFieldInput accessibility-label="아이콘 조합 입력" placeholder="값을 입력해 주세요" />
        </TextField>

        <text className="t4-bold text-fg-neutral">Size × Variant</text>

        <TextField label="Outline Large" size="large" description="52px 높이">
          <TextFieldInput
            id="text-field-outline-large"
            accessibility-label="Outline Large 입력"
            placeholder="outline / large"
          />
        </TextField>

        <TextField label="Outline Medium" size="medium" description="40px 높이">
          <TextFieldInput
            id="text-field-outline-medium"
            accessibility-label="Outline Medium 입력"
            placeholder="outline / medium"
          />
        </TextField>

        <TextField variant="underline" size="large" description="underline / large">
          <TextFieldInput
            id="text-field-underline-large"
            accessibility-label="Underline Large 입력"
            placeholder="underline / large"
          />
        </TextField>

        <TextField variant="underline" size="medium" description="underline / medium">
          <TextFieldInput
            id="text-field-underline-medium"
            accessibility-label="Underline Medium 입력"
            placeholder="underline / medium"
          />
        </TextField>

        <text className="t4-bold text-fg-neutral">Outline Affix</text>

        <TextField label="Prefix Text" prefix="https://">
          <TextFieldInput
            accessibility-label="Outline Prefix Text 입력"
            placeholder="example.com"
          />
        </TextField>

        <TextField label="Prefix Icon" prefixIcon={<IconMagnifyingglassLine />}>
          <TextFieldInput accessibility-label="Outline Prefix Icon 입력" placeholder="검색" />
        </TextField>

        <TextField label="Suffix Text" suffix="cm">
          <TextFieldInput accessibility-label="Outline Suffix Text 입력" placeholder="200" />
        </TextField>

        <TextField label="Suffix Icon" suffixIcon={<IconWonLine />}>
          <TextFieldInput accessibility-label="Outline Suffix Icon 입력" placeholder="50,000" />
        </TextField>

        <TextField label="Both Text" prefix="만" suffix="세">
          <TextFieldInput accessibility-label="Outline Both Text 입력" placeholder="나이" />
        </TextField>

        <TextField
          label="Both Icons"
          prefixIcon={<IconPlusCircleFill />}
          suffixIcon={<IconWonLine />}
        >
          <TextFieldInput accessibility-label="Outline Both Icons 입력" placeholder="금액" />
        </TextField>

        <text className="t4-bold text-fg-neutral">Underline Affix</text>

        <TextField variant="underline" description="prefix text" prefix="https://">
          <TextFieldInput
            id="text-field-underline-prefix-text"
            accessibility-label="Underline Prefix Text 입력"
            placeholder="example.com"
          />
        </TextField>

        <TextField
          variant="underline"
          description="prefix icon"
          prefixIcon={<IconMagnifyingglassLine />}
        >
          <TextFieldInput
            id="text-field-underline-prefix-icon"
            accessibility-label="Underline Prefix Icon 입력"
            placeholder="검색"
          />
        </TextField>

        <TextField variant="underline" description="suffix text" suffix="cm">
          <TextFieldInput
            id="text-field-underline-suffix-text"
            accessibility-label="Underline Suffix Text 입력"
            placeholder="200"
          />
        </TextField>

        <TextField
          variant="underline"
          description="suffix icon — 오른쪽 클리핑 확인"
          suffixIcon={<IconWonLine />}
        >
          <TextFieldInput
            id="text-field-underline-suffix-icon"
            accessibility-label="Underline Suffix Icon 입력"
            placeholder="50,000"
          />
        </TextField>

        <TextField variant="underline" description="prefix/suffix text" prefix="만" suffix="세">
          <TextFieldInput
            id="text-field-underline-both-text"
            accessibility-label="Underline Both Text 입력"
            placeholder="나이"
          />
        </TextField>

        <TextField
          variant="underline"
          description="prefix/suffix icon — 양쪽 클리핑 확인"
          prefixIcon={<IconPlusCircleFill />}
          suffixIcon={<IconWonLine />}
        >
          <TextFieldInput
            id="text-field-underline-both-icons"
            accessibility-label="Underline Both Icons 입력"
            placeholder="금액"
          />
        </TextField>

        <TextField
          variant="underline"
          size="medium"
          description="medium prefix/suffix icon — 양쪽 클리핑 확인"
          prefixIcon={<IconPlusCircleFill />}
          suffixIcon={<IconChevronDownFill />}
        >
          <TextFieldInput
            id="text-field-underline-medium-both-icons"
            accessibility-label="Underline Medium Both Icons 입력"
            placeholder="옵션 선택"
          />
        </TextField>

        <TextField
          size="medium"
          label="Outline Medium Both Icons"
          prefixIcon={<IconPlusCircleFill />}
          suffixIcon={<IconChevronDownFill />}
        >
          <TextFieldInput
            id="text-field-outline-medium-both-icons"
            accessibility-label="Outline Medium Both Icons 입력"
            placeholder="옵션 선택"
          />
        </TextField>

        <text className="t5-bold text-fg-neutral">Textarea</text>

        <IntroductionTextareaExample />

        <TextField
          label="오류 상태"
          invalid
          errorMessage="소개를 다시 확인해 주세요."
          maxGraphemeCount={40}
        >
          <TextFieldTextarea
            accessibility-label="오류 상태 여러 줄 입력"
            placeholder="여러 줄 값을 입력해 주세요"
          />
        </TextField>

        <TextField
          label="읽기 전용"
          defaultValue="읽기만 가능한 여러 줄 값입니다."
          readOnly
          description="textarea의 readOnly 상태 예시입니다."
        >
          <TextFieldTextarea accessibility-label="읽기 전용 여러 줄 입력" />
        </TextField>

        <TextField
          variant="underline"
          size="medium"
          defaultValue="비활성화된 여러 줄 값입니다."
          disabled
          description="underline / medium / disabled 조합입니다."
        >
          <TextFieldTextarea accessibility-label="비활성화된 여러 줄 입력" />
        </TextField>

        <text className="t4-bold text-fg-neutral">Textarea Size × Variant</text>

        <TextField label="Outline Large Textarea" size="large">
          <TextFieldTextarea
            accessibility-label="Outline Large Textarea"
            placeholder="outline / large"
          />
        </TextField>

        <TextField label="Outline Medium Textarea" size="medium">
          <TextFieldTextarea
            accessibility-label="Outline Medium Textarea"
            placeholder="outline / medium"
          />
        </TextField>

        <TextField variant="underline" size="large" description="underline / large textarea">
          <TextFieldTextarea
            accessibility-label="Underline Large Textarea"
            placeholder="underline / large"
          />
        </TextField>

        <TextField variant="underline" size="medium" description="underline / medium textarea">
          <TextFieldTextarea
            accessibility-label="Underline Medium Textarea"
            placeholder="underline / medium"
          />
        </TextField>

        <TextField label="고정 높이" description="autoresize=false와 명시적 높이 예시입니다.">
          <TextFieldTextarea
            accessibility-label="고정 높이 여러 줄 입력"
            placeholder="높이가 자동으로 늘어나지 않습니다."
            autoresize={false}
            style={{ height: "160px" }}
          />
        </TextField>

        <LayoutComparisonExample />
      </view>
    </KeyboardAvoidingScrollView>
  );
}
