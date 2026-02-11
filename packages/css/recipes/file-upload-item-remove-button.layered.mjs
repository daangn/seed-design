import './file-upload-item-remove-button.layered.css';
import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

const defaultVariant = {};

const compoundVariants = [];

export const fileUploadItemRemoveButtonVariantMap = {};

export const fileUploadItemRemoveButtonVariantKeys = Object.keys(fileUploadItemRemoveButtonVariantMap);

export function fileUploadItemRemoveButton(props) {
  return createClassName(
    "seed-file-upload-item-remove-button",
    mergeVariants(defaultVariant, props),
    compoundVariants,
  );
}

Object.assign(fileUploadItemRemoveButton, { splitVariantProps: (props) => splitVariantProps(props, fileUploadItemRemoveButtonVariantMap) });

// @recipe(seed): file-upload-item-remove-button