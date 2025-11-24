import * as p from "@clack/prompts";
import { getConfig } from "./get-config";
import os from "os";
import { highlight } from "@/src/utils/color";
import { simpleGit } from "simple-git";
import { randomUUID } from "crypto";

const EVENT_PREFIX = "seed_cli";

interface TrackOptions {
  event: string;
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
const isTelemetryEnabled = await (async () => {
  // 1. 환경 변수 체크
  if (process.env.DISABLE_TELEMETRY === "true") return false;
  if (process.env.SEED_DISABLE_TELEMETRY === "true") return false;

  // 2. seed-design.json 체크
  try {
    const config = await getConfig(process.cwd());
    if (config?.telemetry === false) return false;
  } catch {
    // 설정 파일이 없거나 읽기 실패 시 기본값 사용
  }

  // 3. 기본값
  return true;
})();

// 세션당 한 번만 생성
const userInfo = {
  userAgent:
    typeof navigator !== "undefined" && navigator.userAgent
      ? navigator.userAgent
      : `Unavailable (${process.release.name} ${process.version})`,
  os: `${os.type()} ${os.version()} ${os.arch()}`,
  // username: os.userInfo().username,
};

// 세션당 한 번만 메시지 표시
let hasShownDisclaimer = false;

function showDisclaimer() {
  if (isTelemetryEnabled === false || hasShownDisclaimer) return;

  p.log.info(
    `${highlight("📊 SEED CLI는 사용 데이터를 수집합니다.")}
비활성화하려면 seed-design.json에서 \`{ telemetry: false }\`를 설정하거나 DISABLE_TELEMETRY=true 환경 변수를 설정하세요.
수집되는 정보: JavaScript 런타임 및 운영 체제, Git 원격 저장소 URL 및 브랜치 이름, SEED CLI 명령어 사용 정보`,
  );

  hasShownDisclaimer = true;
}

const gitInfo = await (async () => {
  const git = simpleGit();

  try {
    const { current } = await git.branchLocal();
    const remotes = (await git.getRemotes(true)).map(({ name, refs: { fetch } }) => ({
      name,
      url: fetch,
    }));

    const origin = remotes.find(({ name }) => name === "origin") ?? remotes[0];

    return {
      origin: origin?.url ?? null,
      branch: current,
    };
  } catch {
    return null;
  }
})();

const sessionId = randomUUID();

/**
 * PostHog에 이벤트를 전송합니다.
 */
async function track({ event, properties = {} }: TrackOptions): Promise<void> {
  if (isTelemetryEnabled === false) return;

  const fullEvent = `${EVENT_PREFIX}.${event}`;

  // Dev 모드: 콘솔에만 출력
  if (process.env.NODE_ENV === "dev") {
    console.log(`📊 [Telemetry] ${fullEvent}`, properties);

    return;
  }

  // PostHog API 호출 (fire-and-forget)
  try {
    if (!process.env.POSTHOG_HOST || !process.env.POSTHOG_API_KEY) {
      console.warn("[Analytics] Missing POSTHOG_HOST or POSTHOG_API_KEY");
      return;
    }

    const url = `${process.env.POSTHOG_HOST}/capture`;
    const headers = {
      "Content-Type": "application/json",
    };

    const payload = {
      api_key: process.env.POSTHOG_API_KEY,
      event: fullEvent,
      // distinct_id: `cli.${userInfo.username}`,
      distinct_id: sessionId,
      properties: {
        ...properties,
        ...userInfo,
        ...gitInfo,
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

export const analytics = {
  track,
  showDisclaimer,
};
