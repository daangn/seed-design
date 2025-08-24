// this is not a dependency in docs; move to headless or somewhere else
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Badge, HStack, Portal, Text, VStack } from "@seed-design/react";
import { type PropsWithChildren, type ReactNode, useId, useState } from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  BottomSheetBody,
  BottomSheetContent,
  BottomSheetFooter,
  BottomSheetRoot,
} from "seed-design/ui/bottom-sheet";
import { Chip } from "seed-design/ui/chip";
import { TextField, TextFieldInput } from "seed-design/ui/text-field";

function FieldButtonValue({ children }: PropsWithChildren) {
  return <Text textStyle="t5Bold">{children}</Text>;
}
function FieldButtonChip({ children }: PropsWithChildren) {
  return <Badge>{children}</Badge>;
}

interface FieldButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  name?: React.InputHTMLAttributes<HTMLInputElement>["name"];

  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;

  placeholder?: ReactNode;

  buttonLabel?: ReactNode; // ??
}

function FieldButton({
  values: __value,
  defaultValues,
  onValuesChange,
  placeholder,
  children,
  buttonLabel,
  ...otherProps
}: FieldButtonProps) {
  const [values, setValues] = useControllableState({
    prop: __value,
    defaultProp: defaultValues ?? [],
    onChange: onValuesChange,
  });

  // - BottomSheetTrigger asChild 같은 패턴을 생각할 때 root element가 button인 게 좋을 것 같음. -> 근데 현실적으로 불가능.

  const name = useId();

  console.log({ values });

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "1rem",
        display: "flex",
        gap: "0.5rem",
      }}
    >
      <button type="button" style={{ padding: "1rem", border: "1px solid gray" }} {...otherProps}>
        {buttonLabel}
        {/* 스크린 리더 고민 */}
      </button>
      <div>{children}</div>
      <button
        type="button"
        style={{ padding: "1rem", border: "1px solid gray" }}
        onClick={() => {
          setValues([]);
        }}
      >
        Clear
      </button>
      {values?.map((value, index) => (
        // TODO: what if duplicate values come in? (key collision)
        <input key={`${value}-${index}`} value={value} type="hidden" name={name} />
        // this is fine because we're not moving around the inputs? probably...
      ))}
    </div>
  );
}

export default function FieldButtonPreview() {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // const target = event.target as HTMLFormElement;

    // console.log(target.elements);

    window.alert(JSON.stringify(fields));
  };

  const [fields, setFields] = useState<{ address: string; filters: string[] }>({
    address: "",
    filters: [],
  });

  return (
    <form onSubmit={onSubmit}>
      <VStack gap="spacingY.componentDefault">
        <FieldButtonWithValue
          value={fields.address}
          setValue={(value) => setFields((prev) => ({ ...prev, address: value }))}
        />
        <FieldButtonWithChips
          values={fields.filters}
          setValues={(values) => setFields((prev) => ({ ...prev, filters: values }))}
        />
      </VStack>
      <ActionButton type="submit">Submit</ActionButton>
    </form>
  );
}

export function FieldButtonWithValue({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [sheetValue, setSheetValue] = useState("");

  return (
    <div>
      <BottomSheetRoot open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <FieldButton
          onClick={() => setIsSheetOpen(true)}
          values={value ? [value] : undefined}
          onValuesChange={([value]) => setValue(value)}
          placeholder="주소를 입력해 주세요"
        >
          <FieldButtonValue>{value}</FieldButtonValue>
        </FieldButton>
        <Portal>
          <BottomSheetContent title="배송받을 장소">
            <form
              onSubmit={(event) => {
                event.preventDefault();

                setValue(sheetValue);
                setIsSheetOpen(false);
                event.stopPropagation();
              }}
            >
              <BottomSheetBody minHeight="x16">
                <TextField
                  label="주소를 입력해 주세요"
                  value={sheetValue}
                  onValueChange={({ value }) => setSheetValue(value)}
                >
                  <TextFieldInput type="text" placeholder="서울특별시" />
                </TextField>
              </BottomSheetBody>
              <BottomSheetFooter>
                <ActionButton type="submit" variant="neutralSolid">
                  확인
                </ActionButton>
              </BottomSheetFooter>
            </form>
          </BottomSheetContent>
        </Portal>
      </BottomSheetRoot>
    </div>
  );
}

export function FieldButtonWithChips({
  values,
  setValues,
}: {
  values: string[];
  setValues: (values: string[]) => void;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { selectedFilters, Filter } = useFilter({
    filters: [
      { id: "1", label: "Chip 1", checked: false },
      { id: "2", label: "Chip 2", checked: false },
      { id: "3", label: "Chip 3", checked: false },
      { id: "4", label: "Chip 4", checked: false },
      { id: "5", label: "Chip 5", checked: false },
    ],
  });

  return (
    <div>
      <BottomSheetRoot open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <FieldButton
          values={values}
          onValuesChange={setValues}
          placeholder="주소를 입력해 주세요"
          onClick={() => setIsSheetOpen(true)}
        >
          {values.map((v) => (
            <FieldButtonChip key={v}>{v}</FieldButtonChip>
          ))}
        </FieldButton>
        <Portal>
          <BottomSheetContent title="배송받을 장소">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setValues(selectedFilters);
                setIsSheetOpen(false);
                event.stopPropagation();
              }}
            >
              <BottomSheetBody minHeight="x16">
                <HStack gap="x2" wrap>
                  {Filter}
                </HStack>
              </BottomSheetBody>
              <BottomSheetFooter>
                <ActionButton type="submit" variant="neutralSolid">
                  확인
                </ActionButton>
              </BottomSheetFooter>
            </form>
          </BottomSheetContent>
        </Portal>
      </BottomSheetRoot>
    </div>
  );
}

function useFilter({ filters }: { filters: { id: string; label: string; checked: boolean }[] }) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  return {
    selectedFilters,
    Filter: filters.map((filter) => (
      <Chip.Toggle
        key={filter.id}
        checked={selectedFilters?.includes(filter.id)}
        onCheckedChange={(checked) => {
          if (checked) {
            setSelectedFilters((prev) => [...(prev || []), filter.id]);
            return;
          }

          setSelectedFilters((prev) => prev?.filter((id) => id !== filter.id));
        }}
      >
        <Chip.Label>{filter.label}</Chip.Label>
      </Chip.Toggle>
    )),
  };
}
