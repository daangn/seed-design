import type { ComponentType } from "@lynx-js/react";

export type LynxExampleId = `lynx/${string}/${string}`;

export interface LynxPlaygroundExample {
  id: LynxExampleId;
  component: string;
  scenario: string;
  load: () => Promise<{ default: ComponentType }>;
}
