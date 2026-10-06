import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { parse } from "yaml";

type Learning = {
  id: string;
  description: string;
  scope: string[];
  status: string;
  promotedTo: string[];
  path: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function record(value: unknown): Record<string, unknown> {
  if (!isRecord(value)) throw new Error("Expected object");
  return value;
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    throw new Error("Expected string array");
  }
  return value;
}

export function readLearning(path: string, source: string): Learning {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!frontmatter) throw new Error(`Missing frontmatter: ${path}`);
  const meta = record(parse(frontmatter[1]));
  if (typeof meta.id !== "string" || typeof meta.description !== "string") {
    throw new Error(`Missing identity: ${path}`);
  }
  if (
    typeof meta.status !== "string" ||
    !["active", "promoted", "superseded", "retired"].includes(meta.status)
  ) {
    throw new Error(`Invalid status: ${path}`);
  }
  const promotedTo = meta.promoted_to === undefined ? [] : strings(meta.promoted_to);
  if (meta.status === "promoted" && promotedTo.length === 0) {
    throw new Error(`Missing promotion target: ${path}`);
  }
  return {
    id: meta.id,
    description: meta.description,
    scope: strings(meta.scope),
    status: meta.status,
    promotedTo,
    path,
  };
}

export function verifyPromotions(learnings: Learning[], paths: Set<string>): void {
  const ids = new Set<string>();
  for (const learning of learnings) {
    if (ids.has(learning.id)) throw new Error(`Duplicate learning: ${learning.id}`);
    ids.add(learning.id);
    for (const target of learning.promotedTo) {
      if (!paths.has(target)) throw new Error(`Missing target: ${learning.id} -> ${target}`);
    }
  }
}

export function buildMap(root: string) {
  const files = [
    ...new Set(
      execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
        cwd: root,
        encoding: "utf8",
      })
        .split("\0")
        .filter((path) => path && existsSync(resolve(root, path))),
    ),
  ].sort();
  const learnings = files
    .filter((path) => /^\.agents\/learnings\/entries\/[^/]+\.md$/.test(path))
    .map((path) => readLearning(path, readFileSync(resolve(root, path), "utf8")));
  verifyPromotions(learnings, new Set(files));
  const settings = record(JSON.parse(readFileSync(resolve(root, ".claude/settings.json"), "utf8")));
  const hooks = Object.entries(record(settings.hooks)).flatMap(([event, groups]) => {
    if (!Array.isArray(groups)) throw new Error(`Invalid hook groups: ${event}`);
    return groups.flatMap((group) => {
      const value = record(group);
      if (!Array.isArray(value.hooks)) throw new Error(`Invalid hooks: ${event}`);
      return value.hooks.map((hook) => {
        const command = record(hook).command;
        if (typeof command !== "string") throw new Error(`Invalid command: ${event}`);
        return { event, matcher: typeof value.matcher === "string" ? value.matcher : "", command };
      });
    });
  });
  const inventory = {
    instructions: files.filter((path) => /(^|\/)AGENTS\.md$/.test(path)),
    skills: files.filter((path) => /^skills\/[^/]+\/SKILL\.md$/.test(path)),
    decisions: files.filter(
      (path) =>
        /^decisions\/[^/]+\.md$/.test(path) ||
        path === "skills/seed-component/references/architecture-decisions.md",
    ),
    ci: files.filter((path) => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(path)),
  };
  return { inventory, learnings, hooks };
}

