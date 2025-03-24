import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import type { SerializedBaseNode } from "../../shared/types";
import { events } from "../../shared/event";

const availableSteps = [
  //   {
  //     value: "components",
  //     label: "컴포넌트",
  //     description: "V2 컴포넌트를 V3 컴포넌트로 마이그레이션합니다.",
  //   },
  {
    value: "text-styles",
    label: "텍스트 스타일",
    description: "V2 텍스트 스타일을 V3 텍스트 스타일로 마이그레이션합니다.",
  },
  {
    value: "colors",
    label: "컬러",
    description: "V2 컬러 스타일을 V3 컬러 Variable로 마이그레이션합니다.",
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
}

function useMigrationState() {
  const [targets, setTargets] = useState<SerializedBaseNode[]>([]);
  const [selections, setSelections] = useState<SerializedBaseNode[]>([]);

  useEffect(() => {
    const unsubscribeSelection = events("announce-selection").on((data) => {
      setSelections(data.serializedSelections);
    });

    const unsubscribeTarget = events("announce-target").on((data) => {
      setTargets(data.serializedTargets);
    });

    return () => {
      unsubscribeSelection();
      unsubscribeTarget();
    };
  }, []);

  return {
    availableSteps,
    targets,
    selections,
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
