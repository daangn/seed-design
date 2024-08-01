"use client";

import "@seed-design/stylesheet/dialog.css";

import * as React from "react";
import { dialog } from "@seed-design/recipe/dialog";
import { useStyleEffect } from "@stackflow/plugin-basic-ui";
import { useActions, useActivity } from "@stackflow/react";

import { BoxButton } from "./box-button";

export type AlertDialogProps = {
  title: string;
  description: string;
  onInteractOutside?: React.MouseEventHandler;
};

export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  description,
  onInteractOutside,
}) => {
  const activity = useActivity();
  const { pop } = useActions();

  const containerRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);

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

  const popLock = React.useRef(false);

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
  const transitionState = activity?.transitionState ?? "enter-done";

  const classNames = dialog();

  return (
    <div
      ref={containerRef}
      role="alertdialog"
      data-stackflow-component-name="AlertDialog"
      data-stackflow-activity-id={activity?.id}
      data-stackflow-activity-is-active={activity?.isActive}
      className={classNames.container}
      style={{ zIndex: zIndexBase }}
      onClick={onClickOutside}
    >
      <div ref={backdropRef} className={classNames.backdrop} />
      <div onClick={onClickContent} className={classNames.content}>
        <div className={classNames.header}>
          <h2 className={classNames.title}>{title}</h2>
          <p className={classNames.description}>{description}</p>
        </div>
        <div className={classNames.footer}>
          <BoxButton className={classNames.action}>lol</BoxButton>
          <BoxButton className={classNames.action}>lol</BoxButton>
        </div>
      </div>
    </div>
  );
};

AlertDialog.displayName = "AlertDialog";
