import * as React from "react";
import { Tabs } from "nextra/components";

interface PreviewProps {
  component: React.ReactNode;
}

/**
 * @description children에는 "코드"를 넣고, component에는 미리보기할 컴포넌트를 넣습니다.
 */
export const Preview = ({ children, component }: React.PropsWithChildren<PreviewProps>) => {
  return (
    <Tabs items={["미리보기", "코드"]}>
      <Tabs.Tab>
        <div
          style={{
            minHeight: "350px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {component}
        </div>
      </Tabs.Tab>
      <Tabs.Tab>{children}</Tabs.Tab>
    </Tabs>
  );
};
