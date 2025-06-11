import { usePostHog } from "../posthog";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { events } from "shared/event";
import type { SerializedBaseNode } from "shared/types";

const availableSteps = [
  {
    value: "colors",
    label: "Colors",
    description: "V2 컬러 스타일을 V3 컬러 Variable로 마이그레이션합니다.",
  },
  {
    value: "typography",
    label: "Typography",
    description: "V2 타이포그래피을 V3 타이포그래피로 마이그레이션합니다.",
  },
  {
    value: "components",
    label: "컴포넌트",
    description: "V2 컴포넌트를 V3 컴포넌트로 마이그레이션합니다.",
  },
  //   {
  //     value: "sizings",
  //     label: "사이즈",
  //     description: "너비와 높이에 V3 Variable을 적용합니다.",
  //   },
  //   {
  //     value: "layouts",
  //     label: "레이아웃",
  //     description: "padding, gap 등 오토 레이아웃 속성에 V3 Variable을 적용합니다.",
  //   },
  //   {
  //     value: "stroke-weight-and-corner-radius",
  //     label: "스트로크, Radius",
  //     description: "스트로크 두께와 radius에 V3 Variable을 적용합니다.",
  //   },
] as const;

export type AvailableSteps = (typeof availableSteps)[number]["value"];
export type Step = (typeof availableSteps)[number];

interface MigrationState {
  availableSteps: typeof availableSteps;
  targets: SerializedBaseNode[];
  selections: SerializedBaseNode[];
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentTab: AvailableSteps;
  setCurrentTab: React.Dispatch<React.SetStateAction<AvailableSteps>>;
  scanCurrentTab: () => void;
}

function useMigrationState() {
  const [targets, setTargets] = useState<SerializedBaseNode[]>([]);
  const [selections, setSelections] = useState<SerializedBaseNode[]>([]);
  const [currentTab, setCurrentTab] = useState<AvailableSteps>("colors");
  const [loading, setLoading] = useState(false);
  const { capture } = usePostHog();

  useEffect(() => {
    events("announce-selection").on((data) => {
      setSelections(data.serializedSelections);
    });

    events("announce-target").on((data) => {
      setTargets(data.serializedTargets);
    });
  }, []);

  const scanCurrentTab = () => {
    setLoading(true);

    switch (currentTab) {
      case "colors":
        capture("request-color-suggestions", {
          selections: selections.map(({ id }) => id),
        });
        events("request-color-suggestions").emit({
          nodeIds: selections.map(({ id }) => id),
        });
        break;

      case "typography":
        capture("request-text-style-suggestions", {
          selections: selections.map(({ id }) => id),
        });
        events("request-text-style-suggestions").emit({
          nodeIds: selections.map(({ id }) => id),
        });
        break;

      case "components":
        capture("request-component-suggestions", {
          selections: selections.map(({ id }) => id),
        });
        events("request-component-suggestions").emit({
          nodeIds: selections.map(({ id }) => id),
        });
        break;
    }
  };

  return {
    availableSteps,
    targets,
    selections,
    loading,
    setLoading,
    currentTab,
    setCurrentTab,
    scanCurrentTab,
  };
}

const MigrationContext = createContext<MigrationState | null>(null);

export function MigrationProvider({ children }: { children: ReactNode }) {
  return (
    <MigrationContext.Provider value={useMigrationState()}>{children}</MigrationContext.Provider>
  );
}

export function useMigration() {
  const context = useContext(MigrationContext);

  if (!context) {
    throw new Error("useMigration must be used within MigrationProvider");
  }

  return context;
}
