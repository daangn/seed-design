/**
 * Runs one MCP tool helper over both transports and diffs the two answers.
 *
 * Usage:
 *   bun packages/mcp/scripts/probe-transports.ts \
 *     --probe <tool> --transport both \
 *     --file-key <key> --node-id <id>
 *
 * `--file-key` falls back to `SEED_MCP_PROBE_FILE_KEY`.
 *
 * To cover a new tool, add an entry to `PROBES` below: point `run` at the helper the tool's
 * handler already calls (never at the REST/WebSocket API directly — the helper *is* what is under
 * test), and list in `ignore` the fields only one transport can produce. What belongs in `ignore`
 * and what must be reported instead is decided by the `seed-verify-figma-mcp-transports` skill.
 */
import { parseArgs } from "node:util";
import { v4 as uuidv4 } from "uuid";
import WebSocket from "ws";
import { createFigmaRestClient } from "../src/figma-rest-client";
import { fetchNodeAnnotations, type ToolContext } from "../src/tools-helpers";
import type { FigmaCommand } from "../src/types";

interface Probe {
  run: (params: { fileKey: string; nodeId: string }, context: ToolContext) => Promise<unknown>;
  ignore: readonly string[];
}

// A Map rather than an object literal so the `--probe` argument can look one up without a cast.
const PROBES = new Map<string, Probe>([
  [
    "get_annotations",
    {
      run: (params, context) => fetchNodeAnnotations(params, context),
      // The REST endpoint serializes neither the authored markdown nor the annotation's category.
      ignore: ["labelMarkdown", "category"],
    },
  ],
]);

// The plugin UI joins this channel unconditionally, so there is nothing for a caller to configure.
const CHANNEL = "local-default";

const { values } = parseArgs({
  options: {
    probe: { type: "string" },
    transport: { type: "string", default: "both" },
    "file-key": { type: "string" },
    "node-id": { type: "string" },
    port: { type: "string", default: "3055" },
    timeout: { type: "string", default: "30000" },
  },
});

function fail(message: string): never {
  console.error(message);
  process.exit(2);
}

const known = [...PROBES.keys()].join(", ");
const probeName = values.probe ?? fail(`--probe is required (one of: ${known})`);
const probe = PROBES.get(probeName) ?? fail(`unknown probe "${probeName}" (one of: ${known})`);

const transport = values.transport;
if (transport !== "rest" && transport !== "websocket" && transport !== "both") {
  fail(`--transport must be rest, websocket, or both (got "${transport}")`);
}

// No file is baked in: which document exercises a tool's edge cases depends on the tool and on what
// the person running this can open. `SEED_MCP_PROBE_FILE_KEY` is the convenience for repeat runs.
const fileKey =
  values["file-key"] ??
  process.env["SEED_MCP_PROBE_FILE_KEY"] ??
  fail("--file-key is required (or set SEED_MCP_PROBE_FILE_KEY)");
const nodeId = values["node-id"] ?? fail("--node-id is required");
const params = { fileKey, nodeId };

/**
 * A one-shot stand-in for `src/websocket.ts`. The real client auto-joins on `open` without exposing
 * anything to await and reconnects forever, so a script built on it can neither know when it is
 * safe to send nor exit on its own.
 */
