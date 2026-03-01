"use client";

import * as React from "react";
import * as changeCase from "change-case";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "seed-design/ui/tabs";

import { CopyableName } from "./copyable-name";
import { useIcon } from "./icon-context";

const ReactTab = () => {
  const { selectedIcon, iconStyle } = useIcon();

  if (!selectedIcon) return null;

  const pascalCaseName = changeCase.pascalCase(selectedIcon.name);
  const packageName =
    iconStyle === "monochrome"
      ? "@karrotmarket/react-monochrome-icon"
      : "@karrotmarket/react-multicolor-icon";

  const usageCode = `import { ${pascalCaseName} } from "${packageName}";

<${pascalCaseName} />`;

  return (
    <div className="flex flex-col gap-3">
      <CopyableName
        name={pascalCaseName}
        label="컴포넌트 이름이 복사되었습니다"
        className="text-sm font-mono font-medium"
      />
      <DynamicCodeBlock lang="tsx" code={usageCode} />
    </div>
  );
};

const FigmaTab = () => {
  const { selectedIcon } = useIcon();

  if (!selectedIcon) return null;

  const figma = selectedIcon.figma;

  if (!figma) {
    return (
      <div className="text-sm text-fd-muted-foreground py-4 text-center">
        Figma 데이터가 없습니다.
      </div>
    );
  }

  // 모노크롬 아이콘의 figma.name은 "Weight=Line" 같은 variant 속성이므로
  // 실제 아이콘 이름(selectedIcon.name)을 사용
  const isVariantName = figma.name.startsWith("Weight=");
  const displayName = isVariantName ? selectedIcon.name : figma.name;

  return (
    <div className="flex flex-col gap-3">
      <CopyableName
        name={displayName}
        label="Figma 이름이 복사되었습니다"
        className="text-sm font-mono font-medium"
      />
      {figma.description && <p className="text-xs text-fd-muted-foreground">{figma.description}</p>}
      <p className="text-xs text-fd-muted-foreground">
        Figma 에셋 패널에서 위 이름으로 검색하세요.
      </p>
    </div>
  );
};

export const IconDetailPlatformTabs = () => {
  const { platform, setPlatform } = useIcon();

  return (
    <TabsRoot
      value={platform}
      onValueChange={(value) => {
        setPlatform(value as "react" | "figma");
      }}
    >
      <TabsList>
        <TabsTrigger value="react">React</TabsTrigger>
        <TabsTrigger value="figma">Figma</TabsTrigger>
      </TabsList>
      <TabsContent value="react" className="pt-4">
        <ReactTab />
      </TabsContent>
      <TabsContent value="figma" className="pt-4">
        <FigmaTab />
      </TabsContent>
    </TabsRoot>
  );
};
