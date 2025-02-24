import { ColorsSection } from "@/features/design-system/ui/colors";
import { ComponentsSection } from "@/features/design-system/ui/components";
import { MigrationStateProvider, useMigration } from "@/features/design-system/ui/context";
import { LayoutsSection } from "@/features/design-system/ui/layouts";
import { SizingsSection } from "@/features/design-system/ui/sizings";
import { StrokeWeightAndCornerRadiusSection } from "@/features/design-system/ui/stroke-weights-and-corner-radiuses";
import { TextStylesSection } from "@/features/design-system/ui/text-styles";
import { Tooltip } from "@/shared/components/tooltip";
import { FigmaMetadataProvider } from "@/shared/contexts/FigmaMetadataProvider";
import { PreferencesProvider } from "@/shared/contexts/PreferencesProvider";
import { Banner, IconWarning32, render } from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";
import { useMemo } from "preact/hooks";

import "!../../../shared/css/output.css";

import type {
  FocusNodeEventHandler,
  RequestAnnounceTargetsEventHandler,
} from "@/features/design-system/types";
import { emit } from "@create-figma-plugin/utilities";

function App() {
  return (
    <FigmaMetadataProvider>
      <PreferencesProvider>
        <MigrationStateProvider>
          <Steps />
        </MigrationStateProvider>
      </PreferencesProvider>
    </FigmaMetadataProvider>
  );
}

function Steps() {
  const { currentStep, targets, selections } = useMigration();

  const section = useMemo(() => {
    switch (currentStep?.value) {
      case "components":
        return <ComponentsSection />;
      case "text-styles":
        return <TextStylesSection />;
      case "colors":
        return <ColorsSection />;
      case "sizings":
        return <SizingsSection />;
      case "layouts":
        return <LayoutsSection />;
      case "stroke-weight-and-corner-radius":
        return <StrokeWeightAndCornerRadiusSection />;
      default:
        return null;
    }
  }, [currentStep]);

  const isSelectionsAndTargetsEqual = useMemo(() => {
    if (targets.length !== selections.length) {
      return false;
    }

    return targets.every((target) => selections.some((selection) => selection.id === target.id));
  }, [targets, selections]);

  return (
    <div className="flex flex-col size-full">
      {(!currentStep || targets.length === 0) && (
        <div className="grow flex flex-col justify-between p-4">
          <Banner icon={<IconWarning32 />}>마이그레이션할 레이어를 선택해주세요.</Banner>
        </div>
      )}
      {currentStep && targets.length > 0 && (
        <div className="flex flex-col grow overflow-y-auto">
          <div className="flex gap-1.5 px-2 py-1 border-neutral-200 border-b items-center justify-between flex-wrap">
            <div className="flex gap-1.5 items-center">
              <div className="text-neutral-600 text-[12px]">마이그레이션 대상 레이어</div>
              {targets.map((target) => (
                <Tooltip key={target.id} label="레이어 선택">
                  <button
                    type="button"
                    onClick={() =>
                      emit<FocusNodeEventHandler>("FOCUS_NODE", { nodeIds: [target.id] })
                    }
                    className="px-1.5 py-1 rounded bg-neutral-200 font-bold text-neutral-800 hover:bg-neutral-300 max-w-40 whitespace-nowrap text-ellipsis overflow-x-hidden"
                  >
                    {target.name}
                  </button>
                </Tooltip>
              ))}
            </div>
            {!isSelectionsAndTargetsEqual && selections.length > 0 && (
              <div className="flex gap-1.5 items-center">
                <div className="text-neutral-600 text-[12px]">포커싱 된 레이어</div>
                {selections.length === 1 ? (
                  <Tooltip label="레이어 검사">
                    <button
                      type="button"
                      onClick={() =>
                        emit<RequestAnnounceTargetsEventHandler>("REQUEST_ANNOUNCE_TARGET", {
                          nodeIds: [selections[0].id],
                        })
                      }
                      className="px-1.5 py-1 rounded bg-neutral-200 font-bold text-neutral-800 hover:bg-neutral-300 max-w-40 whitespace-nowrap text-ellipsis overflow-x-hidden"
                    >
                      {selections[0].name}
                    </button>
                  </Tooltip>
                ) : (
                  <div className="font-semibold text-neutral-600">여러 개</div>
                )}
              </div>
            )}
          </div>
          <AvailableSteps />
          {section}
        </div>
      )}
    </div>
  );
}

function AvailableSteps() {
  const { currentStep, setCurrentStep, availableSteps } = useMigration();

  return (
    <div className="flex gap-0.5 items-center justify-center p-1.5 border-neutral-200 border-b">
      {availableSteps.map((step, index) => (
        <Fragment key={step.value}>
          <Tooltip label={step.description}>
            <button
              type="button"
              onClick={() => setCurrentStep(step)}
              className={`p-1 ${
                currentStep?.value === step.value
                  ? "text-neutral-800 font-bold"
                  : "text-neutral-600"
              }`}
            >
              {step.label}
            </button>
          </Tooltip>
          {index < availableSteps.length - 1 && (
            // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-300"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default render(App);
