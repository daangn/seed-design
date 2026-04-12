import type { BaseComponentProps } from "@json-render/react";
import { Box as SeedBox, VStack as SeedVStack, HStack as SeedHStack } from "@seed-design/react";

export const Box = ({ props, children }: BaseComponentProps) => (
  <SeedBox {...(props as any)}>{children}</SeedBox>
);

export const VStack = ({ props, children }: BaseComponentProps) => (
  <SeedVStack {...(props as any)}>{children}</SeedVStack>
);

export const HStack = ({ props, children }: BaseComponentProps) => (
  <SeedHStack {...(props as any)}>{children}</SeedHStack>
);
