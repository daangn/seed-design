"use client";

import { MotionProvider } from "@/components/MotionProvider";
import { AIPanelLayout } from "./ai-panel-layout";
import { AIPanelProvider } from "./ai-panel-provider";
import type { ReactNode } from "react";

export function AIPanelShell({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <AIPanelProvider>
        <AIPanelLayout>{children}</AIPanelLayout>
      </AIPanelProvider>
    </MotionProvider>
  );
}
