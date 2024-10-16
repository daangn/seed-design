"use client";

import "@seed-design/stylesheet/dialog.css";

import * as React from "react";
import { dialog } from "@seed-design/recipe/dialog";

import { ActionButton } from "./action-button";

export type AlertDialogProps = {
  title: string;
  description: string;
  onInteractOutside?: React.MouseEventHandler;
};

/**
 * @see https://v3.seed-design.io/docs/react/components/alert-dialog
 */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  title,
  description,
  onInteractOutside,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);

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
  };
  const onClickContent: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const classNames = dialog();

  return (
    <div
      ref={containerRef}
      role="alertdialog"
      className={classNames.container}
      onClick={onClickOutside}
    >
      <div ref={backdropRef} className={classNames.backdrop} />
      <div onClick={onClickContent} className={classNames.content}>
        <div className={classNames.header}>
          <h2 className={classNames.title}>{title}</h2>
          <p className={classNames.description}>{description}</p>
        </div>
        <div className={classNames.footer}>
          <ActionButton className={classNames.action}>lol</ActionButton>
          <ActionButton className={classNames.action}>lol</ActionButton>
        </div>
      </div>
    </div>
  );
};
AlertDialog.displayName = "AlertDialog";
