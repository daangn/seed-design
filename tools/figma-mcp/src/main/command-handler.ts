/**
 * Command handler for the Figma plugin
 * This module imports all commands from their respective modules and provides a central handler
 */

// Import commands from their modules
import {
  addAnnotations,
  cloneNode,
  exportNodeAsImage,
  getAnnotations,
  getDocumentInfo,
  getNodeInfo,
  getNodesInfo,
  getSelection,
  setAutoLayout,
  setFillColor,
  setSize,
  setStrokeColor,
} from "./commands";

// Central command handler
export async function handleCommand(command: string, params: any): Promise<any> {
  switch (command) {
    case "get_document_info":
      return await getDocumentInfo();

    case "get_selection":
      return await getSelection();

    case "get_node_info":
      if (!params || !params.nodeId) {
        throw new Error("Missing nodeId parameter");
      }
      return await getNodeInfo(params.nodeId);

    case "get_nodes_info":
      if (!params || !params.nodeIds || !Array.isArray(params.nodeIds)) {
        throw new Error("Missing or invalid nodeIds parameter");
      }
      return await getNodesInfo(params.nodeIds);

    case "export_node_as_image":
      return await exportNodeAsImage(params);

    case "clone_node":
      return await cloneNode(params);

    case "add_annotations":
      return await addAnnotations(params);

    case "get_annotations":
      return await getAnnotations(params);

    case "set_fill_color":
      return await setFillColor(params);

    case "set_stroke_color":
      return await setStrokeColor(params);

    case "set_auto_layout":
      return await setAutoLayout(params);

    case "set_size":
      return await setSize(params);

    default:
      throw new Error(`Unknown command: ${command}`);
  }
}
