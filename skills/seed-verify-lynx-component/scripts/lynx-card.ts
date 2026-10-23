import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

type CardState = "acquired" | "opening" | "open";

interface LockRecord {
  version: 1;
  owner: string;
  clientId: string;
  debugRouterId: string;
  host: Record<string, unknown>;
  acquiredAt: string;
  heartbeatAt: string;
  ttlSeconds: number;
  state: CardState;
  baseline?: number[];
  requestedUrl?: string;
  sessionId?: number;
  error?: string;
  reclaimedFrom?: { owner: string; state: string; sessionId?: number };
}

interface Options {
  command: string;
  clientId: string;
  owner: string;
  waitSeconds: number;
  ttlSeconds: number;
  clientScope: boolean;
  hostTerminated: boolean;
  positionals: string[];
  passthrough: string[];
}

interface Session {
  session_id: number;
  url: string;
}

interface Client {
  id: string;
  info?: Record<string, unknown>;
}

/** 잠금을 얻지 못했거나 Card를 안전하게 정리하지 못한 상태다. 잠금은 그대로 둔다. */
class Blocked extends Error {
  constructor(
    message: string,
    readonly detail: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

const LOCK_DIR = process.env.AGENT_LYNX_LOCK_DIR ?? "/tmp";
const IDENTIFY_SECONDS = 30;
// 회수 중 Card 정리(evaluate·목록 재조회)가 끝날 시간보다 길게 둔다.
const RECLAIM_MUTEX_STALE_MS = 300_000;
// PlayLynx 1.4.0에서 확인한 임시 종료 경로다. CLI에 close 명령이 생기면 그것으로 바꾼다.
const CLOSE_EXPRESSION = "lynx.getNativeApp().nativeModuleProxy.NavigationModule.close()";
const HTTP_CONTEXT_FRAGMENT = /#__playlynx_http_context=.*$/;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();

function lockPath(clientId: string): string {
  return join(LOCK_DIR, `agent-lynx-client-${encodeURIComponent(clientId)}.lifecycle.lock`);
}

/** `agent-lynx`를 PATH에서, 없으면 `bunx`로 실행한다. */
async function agentLynx(args: string[], timeoutMs: number) {
  const command = Bun.which("agent-lynx") ? ["agent-lynx"] : ["bunx", "agent-lynx"];
  const child = Bun.spawn([...command, ...args], {
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, AGENT_LYNX_DISABLE_UPDATE_NOTICE: "1" },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { ok: code === 0, stdout, stderr: stderr.trim().split("\n").slice(-3).join("\n") };
}

async function agentLynxJson<T>(args: string[]): Promise<T> {
  const result = await agentLynx(args, 30_000);
  const start = result.stdout.search(/[[{]/);
  if (!result.ok || start < 0) {
    throw new Blocked(`agent-lynx ${args[0]} 실패`, { stderr: result.stderr });
  }
  return JSON.parse(result.stdout.slice(start)) as T;
}

async function findClient(clientId: string): Promise<Client | undefined> {
  const clients = await agentLynxJson<Client[]>(["list-clients"]);
  return clients.find((client) => client.id === clientId);
}

async function listSessions(clientId: string): Promise<Session[]> {
  return agentLynxJson<Session[]>(["list-sessions", "--client", clientId]);
}

/** 비교용 URL: 딥 링크는 안쪽 bundle URL로 풀고 PlayLynx가 붙이는 fragment는 뺀다. */
function normalizeUrl(url: string): string {
  const deepLink = url.match(/^lynx:\/\/open\?url=(.+)$/);
  const bundleUrl = deepLink?.[1] ? decodeURIComponent(deepLink[1]) : url;
  return bundleUrl.replace(HTTP_CONTEXT_FRAGMENT, "");
}

/** baseline에 없고 요청 URL과 같은 session만 이번 open이 만든 후보로 본다. */
function newCards(sessions: Session[], baseline: number[], requestedUrl: string): Session[] {
  const target = normalizeUrl(requestedUrl);
  return sessions.filter(
    (session) => !baseline.includes(session.session_id) && normalizeUrl(session.url) === target,
  );
}

async function readRecord(
  clientId: string,
): Promise<LockRecord | Record<string, unknown> | undefined> {
  try {
    return JSON.parse(await readFile(join(lockPath(clientId), "owner.json"), "utf8"));
  } catch {
    return undefined;
  }
}

async function writeRecord(record: LockRecord): Promise<void> {
  const file = join(lockPath(record.clientId), "owner.json");
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(record, null, 2)}\n`);
  await rename(temporary, file);
}

function isCurrent(record: unknown): record is LockRecord {
  return typeof record === "object" && record !== null && (record as LockRecord).version === 1;
}

function isStale(record: LockRecord): boolean {
  return Date.now() - Date.parse(record.heartbeatAt) > record.ttlSeconds * 1000;
}

/** 현재 owner가 잡은 잠금 기록을 돌려준다. 다른 owner가 회수했으면 즉시 멈춘다. */
async function heldRecord(options: Options): Promise<LockRecord> {
  const record = await readRecord(options.clientId);
  if (!isCurrent(record) || record.owner !== options.owner) {
    throw new Blocked(
      "이 owner가 잡은 잠금이 아니다. 조작을 멈추고 status로 현재 소유자를 확인한다.",
      {
        lock: lockPath(options.clientId),
        record,
      },
    );
  }
  return record;
}

async function renew(record: LockRecord): Promise<LockRecord> {
  const renewed = { ...record, heartbeatAt: now() };
  await writeRecord(renewed);
  return renewed;
}

async function closeSession(clientId: string, sessionId: number): Promise<void> {
  const closed = await agentLynx(
    ["evaluate", CLOSE_EXPRESSION, "--client", clientId, "--session", String(sessionId)],
    30_000,
  );
  // 종료 명령이 실패해도 연결이 끊기며 닫혔을 수 있어 목록을 잠깐 확인한다.
  const waitSeconds = closed.ok ? IDENTIFY_SECONDS : 3;
  for (let elapsed = 0; elapsed <= waitSeconds; elapsed++) {
    const sessions = await listSessions(clientId);
    if (!sessions.some((session) => session.session_id === sessionId)) return;
    await sleep(1000);
  }
  throw new Blocked(`session ${sessionId}이 목록에서 사라지지 않았다.`, {
    clientId,
    sessionId,
    closeResult: closed.ok ? closed.stdout.trim() : closed.stderr,
  });
}

/**
 * 기록된 owner의 Card를 정리한다. 기록으로 확정한 session만 닫고,
 * 확정할 수 없으면 Blocked로 멈춘다. 이미 사라진 session은 정리된 것으로 본다.
 */
async function cleanupCard(record: LockRecord): Promise<number | undefined> {
  if (record.state === "acquired") return undefined;

  const client = await findClient(record.clientId);
  if (client?.info?.debugRouterId !== record.debugRouterId) {
    throw new Blocked("기록한 host가 목록에 없거나 바뀌었다. 남은 Card를 확인할 수 없다.", {
      clientId: record.clientId,
      recordedDebugRouterId: record.debugRouterId,
      currentDebugRouterId: client?.info?.debugRouterId,
    });
  }

  const sessions = await listSessions(record.clientId);
  let sessionId = record.sessionId;
  if (record.state === "opening") {
    const candidates = newCards(sessions, record.baseline ?? [], record.requestedUrl ?? "");
    if (candidates.length > 1) {
      throw new Blocked("open 뒤 생긴 후보가 여럿이라 소유 session을 확정할 수 없다.", {
        baseline: record.baseline,
        candidates,
      });
    }
    sessionId = candidates[0]?.session_id;
  }
  if (sessionId === undefined || !sessions.some((session) => session.session_id === sessionId)) {
    return undefined;
  }
  await closeSession(record.clientId, sessionId);
  return sessionId;
}

/** 만료된 잠금을 회수한다. 회수 mutex를 얻은 한 프로세스만 이전 Card를 정리하고 기록을 넘겨받는다. */
async function reclaim(stale: LockRecord, fresh: LockRecord): Promise<LockRecord | undefined> {
  const mutex = join(lockPath(stale.clientId), "reclaim");
  try {
    await mkdir(mutex);
  } catch {
    const mutexStat = await stat(mutex).catch(() => undefined);
    if (mutexStat && Date.now() - mutexStat.mtimeMs > RECLAIM_MUTEX_STALE_MS) {
      await rm(mutex, { recursive: true, force: true });
    }
    return undefined;
  }
  try {
    const current = await readRecord(stale.clientId);
    if (
      !isCurrent(current) ||
      current.heartbeatAt !== stale.heartbeatAt ||
      current.owner !== stale.owner
    ) {
      return undefined;
    }
    try {
      const closedSessionId = await cleanupCard(current);
      const record: LockRecord = {
        ...fresh,
        reclaimedFrom: { owner: current.owner, state: current.state, sessionId: closedSessionId },
      };
      await writeRecord(record);
      return record;
    } catch (error) {
      await writeRecord({ ...current, error: `회수 실패 ${now()}: ${(error as Error).message}` });
      throw error;
    }
  } finally {
    await rm(mutex, { recursive: true, force: true });
  }
}

async function acquire(options: Options) {
  const client = await findClient(options.clientId);
  const debugRouterId = client?.info?.debugRouterId;
  if (!client || typeof debugRouterId !== "string") {
    throw new Blocked(
      "client가 목록에 없거나 debugRouterId가 없다. list-clients로 대상을 다시 고른다.",
      {
        clientId: options.clientId,
      },
    );
  }
  const fresh = (): LockRecord => ({
    version: 1,
    owner: options.owner,
    clientId: options.clientId,
    debugRouterId,
    host: client.info ?? {},
    acquiredAt: now(),
    heartbeatAt: now(),
    ttlSeconds: options.ttlSeconds,
    state: "acquired",
  });

  const deadline = Date.now() + options.waitSeconds * 1000;
  let holder: unknown;
  while (true) {
    try {
      await mkdir(lockPath(options.clientId));
      const record = fresh();
      await writeRecord(record);
      return { result: "acquired", lock: lockPath(options.clientId), record };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    }
    holder = await readRecord(options.clientId);
    if (isCurrent(holder)) {
      if (holder.owner === options.owner) {
        return {
          result: "already-held",
          lock: lockPath(options.clientId),
          record: await renew(holder),
        };
      }
      if (isStale(holder)) {
        const record = await reclaim(holder, fresh());
        if (record) return { result: "reclaimed", lock: lockPath(options.clientId), record };
      }
    }
    if (Date.now() >= deadline) break;
    await sleep(1000);
  }
  throw new Blocked(
    isCurrent(holder)
      ? "다른 owner가 잠금을 유지하고 있다."
      : holder === undefined
        ? "잠금에 owner 기록이 없다. 다른 owner가 방금 얻는 중일 수 있으니 다시 시도한다."
        : "이전 규약의 잠금이라 자동 회수하지 않는다. 기록의 owner에게 확인하거나 사람에게 정리를 요청한다.",
    { lock: lockPath(options.clientId), holder },
  );
}

async function open(options: Options) {
  const url = options.positionals[0];
  if (!url) throw new Error("open에는 bundle URL이 필요하다.");
  let record = await heldRecord(options);
  if (record.state !== "acquired") {
    throw new Blocked(
      "이미 Card를 열었거나 정리하지 못한 기록이 있다. 같은 session을 reload하거나 release한다.",
      {
        record,
      },
    );
  }
  const client = await findClient(options.clientId);
  if (client?.info?.debugRouterId !== record.debugRouterId) {
    throw new Blocked("잠금을 얻은 뒤 host가 바뀌었다. release 후 client를 다시 고른다.", {
      record,
      client,
    });
  }

  const baseline = (await listSessions(options.clientId)).map((session) => session.session_id);
  record = { ...record, heartbeatAt: now(), state: "opening", baseline, requestedUrl: url };
  await writeRecord(record);
  // open은 한 번만 호출한다. 실패·timeout이어도 Card가 생겼을 수 있으므로 목록으로 판정한다.
  const opened = await agentLynx(["open", url, "--client", options.clientId], 60_000).catch(
    (error: Error) => ({
      ok: false,
      stdout: "",
      stderr: error.message,
    }),
  );

  let candidates: Session[] = [];
  for (let elapsed = 0; elapsed <= IDENTIFY_SECONDS; elapsed++) {
    candidates = newCards(await listSessions(options.clientId), baseline, url);
    if (candidates.length > 0) break;
    await sleep(1000);
  }
  const [card] = candidates;
  if (candidates.length !== 1 || !card) {
    throw new Blocked(
      "이번 open의 session 하나를 확정하지 못했다. 다시 open하지 말고 release로 정리를 시도한다.",
      {
        baseline,
        candidates,
        openResult: opened.ok ? "ok" : opened.stderr,
      },
    );
  }
  record = { ...record, heartbeatAt: now(), state: "open", sessionId: card.session_id };
  await writeRecord(record);
  return {
    result: "opened",
    clientId: options.clientId,
    sessionId: card.session_id,
    url: card.url,
  };
}

/** 소유 client/session을 붙여 agent-lynx를 실행하고 heartbeat를 갱신한다. */
async function exec(options: Options): Promise<number> {
  const record = await renew(await heldRecord(options));
  const target = ["--client", options.clientId];
  if (!options.clientScope) {
    if (record.state !== "open" || record.sessionId === undefined) {
      throw new Blocked("열린 소유 session이 없다. open을 먼저 한다.", { record });
    }
    target.push("--session", String(record.sessionId));
  }
  const command = Bun.which("agent-lynx") ? ["agent-lynx"] : ["bunx", "agent-lynx"];
  const child = Bun.spawn([...command, ...options.passthrough, ...target], {
    stdio: ["inherit", "inherit", "inherit"],
    env: { ...process.env, AGENT_LYNX_DISABLE_UPDATE_NOTICE: "1" },
  });
  return child.exited;
}

async function release(options: Options) {
  const record = await heldRecord(options);
  try {
    if (options.hostTerminated) {
      // 직접 실행한 앱을 종료해 Card를 정리한 경우다. 같은 host가 목록에 남아 있으면 인정하지 않는다.
      const clients = await agentLynxJson<Client[]>(["list-clients"]);
      if (clients.some((client) => client.info?.debugRouterId === record.debugRouterId)) {
        throw new Blocked("기록한 host가 아직 목록에 있다. 앱 종료를 확인한 뒤 다시 release한다.", {
          record,
        });
      }
      await rm(lockPath(options.clientId), { recursive: true, force: true });
      return { result: "released", clientId: options.clientId, hostTerminated: true };
    }
    const closedSessionId = await cleanupCard(record);
    await rm(lockPath(options.clientId), { recursive: true, force: true });
    return { result: "released", clientId: options.clientId, closedSessionId };
  } catch (error) {
    // state는 그대로 두어 다음 release나 회수가 같은 기준으로 다시 정리하게 한다.
    await writeRecord({ ...record, heartbeatAt: now(), error: (error as Error).message });
    throw error;
  }
}

async function status(options: Options) {
  const record = await readRecord(options.clientId);
  if (!record) return { result: "free", lock: lockPath(options.clientId) };
  return {
    result: "locked",
    lock: lockPath(options.clientId),
    heldByMe: isCurrent(record) && record.owner === options.owner,
    stale: isCurrent(record) ? isStale(record) : "legacy",
    record,
  };
}

async function defaultOwner(): Promise<string> {
  const result = Bun.spawnSync(["git", "rev-parse", "--show-toplevel"]);
  return result.success ? result.stdout.toString().trim() : process.cwd();
}

function parseArguments(args: string[], owner: string): Options {
  const separator = args.indexOf("--");
  const own = separator < 0 ? args : args.slice(0, separator);
  const options: Options = {
    command: own[0] ?? "",
    clientId: "",
    owner,
    waitSeconds: 60,
    ttlSeconds: 600,
    clientScope: false,
    hostTerminated: false,
    positionals: [],
    passthrough: separator < 0 ? [] : args.slice(separator + 1),
  };
  for (let index = 1; index < own.length; index++) {
    const argument = own[index] as string;
    const value = own[index + 1];
    if (argument === "--client-scope") {
      options.clientScope = true;
    } else if (argument === "--host-terminated") {
      options.hostTerminated = true;
    } else if (argument.startsWith("--")) {
      if (value === undefined) throw new Error(`${argument}에 값이 필요하다.`);
      index++;
      if (argument === "--client") options.clientId = value;
      else if (argument === "--owner") options.owner = value;
      else if (argument === "--wait") options.waitSeconds = Number(value);
      else if (argument === "--ttl") options.ttlSeconds = Number(value);
      else throw new Error(`알 수 없는 인자입니다: ${argument}`);
    } else {
      options.positionals.push(argument);
    }
  }
  if (!["acquire", "open", "exec", "renew", "release", "status"].includes(options.command)) {
    throw new Error(
      "명령: acquire | open <url> | exec [--client-scope] -- <args> | renew | release [--host-terminated] | status",
    );
  }
  if (!options.clientId) throw new Error("--client <clientId>가 필요하다.");
  return options;
}

if (import.meta.main) {
  try {
    const options = parseArguments(process.argv.slice(2), await defaultOwner());
    if (options.command === "exec") {
      process.exitCode = await exec(options);
    } else {
      const commands = {
        acquire,
        open,
        release,
        status,
        renew: async (o: Options) => ({
          result: "renewed",
          record: await renew(await heldRecord(o)),
        }),
      };
      const result = await commands[options.command as keyof typeof commands](options);
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    const detail = error instanceof Blocked ? error.detail : {};
    console.log(
      JSON.stringify({ result: "blocked", reason: (error as Error).message, ...detail }, null, 2),
    );
    process.exitCode = 1;
  }
}
