// TypeScript interfaces for Figma API communication

/**
 * Basic response from Figma WebSocket API
 */
export interface FigmaResponse {
  id: string;
  result?: any;
  error?: string;
}

/**
 * Progress update for long-running commands
 */
export interface CommandProgressUpdate {
  type: "command_progress";
  commandId: string;
  commandType: string;
  status: "started" | "in_progress" | "completed" | "error";
  progress: number;
  totalItems: number;
  processedItems: number;
  currentChunk?: number;
  totalChunks?: number;
  chunkSize?: number;
  message: string;
  payload?: any;
  timestamp: number;
}

/**
 * Command types supported by the Figma plugin
 */
export type FigmaCommand =
  | "get_document_info"
  | "get_selection"
  | "get_node_info"
  | "get_nodes_info"
  | "export_node_as_image"
  | "join"
  | "clone_node"
  | "add_annotations"
  | "get_annotations"
  | "set_fill_color"
  | "set_stroke_color"
  | "set_auto_layout"
  | "set_size";

/**
 * Pending request information
 */
export interface PendingRequest {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timeout: ReturnType<typeof setTimeout>;
  lastActivity: number;
}

/**
 * WebSocket message from Figma
 */
export interface FigmaWebSocketMessage {
  message: FigmaResponse | any;
  type?: string;
  id?: string;
  [key: string]: any;
}
