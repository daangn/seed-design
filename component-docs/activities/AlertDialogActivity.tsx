import * as React from "react";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { type ActivityComponentType, useStepFlow, useStack } from "@stackflow/react/future";

import { BoxButton } from "@/seed-design/ui/box-button";
import { AlertDialog as UIAlertDialog } from "@/seed-design/ui/alert-dialog";

declare module "@stackflow/config" {
  interface Register {
    Main: {
      alert: boolean;
    };
  }
}

const AlertDialogActivity: ActivityComponentType<"Main"> = ({ params }) => {
  const { alert } = params;
  const stack = useStack();
  const { pushStep, popStep } = useStepFlow("Main");

  const appBarLeft = () => <div>Left</div>;
  const appBarRight = () => <div>Right</div>;

  const onInteractOutside = () => {
    popStep();
  };

  const onButtonClick = () => {
    pushStep({
      alert: true,
    });
  };

  const mainActivitySteps = stack.activities[0].steps;

  return (
    <AppScreen
      appBar={{
        renderLeft: appBarLeft,
        renderRight: appBarRight,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <BoxButton onClick={onButtonClick}>Open</BoxButton>
        {alert && (
          <UIAlertDialog
            onInteractOutside={onInteractOutside}
            title="Title"
            description="Description"
          />
        )}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          padding: "8px",
        }}
      >
        <span style={{ fontSize: "12px", color: "var(--seed-semantic-color-divider-3)" }}>
          Steps
        </span>
        {mainActivitySteps.map((step) => (
          <div
            style={{
              fontSize: "12px",
              width: "1rem",
              height: "1rem",
              borderRadius: "50%",
              border: "1px solid var(--seed-semantic-color-divider-3)",
              margin: "8px",
            }}
            key={step.id}
          />
        ))}
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          padding: "8px",
          zIndex: 1000,
        }}
      >
        <BoxButton onClick={popStep}>Back</BoxButton>
      </div>
    </AppScreen>
  );
};

export default AlertDialogActivity;
