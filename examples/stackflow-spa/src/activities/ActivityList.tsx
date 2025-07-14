import {
  IconChevronRightLine,
  IconILowercaseSerifCircleLine,
  IconPersonCircleLine,
} from "@karrotmarket/react-monochrome-icon";
import { Checkbox, Divider, Icon, List, RadioGroup, VStack } from "@seed-design/react";
import type { ActivityComponentType } from "@stackflow/react";
import { AppBar, AppBarMain } from "../seed-design/stackflow/AppBar";
import { AppScreen, AppScreenContent } from "../seed-design/stackflow/AppScreen";
import { ActionButton } from "../seed-design/ui/action-button";
import { Avatar } from "../seed-design/ui/avatar";
import { Checkmark } from "../seed-design/ui/checkbox";
import { RadioMark } from "../seed-design/ui/radio-group";
import { IdentityPlaceholder } from "../seed-design/ui/identity-placeholder";

const PrefixVariants = [
  null,
  <List.Prefix key="icon">
    <Icon svg={<IconPersonCircleLine />} />
  </List.Prefix>,
  <List.Prefix key="avatar">
    <Avatar
      size="48"
      src="https://avatars.githubusercontent.com/u/54893898?v=4"
      fallback={<IdentityPlaceholder />}
    />
  </List.Prefix>,
];

const ContentVariants = [
  <List.Content key="title">
    <List.Title>타이틀</List.Title>
  </List.Content>,
  <List.Content key="title-detail">
    <List.Title>타이틀</List.Title>
    <List.Detail>lorem ipsum dolor sit amet</List.Detail>
  </List.Content>,
];

const SuffixVariants = [
  null,
  <List.Suffix key="icon-info">
    <Icon svg={<IconILowercaseSerifCircleLine />} />
  </List.Suffix>,
  <List.Suffix key="icon-chevron">
    <Icon svg={<IconChevronRightLine />} />
  </List.Suffix>,
  <List.Suffix key="text-icon">
    값 표시
    <Icon svg={<IconChevronRightLine />} />
  </List.Suffix>,
  <List.Suffix key="buttons">
    <ActionButton size="xsmall" variant="neutralWeak">
      라벨
    </ActionButton>
    <ActionButton size="xsmall" variant="neutralWeak">
      라벨
    </ActionButton>
  </List.Suffix>,
];

const ActivityList: ActivityComponentType = () => {
  return (
    <AppScreen>
      <AppBar>
        <AppBarMain title="List" />
      </AppBar>
      <AppScreenContent
        ptr
        onPtrRefresh={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      >
        <VStack>
          {PrefixVariants.map((prefix) =>
            ContentVariants.map((content) =>
              SuffixVariants.map((suffix) => (
                <>
                  <List.Item key={`${prefix?.key}-${content?.key}-${suffix?.key}`}>
                    {prefix}
                    {content}
                    {suffix}
                  </List.Item>
                  <Divider key={`divider-${prefix?.key}-${content?.key}-${suffix?.key}`} />
                </>
              )),
            ),
          )}
          <List.Item asChild>
            <Checkbox.Root.Primitive>
              <List.Content>
                <List.Title>타이틀</List.Title>
              </List.Content>
              <List.Suffix>
                <Checkmark />
                <Checkbox.HiddenInput />
              </List.Suffix>
            </Checkbox.Root.Primitive>
          </List.Item>
          <RadioGroup.Root>
            <List.Item asChild>
              <RadioGroup.Item.Primitive value="1">
                <List.Content>
                  <List.Title>1</List.Title>
                </List.Content>
                <List.Suffix>
                  <RadioMark />
                  <RadioGroup.ItemHiddenInput />
                </List.Suffix>
              </RadioGroup.Item.Primitive>
            </List.Item>
            <List.Item asChild>
              <RadioGroup.Item.Primitive value="2">
                <List.Content>
                  <List.Title>2</List.Title>
                </List.Content>
                <List.Suffix>
                  <RadioMark />
                  <RadioGroup.ItemHiddenInput />
                </List.Suffix>
              </RadioGroup.Item.Primitive>
            </List.Item>
            <List.Item asChild>
              <RadioGroup.Item.Primitive value="3">
                <List.Content>
                  <List.Title>3</List.Title>
                </List.Content>
                <List.Suffix>
                  <RadioMark />
                  <RadioGroup.ItemHiddenInput />
                </List.Suffix>
              </RadioGroup.Item.Primitive>
            </List.Item>
          </RadioGroup.Root>
        </VStack>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityList;
