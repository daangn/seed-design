import { useFlow, type StaticActivityComponentType } from "@stackflow/react/future";
import {
  AppBar,
  AppBarBackButton,
  AppBarLeft,
  AppBarMain,
  AppBarIconButton,
  AppBarRight,
} from "seed-design/ui/app-bar";
import { AppScreen, AppScreenContent } from "seed-design/ui/app-screen";
import { IconHouseLine } from "@karrotmarket/react-monochrome-icon";
import { Box } from "@seed-design/react";
import type * as React from "react";

declare module "@stackflow/config" {
  interface Register {
    ActivityMarginPlayground: {};
  }
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box mb="x8">
    <Box color="palette.gray900" mb="x4" style={{ fontSize: 18, fontWeight: 700 }}>
      {title}
    </Box>
    {children}
  </Box>
);

const Case = ({
  label,
  description,
  children,
  minHeight,
  display,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  minHeight?: string;
  display?: "flex";
}) => (
  <Box bg="palette.gray50" p="x4" borderRadius="r2" mb="x3">
    <Box color="palette.gray800" mb="x1" style={{ fontSize: 14, fontWeight: 600 }}>
      {label}
    </Box>
    {description && (
      <Box color="palette.gray600" mb="x3" style={{ fontSize: 12 }}>
        {description}
      </Box>
    )}
    <Box
      p="x3"
      borderRadius="r1"
      borderWidth={1}
      borderColor="palette.yellow700"
      bg="palette.yellow100"
      minHeight={minHeight}
      display={display}
    >
      {children}
    </Box>
  </Box>
);

type DemoBoxProps = React.ComponentProps<typeof Box> & { label: string };
const DemoBox = ({ label, ...props }: DemoBoxProps) => (
  <Box
    {...props}
    bg="palette.blue600"
    color="palette.staticWhite"
    p="x3"
    borderRadius="r1"
    width="200px"
    style={{ fontSize: 12, fontFamily: "monospace", textAlign: "center" }}
  >
    {label}
  </Box>
);

