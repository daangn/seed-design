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

  // 5. 매칭된 스킬이 있으면 출력
  if (matchedSkills.length > 0) {
    // 우선순위별로 그룹화
    const critical = matchedSkills.filter((s) => s.config.priority === "critical");
    const high = matchedSkills.filter((s) => s.config.priority === "high");
    const medium = matchedSkills.filter((s) => s.config.priority === "medium");

    // 한국어 메시지 생성
    let message = "╔════════════════════════════════════════════╗\n";
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

    // systemMessage로 출력 (non-blocking)
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
