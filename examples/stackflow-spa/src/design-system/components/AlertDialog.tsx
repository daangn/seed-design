import { useActions, useActivity } from "@stackflow/react";
import { useRef } from "react";

import { useStyleEffect } from "@stackflow/plugin-basic-ui";

export type AlertDialogProps = {
  title: string;
  description: string;
  onInteractOutside?: React.MouseEventHandler;
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  description,
  onInteractOutside,
}) => {
  const activity = useActivity();
  const { pop } = useActions();

  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useStyleEffect({
    styleName: "hide",
    refs: [containerRef],
  });
  useStyleEffect({
    styleName: "offset",
    refs: [backdropRef],
  });
  useStyleEffect({
    styleName: "swipe-back",
    refs: [backdropRef],
  });

  const popLock = useRef(false);

  const onClickOutside: React.MouseEventHandler = (e) => {
    onInteractOutside?.(e);

    if (e.defaultPrevented) {
      return;
    }

    if (popLock.current) {
      return;
    }
    popLock.current = true;

    pop();
  };
  const onClickContent: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const zIndexBase = (activity?.zIndex ?? 0) * 5 + 3;
  const zIndexContent = (activity?.zIndex ?? 0) * 5 + 4;
  const transitionState = activity?.transitionState ?? "enter-done";

  return (
    <div
      ref={containerRef}
      role="alertdialog"
      data-stackflow-component-name="AlertDialog"
      data-stackflow-activity-id={activity?.id}
      data-stackflow-activity-is-active={activity?.isActive}
      onClick={onClickOutside}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: zIndexBase,
      }}
    >
      <div
        ref={backdropRef}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <div
        onClick={onClickContent}
        style={{
          margin: "auto",
          backgroundColor: "white",
          zIndex: zIndexContent,
          padding: "20px",
          transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1)",
          transform:
            transitionState === "enter-done"
              ? "translateY(0)"
              : "translateY(100%)",
        }}
      >
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

AlertDialog.displayName = "AlertDialog";

export default AlertDialog;