const ActivityMarginPlayground: StaticActivityComponentType<"ActivityMarginPlayground"> = () => {
  const { push } = useFlow();

  return (
    <AppScreen>
      <AppBar>
        <AppBarLeft>
          <AppBarBackButton />
        </AppBarLeft>
        <AppBarMain>Margin Playground</AppBarMain>
        <AppBarRight>
          <AppBarIconButton aria-label="Home" onClick={() => push("ActivityHome", {})}>
            <IconHouseLine />
          </AppBarIconButton>
        </AppBarRight>
      </AppBar>
      <AppScreenContent>
        <Box p="x4" bg="palette.gray25">
          {/* 1. Shorthand cascade */}
          <Section title="Shorthand cascade">
            <Case label="m='x4' — all four sides">
              <DemoBox m="x4" label='m="x4"' />
            </Case>
            <Case label="mx='x6' · my='x2'" description="horizontal vs vertical shorthands">
              <DemoBox mx="x6" my="x2" label='mx="x6" · my="x2"' />
            </Case>
            <Case
              label="m='x4' + mt='x8' (specific override)"
              description="marginTop overrides the shorthand only for the top edge."
            >
              <DemoBox m="x4" mt="x8" label='m="x4" · mt="x8"' />
            </Case>
            <Case
              label="m='x6' + mx='x2' + mr='x10' (three-level cascade)"
              description="margin → marginX → marginRight, each level overrides."
            >
              <DemoBox m="x6" mx="x2" mr="x10" label="m=x6 · mx=x2 · mr=x10" />
            </Case>
          </Section>

          {/* 2. Value types */}
          <Section title="Value types">
            <Case label="Dimension token: mt='spacingY.componentDefault'">
              <DemoBox mt="spacingY.componentDefault" label='mt="spacingY.componentDefault"' />
            </Case>
            <Case label="Raw CSS string: mx='24px'">
              <DemoBox mx="24px" label='mx="24px"' />
            </Case>
            <Case label="Zero: m={0}">
              <DemoBox m={0} label="m={0}" />
            </Case>
            <Case label="Negative: mt='-8px'" description="margin supports negative values.">
              <DemoBox mt="-8px" label='mt="-8px"' />
            </Case>
          </Section>

          {/* 3. auto — static */}
          <Section title="auto — static centering / push">
            <Case
              label="mx='auto' — horizontal centering"
              description="Centered at every viewport."
            >
              <DemoBox mx="auto" label='mx="auto"' />
            </Case>
            <Case label="ml='auto' — push to right">
              <DemoBox ml="auto" label='ml="auto"' />
            </Case>
            <Case label="mr='auto' — push to left (explicit)">
              <DemoBox mr="auto" label='mr="auto"' />
            </Case>
            <Case
              label="my='auto' inside a tall flex parent"
              description="Vertical centering via flex + auto."
              minHeight="200px"
              display="flex"
            >
              <DemoBox my="auto" label='my="auto"' />
            </Case>
          </Section>

          {/* 4. Responsive */}
          <Section title="Responsive values">
            <Case
              label="mx={{ base: 'x2', md: 'x8' }}"
              description="Tighter on mobile, roomier on desktop."
            >
              <DemoBox mx={{ base: "x2", md: "x8" }} label="base: x2 · md: x8" />
            </Case>
            <Case
              label="mx={{ base: 'auto', md: 0 }}"
              description="Centered on mobile, flush left from md up."
            >
              <DemoBox mx={{ base: "auto", md: 0 }} label="base: auto · md: 0" />
            </Case>
            <Case
              label="mx={{ base: 0, md: 'auto' }}"
              description="Flush left on mobile, centered from md up."
            >
              <DemoBox mx={{ base: 0, md: "auto" }} label="base: 0 · md: auto" />
            </Case>
            <Case
              label="mx={{ base: 'auto', md: '16px' }}"
              description="Auto and a dimension mixed across breakpoints."
            >
              <DemoBox mx={{ base: "auto", md: "16px" }} label="base: auto · md: 16px" />
            </Case>
            <Case
              label="ml={{ base: 'auto', md: 0 }} — asymmetric"
              description="Only left margin responds; right stays at 0."
            >
              <DemoBox ml={{ base: "auto", md: 0 }} label="base: ml=auto · md: ml=0" />
            </Case>
            <Case
              label="mx={{ base: 0, sm: '8px', md: 'auto', lg: '16px' }}"
              description="Four values across four breakpoints, auto in the middle."
            >
              <DemoBox
                mx={{ base: 0, sm: "8px", md: "auto", lg: "16px" }}
                label="base:0 · sm:8 · md:auto · lg:16"
              />
            </Case>
          </Section>

          {/* 5. Cross-direction margin + bleed */}
          <Section title="Cross-direction margin + bleed">
            <Case
              label="mt='x4' + bleedX='asPadding'"
              description="Vertical margin + horizontal bleed. Different directions, both apply."
            >
              <Box p="x5">
                <DemoBox mt="x4" bleedX="asPadding" label="mt=x4 · bleedX=asPadding" />
              </Box>
            </Case>
            <Case
              label="mx='auto' + bleedY='asPadding'"
              description="Horizontal auto + vertical bleed."
            >
              <Box p="x5">
                <DemoBox mx="auto" bleedY="asPadding" label="mx=auto · bleedY=asPadding" />
              </Box>
            </Case>
            <Case
              label="ml='auto' + bleedRight='x5'"
              description="Left auto-push + right bleed. Fully disjoint."
            >
              <DemoBox ml="auto" bleedRight="x5" label='ml="auto" · bleedRight="x5"' />
            </Case>
            <Case
              label="marginTop='x4' + marginBottom='x4' + bleedX='asPadding'"
              description="All four directions covered, margin and bleed on separate axes."
            >
              <Box p="x5">
                <DemoBox
                  marginTop="x4"
                  marginBottom="x4"
                  bleedX="asPadding"
                  label="mt+mb margin · bleedX asPadding"
                />
              </Box>
            </Case>
          </Section>

          {/* 6. Baseline */}
          <Section title="Baseline">
            <Case label="No margin/bleed (default)" description="Regression check.">
              <DemoBox label="default" />
            </Case>
            <Case
              label="bleed only (existing behavior)"
              description="bleedX='x4' still works unchanged."
            >
              <Box p="x5">
                <DemoBox bleedX="x4" label='bleedX="x4"' />
              </Box>
            </Case>
          </Section>
        </Box>
      </AppScreenContent>
    </AppScreen>
  );
};

export default ActivityMarginPlayground;
