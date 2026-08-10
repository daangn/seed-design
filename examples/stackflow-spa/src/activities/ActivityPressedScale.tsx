import {
  IconChevronRightLine,
  IconHouseLine,
  IconPlusFill,
} from "@karrotmarket/react-monochrome-icon";
import { actionButtonVariantMap } from "@seed-design/css/recipes/action-button";
import { HStack, Icon, Callout as SeedCallout, SuffixIcon } from "@seed-design/react";
import { RadioGroup } from "@seed-design/react/primitive";
import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import * as React from "react";
import { ActionButton } from "seed-design/ui/action-button";
import {
  AppBar,
  AppBarBackButton,
  AppBarIconButton,
  AppBarLeft,
  AppBarMain,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { ActionableCallout, DismissibleCallout } from "seed-design/ui/callout";
import { Checkbox, Checkmark } from "seed-design/ui/checkbox";
import { List, ListCheckItem, ListDivider, ListRadioItem } from "seed-design/ui/list";
import { DismissiblePageBanner } from "seed-design/ui/page-banner";
import {
  Radiomark,
  RadioGroup as RadioGroupField,
  RadioGroupItem,
} from "seed-design/ui/radio-group";

import * as styles from "../components/PressScalePlayground.css";
import {
  ClassOnlyPressable,
  ConstantPressable,
  NestedPressable,
  PlainCssPressable,
  RefOnlyPressable,
  SlottedPressable,
  UnstableRefPressable,
} from "../components/PressScalePressables";

declare module "@stackflow/config" {
  interface Register {
    ActivityPressedScale: {};
  }
}

function Group({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <section className={styles.group}>
      <h2 className={styles.groupHeader}>{name}</h2>
      {children}
    </section>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <p className={styles.sectionDescription}>{description}</p>
      </div>
      {children}
    </div>
  );
}

function Stage({
  children,
  tone = "default",
  flush = false,
}: {
  children: React.ReactNode;
  tone?: keyof typeof styles.panelTone;
  /** Drops the stage's padding so a full-bleed specimen — a List — meets the panel's edges. */
  flush?: boolean;
}) {
  return (
    <div className={`${styles.panel} ${styles.panelTone[tone]}`}>
      <div className={flush ? styles.stageFlush : styles.stage}>{children}</div>
    </div>
  );
}

const ActivityPressedScale: StaticActivityComponentType<"ActivityPressedScale"> = () => {
  const { push } = useFlow();
  const composedRefTarget = React.useRef<HTMLButtonElement>(null);

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain title="Pressed Scale" />
        <AppBarRight>
          <AppBarIconButton aria-label="홈" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <div className={styles.page}>
          <p className={styles.intro}>
            요소를 누르는 동안 축소가 유지됩니다. 각 섹션의 설명이 그 패널에서 무엇을 확인할 수
            있는지 알려줍니다.
          </p>

          <Group name="SEED 컴포넌트">
            <Section
              title="ActionButton — size"
              description="size가 달라도 세로로 줄어드는 거리는 같습니다."
            >
              <Stage>
                <HStack gap="x2" alignItems="center" flexWrap>
                  {actionButtonVariantMap.size.map((size) => (
                    <ActionButton key={size} size={size}>
                      {size}
                    </ActionButton>
                  ))}
                </HStack>
              </Stage>
            </Section>

            <Section
              title="ActionButton — 폭"
              description="배율의 기준은 max(높이, 폭 / 4, 24)입니다. 폭이 긴 요소는 세로로 덜 줄고 가로로 더 줄어듭니다."
            >
              <Stage>
                <ActionButton layout="iconOnly" size="medium" aria-label="아이콘 전용 정사각 버튼">
                  <Icon svg={<IconPlusFill />} />
                </ActionButton>
                <div className={styles.fullWidth}>
                  <ActionButton>화면 폭을 채우는 버튼</ActionButton>
                </div>
              </Stage>
            </Section>

            <Section title="Checkbox / RadioGroup — 단독" description="마크가 줄어듭니다.">
              <Stage>
                <Checkbox label="Checkbox" defaultChecked />
                <RadioGroupField label="RadioGroup" defaultValue="first">
                  <RadioGroupItem value="first" label="RadioGroupItem" />
                </RadioGroupField>
              </Stage>
            </Section>

            <Section
              title="Checkbox / RadioGroup — ListItem 안"
              description="행 배경만 바뀌고 마크는 줄지 않습니다. ListItem이 마크의 배율을 1로 고정합니다."
            >
              <Stage flush>
                <List as="fieldset">
                  <ListCheckItem
                    title="prefix Checkmark"
                    prefix={<Checkmark size="large" />}
                    defaultChecked
                  />
                  <ListDivider as="div" />
                  <ListCheckItem title="suffix Checkmark" suffix={<Checkmark size="large" />} />
                </List>
              </Stage>
              <Stage flush>
                <List asChild>
                  <RadioGroup.Root defaultValue="first" aria-label="ListItem 안의 RadioGroup">
                    <ListRadioItem
                      title="Radiomark 1"
                      value="first"
                      prefix={<Radiomark size="large" />}
                    />
                    <ListDivider as="div" />
                    <ListRadioItem
                      title="Radiomark 2"
                      value="second"
                      prefix={<Radiomark size="large" />}
                    />
                  </RadioGroup.Root>
                </List>
              </Stage>
            </Section>

            <Section
              title="Callout — 루트 전체"
              description="button이나 a로 렌더된 Callout만 줄어듭니다. 루트는 어느 쪽이든 크기를 발행합니다."
            >
              <Stage>
                <ActionableCallout title="asChild button" description="루트 전체가 줄어듭니다." />
              </Stage>
              <Stage>
                <SeedCallout.Root asChild>
                  {/* biome-ignore lint/a11y/useValidAnchor: the anchor exists to exercise the recipe's `:is(button, a)` press gate, so it must not navigate */}
                  <a href="#pressed-scale" onClick={(event) => event.preventDefault()}>
                    <SeedCallout.Content>
                      <SeedCallout.Title>asChild anchor</SeedCallout.Title>
                      <SeedCallout.Description>a로 렌더해도 같습니다.</SeedCallout.Description>
                    </SeedCallout.Content>
                    <SuffixIcon svg={<IconChevronRightLine />} />
                  </a>
                </SeedCallout.Root>
              </Stage>
            </Section>

            <Section
              title="닫기 버튼"
              description="닫기 버튼만 줄어듭니다. 반복해서 눌러볼 수 있도록 열린 상태로 고정했습니다."
            >
              <Stage>
                <DismissibleCallout open title="Callout" description="닫기 버튼만 줄어듭니다." />
              </Stage>
              <Stage>
                <DismissiblePageBanner
                  open
                  title="PageBanner"
                  description="닫기 버튼만 줄어듭니다."
                />
              </Stage>
            </Section>
          </Group>

          <Group name="커스텀 구현">
            <Section
              title="적용 방법 세 가지"
              description="PressScale로 감싸거나 usePressScale()의 ref와 클래스를 같은 요소에 달고, 자기 셀렉터에서 배율을 읽습니다. 세 버튼의 동작은 같습니다."
            >
              <Stage>
                <HStack gap="x2" alignItems="center" flexWrap>
                  <PlainCssPressable>순수 CSS</PlainCssPressable>
                  <ConstantPressable>press-scale 상수</ConstantPressable>
                  <SlottedPressable ref={composedRefTarget}>PressScale</SlottedPressable>
                </HStack>
              </Stage>
              <HStack>
                <ActionButton
                  size="xsmall"
                  variant="neutralWeak"
                  onClick={() => composedRefTarget.current?.focus()}
                >
                  자식에 단 ref로 포커스 이동
                </ActionButton>
              </HStack>
            </Section>

            <Section
              title="불안정한 ref"
              description="자식이 매 렌더 새 ref를 받으면 React가 ref를 뗐다 다시 붙입니다. 눌러서 리렌더를 쌓아도 축소되는 거리가 그대로여야 합니다."
            >
              <Stage>
                <HStack gap="x2" alignItems="center" flexWrap>
                  <UnstableRefPressable />
                </HStack>
              </Stage>
            </Section>

            <Section
              title="크기 대비"
              description="24px 정사각은 2px, 300×44 바는 가로로 8px 줄어듭니다. 폭이 길수록 기준이 폭으로 넘어갑니다."
            >
              <Stage>
                <HStack gap="x3" alignItems="center" flexWrap>
                  <ConstantPressable size="tiny" aria-label="24px 정사각" />
                  <ConstantPressable size="wide">300px 바</ConstantPressable>
                </HStack>
              </Stage>
            </Section>
          </Group>

          <Group name="간섭·실패 케이스">
            <Section
              title="ref와 클래스 중 하나만"
              description="축소만 일어나지 않을 뿐 나머지 스타일은 그대로 동작합니다. 두 버튼 모두 배경색만 바뀌어야 합니다."
            >
              <Stage tone="failure">
                <HStack gap="x2" alignItems="center" flexWrap>
                  <ClassOnlyPressable>클래스만</ClassOnlyPressable>
                  <RefOnlyPressable>ref만</RefOnlyPressable>
                </HStack>
              </Stage>
            </Section>

            <Section
              title="커스텀 래퍼 안의 SEED 마크"
              description="래퍼와 Checkmark가 함께 줄면 이중 축소가 됩니다. 아래쪽은 래퍼에서 마크 축소를 껐습니다."
            >
              <Stage>
                <NestedPressable>
                  <Checkbox label="이중 축소" defaultChecked />
                </NestedPressable>
              </Stage>
              <Stage>
                <NestedPressable optOut>
                  <Checkbox label="마크 축소 끔" defaultChecked />
                </NestedPressable>
              </Stage>
            </Section>
          </Group>
        </div>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityPressedScale;
