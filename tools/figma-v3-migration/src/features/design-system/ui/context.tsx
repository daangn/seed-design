import type {
  AnnounceSelectionsEventHandler,
  AnnounceTargetsEventHandler,
  SerializedBaseNode,
} from "@/features/design-system/types";
import { on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { createContext, type PropsWithChildren } from "preact/compat";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";

const availableSteps = [
  {
    label: "Components",
    value: "components",
    description: "V2 컴포넌트를 V3 컴포넌트로 마이그레이션합니다.",
  },
  // {
  //   label: "Typography",
  //   value: "text-styles",
  //   description: "V2 텍스트 스타일을 V3 텍스트 스타일로 마이그레이션합니다.",
  // },
  // {
  //   label: "Colors",
  //   value: "colors",
  //   description: "V2 컬러 스타일을 V3 컬러 Variable로 마이그레이션합니다.",
  // },
  {
    label: "Size",
    value: "sizings",
    description: "너비와 높이에 V3 Variable을 적용합니다.",
  },
  {
    label: "Layout",
    value: "layouts",
    description: "padding, gap 등 오토 레이아웃 속성에 V3 Variable을 적용합니다.",
  },
  {
    label: "Stroke, Radius",
    value: "stroke-weight-and-corner-radius",
    description: "스트로크 두께와 radius에 V3 Variable을 적용합니다.",
  },
] as const satisfies {
  label: string;
  value: string;
  description: string;
}[];

export type AvailableSteps = (typeof availableSteps)[number]["value"];

function useMigrationState() {
  const [currentStep, setCurrentStep] = useState<(typeof availableSteps)[number] | null>(null);

  const [selections, setSelections] = useState<SerializedBaseNode[]>([]);
  const [targets, setTargets] = useState<SerializedBaseNode[]>([]);

  const showNextStep = useCallback(() => {
    if (currentStep === null) return;

    const currentIndex = availableSteps.findIndex((step) => step.value === currentStep.value);

    setCurrentStep(availableSteps[currentIndex + 1] ?? null);
  }, [currentStep]);

  useEffect(() => {
    on<AnnounceTargetsEventHandler>("ANNOUNCE_TARGET", ({ serializedTargets }) => {
      setTargets(serializedTargets);

      const componentStep = availableSteps.find((step) => step.value === "components");
      setCurrentStep(componentStep ?? null);
    });

    on<AnnounceSelectionsEventHandler>("ANNOUNCE_SELECTION", ({ serializedSelections }) => {
      setSelections(serializedSelections);
    });
  }, []);

  return {
    currentStep,
    setCurrentStep,
    availableSteps,
    showNextStep,
    targets,
    setTargets,
    selections,
  };
}

const MigrationStateContext = createContext<ReturnType<typeof useMigrationState> | null>(null);

export function MigrationStateProvider({ children }: PropsWithChildren) {
  return (
    <MigrationStateContext.Provider value={useMigrationState()}>
      {children}
    </MigrationStateContext.Provider>
  );
}

export function useMigration() {
  const context = useContext(MigrationStateContext);

  if (!context) throw new Error("useMigration must be used within MigrationStateProvider");

  return context;
}