export function renderMap(data: ReturnType<typeof buildMap>): string {
  const payload = JSON.stringify(data).replaceAll("<", "\\u003c");
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SEED Harness Map</title>
<style>body{font:16px/1.7 system-ui;margin:0;color:#223029;background:#f7faf5}main{max-width:1080px;margin:auto;padding:32px 24px}h1{line-height:1.3}h2{margin-top:32px}a{color:#26613a}small{color:#53645b}section{background:white;padding:20px;margin:16px 0;border:1px solid #dce5d9;border-radius:12px}.flow{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.flow div{padding:16px;border:1px solid #dce5d9;border-radius:8px}.flow b{display:block}input,select{font:inherit;padding:8px;max-width:100%;margin:4px 8px 8px 0}.row{padding:14px 0;border-top:1px solid #e3e9df}code{overflow-wrap:anywhere;font-size:13px}.tag{font-size:12px;background:#edf4e9;padding:3px 7px;border-radius:5px}details{margin:12px 0}summary{cursor:pointer}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px}@media(max-width:720px){.flow{grid-template-columns:1fr}main{padding:20px 16px}}</style></head>
<body><main><small>SEED DESIGN · 저장소 내부 개발 지침</small><h1>결정과 교훈을 실제 검사로 연결한다</h1><p>파일에 설정된 harness의 구조다. 설정 존재와 실제 에이전트 호출·CI 실행·검사 통과는 서로 다른 증거다.</p>
<div class="flow"><div><b>사람의 판단</b>방향·허용 예외·재검토 조건<br><a href="../decisions/README.md">결정 기록</a></div><div><b>조건을 읽는다</b>AGENTS · Skills · 활성 lesson</div><div><b>변경을 검증한다</b>Biome · 테스트 · 생성 검사<br>Claude hook · 경로별 CI</div><div><b>결과를 되돌린다</b>PR 근거 · 재사용할 lesson<br>합의 후 검사·지침으로 승격</div></div>
<section><h2>현재 적용 경로</h2><div id="inventory"></div><p><b>Codex·Claude:</b> <code>skills/</code>가 원천이며 기존 symlink를 공유한다. Claude hook은 Codex 실행을 보장하지 않는다.</p><p><b>주의:</b> 생성물 guard는 실패 시 조용히 허용하는 경로가 있다. Stop reminder는 확인 권고이며 검증 게이트가 아니다. Post-edit 스크립트는 성공 피드백에도 exit 2를 사용한다.</p><p><a href="README.md">읽는 방법·갱신 명령·개선 후보</a></p></section>
<section><h2>Lesson에서 다음 강제 수단 찾기</h2><label>검색 <input id="query" placeholder="경로·증상·키워드"></label><label>상태 <select id="status"><option value="active">active</option><option value="promoted">promoted</option><option value="superseded">superseded</option><option value="retired">retired</option><option value="">전체</option></select></label><p id="count"></p><div id="learnings"></div></section>
<section><h2>설정된 Claude hook</h2><p>실행 결과를 수집하는 화면은 아니다. 호출 조건과 명령은 원본 설정에서 확인한다.</p><div id="hooks"></div></section>
<footer><p>갱신: <code>bun scripts/harness-map.ts</code> · 차이 확인: <code>bun scripts/harness-map.ts --check</code></p><p>규칙 승격은 자동 승인하지 않는다. 담당자가 정상·위반·예외 사례와 범위를 검토한 뒤 가장 좁은 검사에 연결한다.</p></footer></main>
<script type="application/json" id="data">${payload}</script>
<script>
const data=JSON.parse(document.getElementById('data').textContent);
const link=(path)=>{const a=document.createElement('a');a.href='../'+path;a.textContent=path;return a;};
const inventory=document.getElementById('inventory');
for(const [key,paths] of Object.entries(data.inventory)){const detail=document.createElement('details');const summary=document.createElement('summary');summary.textContent=key+' · '+paths.length;detail.append(summary);for(const path of paths){const row=document.createElement('div');row.append(link(path));detail.append(row);}inventory.append(detail);}
function refresh(){const query=document.getElementById('query').value.toLowerCase();const status=document.getElementById('status').value;const items=data.learnings.filter(x=>(!status||x.status===status)&&[x.id,x.description,...x.scope].join(' ').toLowerCase().includes(query));document.getElementById('count').textContent=items.length+'개 / 전체 '+data.learnings.length+'개';const list=document.getElementById('learnings');list.replaceChildren();for(const item of items){const row=document.createElement('div');row.className='row';const title=document.createElement('b');title.append(link(item.path));const tag=document.createElement('span');tag.className='tag';tag.textContent=item.status;const description=document.createElement('p');description.textContent=item.description;const scope=document.createElement('code');scope.textContent=item.scope.join(' · ');row.append(title,' ',tag,description,scope);if(item.promotedTo.length){const targets=document.createElement('p');targets.append('승격 대상: ');for(const target of item.promotedTo)targets.append(link(target),' ');row.append(targets);}list.append(row);}}
document.getElementById('query').addEventListener('input',refresh);document.getElementById('status').addEventListener('change',refresh);refresh();
for(const hook of data.hooks){const detail=document.createElement('details');const summary=document.createElement('summary');summary.textContent=hook.event+' · '+hook.matcher;const command=document.createElement('pre');command.textContent=hook.command;detail.append(summary,command);document.getElementById('hooks').append(detail);}
</script></body></html>\n`;
}

if (import.meta.main) {
  const root = resolve(import.meta.dir, "..");
  const output = resolve(root, "harness/index.html");
  const rendered = renderMap(buildMap(root));
  if (process.argv.includes("--check")) {
    if (!existsSync(output) || readFileSync(output, "utf8") !== rendered) {
      console.error("Harness map is stale. Run bun scripts/harness-map.ts");
      process.exitCode = 1;
    } else console.log("Harness map is current");
  } else {
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, rendered);
    console.log("Updated harness/index.html");
  }
}
