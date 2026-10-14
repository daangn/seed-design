import { archivePaths } from "@/lib/docs-archive";
import { SeedTab as Tab, SeedTabs as Tabs } from "@/components/tabs/seed-tabs";
import { loadLynxExample, type LynxExampleName } from "@/lib/lynx-examples/manifest";
import { getExampleLayout } from "@/playground/lynx/layout";
import type { ReactNode } from "react";
import ErrorBoundary from "../error-boundary";
import { LynxComponentPreview } from "./preview";
import { LynxComponentQRCode } from "./qr-code";

export interface LynxComponentExampleProps {
  name: LynxExampleName;
  height?: number;
  children: ReactNode;
}

export async function LynxComponentExample({ name, height, children }: LynxComponentExampleProps) {
  if (!children) throw new Error(`${name}의 LynxComponentExample에는 코드 children이 필요합니다.`);
  if (height === undefined && getExampleLayout(name) === "fill") {
    throw new Error(`${name}은 fill 레이아웃이라 LynxComponentExample에 height가 필요합니다.`);
  }
  const entry = await loadLynxExample(name);

  return (
    <ErrorBoundary>
      <Tabs card className="!overflow-hidden" items={["미리보기", "코드"]}>
        <Tab value="미리보기">
          {/* 카드 폭 기준으로 배치한다. 좁으면 QR 패널이 미리보기 아래로 내려간다. */}
          <div className="@container">
            <div className="flex flex-col @xl:flex-row">
              <div className="min-w-0 flex-1">
                <LynxComponentPreview
                  url={archivePaths.asset(entry.web)}
                  example={name}
                  height={height}
                />
              </div>
              <aside
                aria-label="Lynx Explorer에서 열기"
                className="flex shrink-0 flex-col items-center justify-center border-0 border-t border-solid border-stroke-neutral-muted @xl:w-[220px] @xl:border-t-0 @xl:border-l"
              >
                <LynxComponentQRCode name={name} bundlePath={archivePaths.asset(entry.lynx)} />
              </aside>
            </div>
          </div>
        </Tab>
        <Tab value="코드">{children}</Tab>
      </Tabs>
    </ErrorBoundary>
  );
}
