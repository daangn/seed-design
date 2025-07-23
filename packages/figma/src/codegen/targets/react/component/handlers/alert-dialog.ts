import { defineComponentHandler } from "@/codegen/core";
import type {
  AlertDialogFooterProperties,
  AlertDialogProperties,
} from "@/codegen/component-properties";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { findAllInstances } from "@/utils/figma-node";
const { createLocalSnippetElement } = createLocalSnippetHelper("alert-dialog");

const ALERT_DIALOG_FOOTER_KEY = "00b1b131d67edf2875a7a1df8dfa88098d7c04be";

export const createAlertDialogHandler = (_ctx: ComponentHandlerDeps) =>
  defineComponentHandler<AlertDialogProperties>(metadata.alertDialog.key, (node, traverse) => {
    const props = node.componentProperties;
    const alertDialogHeader = createLocalSnippetElement("AlertDialogHeader", undefined, [
      ...(props["Show Title#20361:14"].value
        ? [
            createLocalSnippetElement(
              "AlertDialogTitle",
              undefined,
              props["Title Text#20361:0"].value,
            ),
          ]
        : []),
      createLocalSnippetElement(
        "AlertDialogDescription",
        undefined,
        props["Description Text#20361:7"].value,
      ),
    ]);

    const footerNodes = findAllInstances<AlertDialogFooterProperties>({
      node,
      key: ALERT_DIALOG_FOOTER_KEY,
    });

    if (footerNodes.length === 0 || footerNodes.length > 1) {
      return createLocalSnippetElement("AlertDialog", undefined, alertDialogHeader, {
        comment: "Footer 영역을 확인해주세요.",
      });
    }

    const footerNode = footerNodes[0];
    const footerNodeProps = traverse(footerNode)?.props;

    const buttons = footerNode.children.map(traverse);

    const alertDialogFooterChildren = (() => {
      switch (footerNode.componentProperties.Type.value) {
        case "Single":
          // 컨테이너 없이 제공
          return buttons;
        case "Neutral":
        case "Critical":
          // overflow 시 wrap
          return createSeedReactElement("ResponsivePair", footerNodeProps, buttons);
        case "Neutral (Overflow)":
        case "Critical (Overflow)":
        case "Nonpreferred":
          // 항상 vertical stack
          return createSeedReactElement("VStack", footerNodeProps, buttons);
      }
    })();

    const alertDialogFooter = createLocalSnippetElement(
      "AlertDialogFooter",
      undefined,
      alertDialogFooterChildren,
    );

    return createLocalSnippetElement("AlertDialog", undefined, [
      alertDialogHeader,
      alertDialogFooter,
    ]);
  });
