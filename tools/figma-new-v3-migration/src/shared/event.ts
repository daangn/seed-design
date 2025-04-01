import { createEventSystem } from "@figmazing/event";
import type { PluginEventMap } from "./types";

export const events = createEventSystem<PluginEventMap>();
