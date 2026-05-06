import { randomUUID } from "node:crypto";
import * as p from "@clack/prompts";
import { getRawConfig } from "./get-config";

const EVENT_PREFIX = "seed_cli";
const COMMAND_STATUSES = ["completed", "cancelled", "failed"] as const;

interface TrackOptions {
  event: string;
  properties?: Record<string, unknown>;
}

interface TrackCommandOutcomeOptions {
  command: string;
  status: (typeof COMMAND_STATUSES)[number];
  result?: string;
  properties?: Record<string, unknown>;
}

interface TrackCommandFailureOptions {
  command: string;
  error: unknown;
  result?: string;
  properties?: Record<string, unknown>;
}

/**
 * 텔레메트리 활성화 여부를 확인합니다.
 * 우선순위:
 * 1. 환경 변수 DISABLE_TELEMETRY
 * 2. 환경 변수 SEED_DISABLE_TELEMETRY
 * 3. seed-design.json의 telemetry 설정
 * 4. 기본값 true (Opt-out)
 */
async function isTelemetryEnabled(cwd: string): Promise<boolean> {
  // 1. 환경 변수 체크
  if (process.env.DISABLE_TELEMETRY === "true") return false;
  if (process.env.SEED_DISABLE_TELEMETRY === "true") return false;

  // 2. seed-design.json 체크
  try {
    const config = await getRawConfig(cwd);
    if (config?.telemetry === false) return false;
  } catch {
    // 설정 파일이 없거나 읽기 실패 시 기본값 사용
  }

  // 3. 기본값
  return true;
}

/**
 * 익명 세션 ID를 생성합니다.
 * 각 CLI 실행마다 새로운 UUID가 생성됩니다.
 */
function generateSessionId(): string {
  return randomUUID();
}

// 세션당 한 번만 생성
const sessionId = generateSessionId();

// 세션당 한 번만 메시지 표시
let hasShownMessage = false;

function omitUndefined(properties: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined));
}

function getSafeErrorType(error: unknown): string {
  if (error instanceof Error && error.name) {
    return error.name;
  }

  if (typeof error === "object" && error !== null) {
    return error.constructor?.name ?? "Object";
  }

  return typeof error;
}

/**
 * PostHog에 이벤트를 전송합니다.
 */
async function track(cwd: string, { event, properties = {} }: TrackOptions): Promise<void> {
  const enabled = await isTelemetryEnabled(cwd);

  if (!enabled) {
    return;
  }

  const fullEvent = `${EVENT_PREFIX}.${event}`;

  // Dev 모드: 텔레메트리 전송 생략
  if (process.env.NODE_ENV === "dev") {
    return;
  }

  // 사용자에게 텔레메트리 수집 중임을 알림 (세션당 한 번만)
  if (!hasShownMessage) {
    p.log.info(
      "📊 사용 데이터 수집 중 (비활성화: seed-design.json 또는 DISABLE_TELEMETRY 환경 변수)",
    );
    hasShownMessage = true;
  }

  // PostHog API 호출 (fire-and-forget)
  try {
    if (!process.env.POSTHOG_HOST || !process.env.POSTHOG_API_KEY) {
      console.error(
        "[Telemetry] POSTHOG_HOST 또는 POSTHOG_API_KEY가 없어서 이벤트를 전송하지 않아요.",
      );
      return;
    }

    const url = `${process.env.POSTHOG_HOST}/capture`;
    const headers = {
      "Content-Type": "application/json",
    };

    const payload = {
      api_key: process.env.POSTHOG_API_KEY,
      event: fullEvent,
      distinct_id: sessionId,
      properties: {
        ...properties,
        $process_person_profile: false,
      },
      timestamp: new Date().toISOString(),
    };
    // 5초 타임아웃 설정
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    // 에러 발생 시 조용히 무시 (CLI 블로킹 방지)
  }
}

async function trackCommandOutcome(
  cwd: string,
  { command, status, result, properties = {} }: TrackCommandOutcomeOptions,
): Promise<void> {
  await track(cwd, {
    event: command,
    properties: omitUndefined({
      status,
      result,
      ...properties,
    }),
  });
}

async function trackCommandFailure(
  cwd: string,
  { command, error, result, properties = {} }: TrackCommandFailureOptions,
): Promise<void> {
  await trackCommandOutcome(cwd, {
    command,
    status: "failed",
    result,
    properties: omitUndefined({
      error_type: getSafeErrorType(error),
      ...properties,
    }),
  });
}

export const analytics = {
  track,
  trackCommandFailure,
  trackCommandOutcome,
};
