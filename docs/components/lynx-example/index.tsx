import { SeedTab as Tab, SeedTabs as Tabs } from "@/components/tabs/seed-tabs";
import { loadLynxExample, type LynxExampleName } from "@/lib/lynx-examples/manifest";
import type { ReactNode } from "react";
import ErrorBoundary from "../error-boundary";
import { LynxComponentPreview } from "./preview";
import { LynxComponentQRCode } from "./qr-code";

export interface LynxComponentExampleProps {
  name: LynxExampleName;
  height?: number;
  children: ReactNode;
}

export async function LynxComponentExample({
  name,
  height = 320,
  children,
}: LynxComponentExampleProps) {
  if (!children) throw new Error(`${name}의 LynxComponentExample에는 코드 children이 필요합니다.`);
  const entry = await loadLynxExample(name);

  return (
    <ErrorBoundary>
      <Tabs card className="!overflow-hidden" items={["미리보기", "QR 코드", "코드"]}>
        <Tab value="미리보기">
          <LynxComponentPreview url={entry.web} height={height} />
        </Tab>
        <Tab value="QR 코드">
          <LynxComponentQRCode bundlePath={entry.lynx} />
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
