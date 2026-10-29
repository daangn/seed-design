import { Fragment, useState } from "react";
import { Field, HStack, SegmentedTextInput, VStack } from "@seed-design/react";
import { ActionButton } from "seed-design/ui/action-button";

const LABELS = ["1-4번째 자리", "5-8번째 자리", "9-12번째 자리", "13-16번째 자리"];
const KEYPAD_SEGMENTS = [2, 3];
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export default function SegmentedTextInputExternalKeypad() {
  const [value, setValue] = useState(["", "", "", ""]);
  const [keypadOpen, setKeypadOpen] = useState(false);

  const press = (key: string) =>
    setValue((prev) => {
      const index = KEYPAD_SEGMENTS.find((i) => prev[i].length < 4);
      if (index === undefined) return prev;
      return prev.map((segment, i) => (i === index ? segment + key : segment));
    });

  const erase = () =>
    setValue((prev) => {
      const index = KEYPAD_SEGMENTS.findLast((i) => prev[i].length > 0);
      if (index === undefined) return prev;
      return prev.map((segment, i) => (i === index ? segment.slice(0, -1) : segment));
    });

  return (
    <VStack width="358px" maxWidth="100%" gap="x4">
      <Field.Root>
        <Field.Header>
          <Field.Label>카드번호</Field.Label>
        </Field.Header>
        <SegmentedTextInput.Root value={value} onValueChange={setValue}>
          {LABELS.map((label, i) => {
            const usesKeypad = KEYPAD_SEGMENTS.includes(i);

            return (
              <Fragment key={label}>
                {i > 0 && <SegmentedTextInput.Separator> - </SegmentedTextInput.Separator>}
                <SegmentedTextInput.Segment
                  aria-label={`카드번호 ${label}`}
                  placeholder={usesKeypad ? "••••" : "0000"}
                  length={4}
                  masked={usesKeypad}
                  // 직접 입력을 막고 탭하면 외부 키패드를 연다.
                  readOnly={usesKeypad}
                  inputMode={usesKeypad ? "none" : "numeric"}
                  onFocus={() => setKeypadOpen(usesKeypad)}
                />
              </Fragment>
            );
          })}
        </SegmentedTextInput.Root>
      </Field.Root>
      {keypadOpen && (
        // 키패드를 눌러도 입력의 focus가 유지되도록 mousedown 기본 동작을 막는다.
        <HStack wrap gap="x2" onMouseDown={(event) => event.preventDefault()}>
          {KEYS.map((key) => (
            <ActionButton key={key} variant="neutralWeak" onClick={() => press(key)}>
              {key}
            </ActionButton>
          ))}
          <ActionButton variant="neutralWeak" onClick={erase}>
            지우기
          </ActionButton>
        </HStack>
      )}
    </VStack>
  );
}
