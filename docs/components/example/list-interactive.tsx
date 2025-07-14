import { Checkbox, List, RadioGroup } from "@seed-design/react";
import { Checkmark } from "seed-design/ui/checkbox";
import { RadioMark } from "seed-design/ui/radio-group";

export default function ListInteractive() {
  return (
    <List.Root width="300px">
      {/* Checkbox Examples */}
      <List.Item asChild>
        <Checkbox.Root.Primitive>
          <List.Content>
            <List.Title>알림 수신 동의</List.Title>
            <List.Detail>푸시 알림을 받으시겠습니까?</List.Detail>
          </List.Content>
          <List.Suffix>
            <Checkmark />
            <Checkbox.HiddenInput />
          </List.Suffix>
        </Checkbox.Root.Primitive>
      </List.Item>

      <List.Item asChild>
        <Checkbox.Root.Primitive defaultChecked>
          <List.Content>
            <List.Title>마케팅 정보 수신 동의</List.Title>
          </List.Content>
          <List.Suffix>
            <Checkmark />
            <Checkbox.HiddenInput />
          </List.Suffix>
        </Checkbox.Root.Primitive>
      </List.Item>

      {/* Radio Group Example */}
      <RadioGroup.Root defaultValue="option1">
        <List.Item asChild>
          <RadioGroup.Item.Primitive value="option1">
            <List.Content>
              <List.Title>옵션 1</List.Title>
              <List.Detail>첫 번째 선택지</List.Detail>
            </List.Content>
            <List.Suffix>
              <RadioMark />
              <RadioGroup.ItemHiddenInput />
            </List.Suffix>
          </RadioGroup.Item.Primitive>
        </List.Item>

        <List.Item asChild>
          <RadioGroup.Item.Primitive value="option2">
            <List.Content>
              <List.Title>옵션 2</List.Title>
              <List.Detail>두 번째 선택지</List.Detail>
            </List.Content>
            <List.Suffix>
              <RadioMark />
              <RadioGroup.ItemHiddenInput />
            </List.Suffix>
          </RadioGroup.Item.Primitive>
        </List.Item>
      </RadioGroup.Root>
    </List.Root>
  );
}
