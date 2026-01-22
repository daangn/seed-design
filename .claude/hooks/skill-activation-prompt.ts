import { readFileSync } from "fs";
import { join } from "path";

// ===== 타입 정의 =====
interface HookInput {
  session_id: string;
  cwd: string;
  user_prompt: string;
  hook_event_name: string;
}

interface SkillRules {
  version: string;
  description: string;
  skills: Record<string, SkillDefinition>;
}

interface SkillDefinition {
  type: "domain" | "guardrail";
  enforcement: "suggest" | "block" | "warn";
  priority: "critical" | "high" | "medium" | "low";
  description: string;
  promptTriggers: {
    keywords?: string[];
    intentPatterns?: string[];
  };
}

interface MatchedSkill {
  name: string;
  config: SkillDefinition;
  matchType: "keyword" | "intent";
}

// ===== 컨텍스트 힌트 정의 =====
interface ContextHint {
  condition: (input: HookInput) => boolean;
  hint: string;
  priority: "warning" | "info";
}

const contextHints: ContextHint[] = [
  // 생성 파일 접근 감지
  {
    condition: (input) => {
      const prompt = input.user_prompt.toLowerCase();
      return (
        (prompt.includes("css") && prompt.includes("수정")) ||
        (prompt.includes("vars") && prompt.includes("변경")) ||
        prompt.includes("packages/css")
      );
    },
    hint: "packages/css/ 파일은 직접 수정 금지. rootage 수정 후 `bun generate:all` 실행하세요.",
    priority: "warning",
  },
  // packages/react-headless 작업 감지
  {
    condition: (input) =>
      input.cwd.includes("packages/react-headless") ||
      input.user_prompt.toLowerCase().includes("react-headless"),
    hint: "Headless 컴포넌트: 스타일 로직 제외, data-* 속성으로 상태 표현",
    priority: "info",
  },
  // packages/qvism-preset 작업 감지
  {
    condition: (input) =>
      input.cwd.includes("packages/qvism-preset") ||
      input.user_prompt.toLowerCase().includes("recipe"),
    hint: "Recipe 작성: hover 대신 active 사용 (모바일 우선), vars에서 토큰 참조",
    priority: "info",
  },
  // packages/react 작업 감지
  {
    condition: (input) =>
      input.cwd.includes("packages/react/") ||
      (input.user_prompt.toLowerCase().includes("react") &&
        input.user_prompt.toLowerCase().includes("컴포넌트")),
    hint: "React 컴포넌트: forwardRef + displayName 필수, Primitive.* 사용",
    priority: "info",
  },
  // 토큰/스타일 변경 감지
  {
    condition: (input) => {
      const prompt = input.user_prompt.toLowerCase();
      return (
        prompt.includes("토큰") ||
        prompt.includes("색상 변경") ||
        prompt.includes("color 변경") ||
        prompt.includes("theme 수정")
      );
    },
    hint: "토큰 변경: packages/rootage/*.yaml 수정 → bun generate:all",
    priority: "info",
  },
  // 컴포넌트 추가 감지
  {
    condition: (input) => {
      const prompt = input.user_prompt.toLowerCase();
      return (
        (prompt.includes("컴포넌트") && prompt.includes("추가")) ||
        (prompt.includes("component") && prompt.includes("add")) ||
        prompt.includes("새 컴포넌트") ||
        prompt.includes("new component")
      );
    },
    hint: "새 컴포넌트: @component-flow-guide 스킬로 전체 흐름 확인 권장",
    priority: "info",
  },
];

// ===== 메인 로직 =====
try {
  // 1. stdin에서 입력 읽기
  const input: HookInput = JSON.parse(readFileSync(0, "utf-8"));

  // 2. skill-rules.json 로드
  const rulesPath = join(input.cwd, ".claude/skills/skill-rules.json");
  const rules: SkillRules = JSON.parse(readFileSync(rulesPath, "utf-8"));

  // 3. 프롬프트 분석
  const prompt = input.user_prompt.toLowerCase();
  const matchedSkills: MatchedSkill[] = [];

  // 4. 각 스킬과 매칭
  for (const [skillName, config] of Object.entries(rules.skills)) {
    let matchType: "keyword" | "intent" | null = null;

    // 키워드 매칭
    if (config.promptTriggers.keywords) {
      const hasKeyword = config.promptTriggers.keywords.some((kw) =>
        prompt.includes(kw.toLowerCase()),
      );
      if (hasKeyword) matchType = "keyword";
    }

    // Intent 패턴 매칭
    if (!matchType && config.promptTriggers.intentPatterns) {
      const hasIntent = config.promptTriggers.intentPatterns.some((pattern) => {
        const regex = new RegExp(pattern, "i");
        return regex.test(input.user_prompt);
      });
      if (hasIntent) matchType = "intent";
    }

    if (matchType) {
      matchedSkills.push({ name: skillName, config, matchType });
    }
  }

  let message = "";

  if (matchedSkills.length > 0) {
    const critical = matchedSkills.filter((s) => s.config.priority === "critical");
    const high = matchedSkills.filter((s) => s.config.priority === "high");
    const medium = matchedSkills.filter((s) => s.config.priority === "medium");

    message = "╔════════════════════════════════════════════╗\n";
    message += "║  🎯 관련 스킬이 감지되었습니다             ║\n";
    message += "╚════════════════════════════════════════════╝\n\n";

    if (critical.length > 0) {
      message += "⚠️  필수 스킬:\n";
      critical.forEach((s) => {
        message += `  • @${s.name}\n`;
        message += `    ${s.config.description}\n`;
      });
      message += "\n";
    }

    if (high.length > 0) {
      message += "💡 권장 스킬:\n";
      high.forEach((s) => {
        message += `  • @${s.name}\n`;
        message += `    ${s.config.description}\n`;
      });
      message += "\n";
    }

    if (medium.length > 0) {
      message += "📌 참고 스킬:\n";
      medium.forEach((s) => {
        message += `  • @${s.name}\n`;
        message += `    ${s.config.description}\n`;
      });
      message += "\n";
    }

    message += "💬 응답하기 전에 Skill 도구를 사용하여 베스트 프랙티스를 확인하세요.\n";
  }

  const applicableHints = contextHints.filter((h) => h.condition(input));

  if (applicableHints.length > 0) {
    message += "\n📌 컨텍스트 힌트:\n";
    applicableHints.forEach((h) => {
      const icon = h.priority === "warning" ? "⚠️" : "💡";
      message += `  ${icon} ${h.hint}\n`;
    });
  }

  if (message) {
    console.log(
      JSON.stringify({
        systemMessage: message,
      }),
    );
  }
} catch {
  // 에러가 나도 hook이 실행을 방해하지 않도록 조용히 처리
  // 디버깅이 필요하면 stderr로 출력
  // console.error('Skill activation error:', error)
}
