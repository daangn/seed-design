import { defineComponentHandler } from "@/codegen/core";
import type {
  ActionButtonGhostProperties,
  ActionButtonProperties,
  AlertDialogFooterProperties,
  AlertDialogProperties,
} from "@/codegen/component-properties";
import * as metadata from "@/entities/data/__generated__/component-sets";
import { createLocalSnippetHelper, createSeedReactElement } from "../../element-factories";
import type { ComponentHandlerDeps } from "../deps.interface";
import { findAllInstances } from "@/utils/figma-node";
import { match } from "ts-pattern";
import {
  createActionButtonGhostHandler,
  createActionButtonHandler,
} from "@/codegen/targets/react/component/handlers/action-button";

const { createLocalSnippetElement } = createLocalSnippetHelper("alert-dialog");
const { createLocalSnippetElement: createLocalSnippetElementTrigger } =
  createLocalSnippetHelper("action-button");

export const createAlertDialogHandler = (ctx: ComponentHandlerDeps) => {
  const actionButtonHandler = createActionButtonHandler(ctx);
  const actionButtonGhostHandler = createActionButtonGhostHandler(ctx);

  return defineComponentHandler<AlertDialogProperties>(
    metadata.componentAlertDialog.key,
    (node, traverse) => {
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
        key: metadata.privateComponentAlertDialogActions.key,
      });

      if (footerNodes.length === 0 || footerNodes.length > 1) {
        return createLocalSnippetElement("AlertDialog", undefined, alertDialogHeader, {
          comment: "Footer 영역을 확인해주세요.",
        });
      }

      const footerNode = footerNodes[0];
      const footerNodeProps = traverse(footerNode)?.props;

      const buttons = footerNode.children.map(traverse);

      const alertDialogFooterChildren = match(footerNode.componentProperties.Type.value)
        .with("Single", () => buttons)
        .with("Neutral", "Critical", () =>
          createSeedReactElement("ResponsivePair", footerNodeProps, buttons),
        )
        .with("Neutral (Overflow)", "Critical (Overflow)", () =>
          createSeedReactElement("VStack", footerNodeProps, buttons),
        )
        .with("Nonpreferred", () => {
          const [actionButtonNode] = findAllInstances<ActionButtonProperties>({
            node: footerNode,
            key: actionButtonHandler.key,
          });

          const [ghostButtonNode] = findAllInstances<ActionButtonGhostProperties>({
            node: footerNode,
            key: actionButtonGhostHandler.key,
          });

          const actionButton = actionButtonHandler.transform(actionButtonNode, traverse);
          const ghostButton = actionButtonGhostHandler.transform(ghostButtonNode, traverse);

          const buttons = [
            actionButton,
            {
              ...ghostButton,
              props: {
                ...ghostButton.props,
                // nonpreferred shouldn't have bleedX, but in Figma it's not possible to represent that
                bleedX: undefined,
              },
            },
          ];

          return createSeedReactElement("VStack", footerNodeProps, buttons);
        })
        .exhaustive();

      const alertDialogFooter = createLocalSnippetElement(
        "AlertDialogFooter",
        undefined,
        alertDialogFooterChildren,
      );

      return createLocalSnippetElement("AlertDialogRoot", { open: true }, [
        createLocalSnippetElement(
          "AlertDialogTrigger",
          { asChild: true },
          createLocalSnippetElementTrigger("ActionButton", {}, "AlertDialog 열기"),
        ),
        createLocalSnippetElement("AlertDialogContent", undefined, [
          alertDialogHeader,
          alertDialogFooter,
        ]),
      ]);
    },
  );
};