function createProbeClient(port: number, timeoutMs: number) {
  const pending = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason: Error) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();

  const ws = new WebSocket(`ws://localhost:${port}`);

  ws.on("message", (raw) => {
    const frame: unknown = JSON.parse(String(raw));
    if (typeof frame !== "object" || frame === null || !("message" in frame)) return;

    // The relay's join acknowledgement arrives twice, once as a bare string.
    const message = frame.message;
    if (typeof message !== "object" || message === null || !("id" in message)) return;

    const id = message.id;
    if (typeof id !== "string") return;

    const request = pending.get(id);
    if (!request) return;

    // `handleMessage` in the relay broadcasts to every client in the channel *including the
    // sender*, so the request this script just sent comes straight back with a matching id. Only a
    // reply carries `result` or `error`; requiring one is how `websocket.ts` avoids resolving on
    // its own echo, and dropping this guard is the classic way to make a probe "pass" instantly.
    const error = "error" in message ? message.error : undefined;
    const hasResult = "result" in message;
    if (error === undefined && !hasResult) return;

    clearTimeout(request.timer);
    pending.delete(id);

    if (error !== undefined) {
      request.reject(new Error(String(error)));
      return;
    }

    request.resolve("result" in message ? message.result : undefined);
  });

  function sendCommand(command: FigmaCommand, commandParams: unknown = {}) {
    return new Promise<unknown>((resolve, reject) => {
      const id = uuidv4();
      const payload =
        typeof commandParams === "object" && commandParams !== null ? commandParams : {};

      const timer = setTimeout(() => {
        pending.delete(id);
        reject(
          new Error(
            `"${command}" timed out after ${timeoutMs}ms — the relay is up but nothing answered. Is the plugin running and connected?`,
          ),
        );
      }, timeoutMs);

      pending.set(id, { resolve, reject, timer });

      ws.send(
        JSON.stringify({
          id,
          type: command === "join" ? "join" : "message",
          channel: CHANNEL,
          message: { id, command, params: { ...payload, commandId: id } },
        }),
      );
    });
  }

  const ready = new Promise<void>((resolve, reject) => {
    ws.on("error", reject);
    ws.on("open", () => {
      sendCommand("join", { channel: CHANNEL }).then(() => resolve(), reject);
    });
  });

  return { ready, sendCommand, close: () => ws.close() };
}

async function runRest() {
  const personalAccessToken =
    process.env["FIGMA_PERSONAL_ACCESS_TOKEN"] ?? fail("FIGMA_PERSONAL_ACCESS_TOKEN is not set");

  return probe.run(params, {
    restClient: createFigmaRestClient(personalAccessToken),
    sendCommandToFigma: null,
    mode: "rest",
  });
}

async function runWebSocket() {
  const client = createProbeClient(Number(values.port), Number(values.timeout));
  await client.ready;

  try {
    // `mode` is load-bearing, not decoration: `resolveRestClient` hands back the context's REST
    // client for any mode but "websocket", and every helper prefers REST once it holds a client and
    // a fileKey. A stray client here would run REST twice and report a false pass.
    return await probe.run(params, {
      restClient: null,
      sendCommandToFigma: client.sendCommand,
      mode: "websocket",
    });
  } finally {
    client.close();
  }
}

/** Drops transport-only fields and sorts keys so the comparison survives differing key order. */
function normalize(value: unknown, ignore: readonly string[]): unknown {
  if (Array.isArray(value)) return value.map((item) => normalize(item, ignore));

  if (value === null || typeof value !== "object") return value;

  // Annotated rather than inferred: `Object.entries` widens its values to `any` for a bare object.
  const entries: [string, unknown][] = Object.entries(value);

  return Object.fromEntries(
    entries
      .filter(([key]) => !ignore.includes(key))
      .map(([key, item]) => [key, normalize(item, ignore)] as const)
      .sort(([a], [b]) => a.localeCompare(b)),
  );
}

if (transport === "rest") {
  console.log(JSON.stringify(await runRest(), null, 2));
  process.exit(0);
}

if (transport === "websocket") {
  console.log(JSON.stringify(await runWebSocket(), null, 2));
  process.exit(0);
}

const rest = await runRest();
const websocket = await runWebSocket();

const restNormalized = JSON.stringify(normalize(rest, probe.ignore), null, 2);
const websocketNormalized = JSON.stringify(normalize(websocket, probe.ignore), null, 2);

if (restNormalized === websocketNormalized) {
  console.log(`✓ ${probeName} ${fileKey}/${nodeId}: transports agree on every shared field`);
  console.log(`  ignored (transport-only): ${probe.ignore.join(", ") || "none"}`);
  process.exit(0);
}

console.error(`✗ ${probeName} ${fileKey}/${nodeId}: transports disagree`);
console.error(`\n--- REST (normalized) ---\n${restNormalized}`);
console.error(`\n--- WebSocket (normalized) ---\n${websocketNormalized}`);
console.error(
  "\nA difference is not automatically a bug. Classify the field first — see the `seed-verify-figma-mcp-transports` skill. Only a value one transport cannot produce at all belongs in this probe's `ignore`; anything the two sides merely render differently is reported, not silenced.",
);
process.exit(1);
