<p align="center">
  <img src="assets/banner.svg" alt="Attention Span — pay attention, not tokens" width="820">
</p>

<p align="center">
  <a href="https://github.com/alexgreensh/attention-span/releases"><img src="https://img.shields.io/github/v/release/alexgreensh/attention-span?label=version&color=6f42c1" alt="Latest version"></a>
  <img src="https://img.shields.io/github/directory-file-count/alexgreensh/attention-span/output-styles?type=file&extension=md&label=styles&color=blue" alt="styles">
  <img src="https://img.shields.io/badge/work-unchanged-2ea44f" alt="work unchanged (hidden-test benchmark)">
  <a href="LICENSE"><img src="https://img.shields.io/github/license/alexgreensh/attention-span?color=orange" alt="AGPL-3.0"></a>
  <img src="https://img.shields.io/badge/for-Claude%20Code-d97757" alt="For Claude Code">
  <a href="https://github.com/alexgreensh/attention-span/stargazers"><img src="https://img.shields.io/github/stars/alexgreensh/attention-span?style=social" alt="Stars"></a>
</p>

<p align="center"><img src="assets/hero.png" alt="Attention Span mascot" width="900"></p>

<p align="center"><b>English</b> · <a href="README.es-ES.md">Español</a> · <a href="README.zh-CN.md">中文</a></p>

A small collection of [output styles](https://code.claude.com/docs/en/output-styles) for Claude Code that change how it *talks to you*, not how it codes. Answer-first, plain English, easy to skim. Each one is a single markdown file you drop in and switch on.

The concise-by-default rules are kind to your attention first. Trimming Claude's output is a welcome side effect, not the point.

Three so far: **Attention-kind** (the flagship), **Spartan** (terse, zero warmth), and **Rundown** (TL;DR briefings). Each has its own section below.

## Attention-kind

An ADHD-friendly style. Claude answers first, keeps it short, drops the jargon, and expands only on what's actually worth your attention. Every point is spaced out and marked with a `→`, and the important words are **bold**, so you can skim just the bold and still get the whole answer.

Same engineering ability underneath. Only the delivery changes.

**Who it's for:** anyone whose attention is a limited resource. ADHD, tired, deep in flow, or just done with walls of text.

### Before / after

The question: **"Which database should I use for a new social app, PostgreSQL or MongoDB?"** Same answer, before and after the style.

<table>
<tr>
<th align="left" width="50%">Default &nbsp;·&nbsp; 430 words</th>
<th align="left" width="50%">Attention-kind &nbsp;·&nbsp; 94 words</th>
</tr>
<tr valign="top">
<td>

For a new social app, start with PostgreSQL, and the bar for choosing MongoDB instead is high. Social apps are relationship-heavy by nature: users follow users, posts belong to users, comments belong to posts, likes connect users to posts. That's a web of connections, exactly what a relational database is built for. In MongoDB you either cram related data into one record and fight size limits, or split it out and end up stitching it back together in your app code anyway. The feed problem makes this worse: timelines, "posts from people you follow," and mutual-friend lookups all lean on the kind of cross-referencing Postgres does in a single query. You also get consistency for free, since follow counts and "did I already like this" checks want real transactions… *[and it keeps going like this]*

</td>
<td>

**→ Use PostgreSQL.** A social app is all relationships (friends, follows, likes), and Postgres handles those natively. Right for ~90% of new social apps.

**→ You keep flexibility.** Its JSONB column stores schema-less data inside the same database, so you get MongoDB's looseness without leaving Postgres.

**→ Pick MongoDB only if** your data is self-contained documents with no links, and you need massive write volume on day one.

**→ The early trap with MongoDB:** six months in, five different shapes of "user" and no clean fix. Postgres forces the structure.

**→ Next:** start on managed Postgres (Supabase, Neon, RDS).

</td>
</tr>
</table>

Same information. One of them you can read at a glance.

### Does it actually help? (measured, and reproducible)

The benchmark measures the work and the output separately, and the headline numbers use **no LLM judge**. Every figure is reproducible from this repo. [Full writeup and runnable harness.](benchmarks/results/2026-08-11-benchmark.md)

- **The work is untouched.** 12 coding tasks with hidden test suites, style off vs on: pass rates are equal (**both 97%**, within noise). No judge, just tests passing.
- **~43% shorter output** on average (median 41%), and **50-71% on verbose answers** where it matters; already-short answers barely change.
- **You reach the point in ~6 words instead of ~40.** The answer is in the first line **75%** of the time vs **3%**. (Reading-grade scores don't apply, they only measure word length and can't see a wall of text.)
- **Deliverables come out clean 88% of the time** vs 12% with no style, ask for a message or commit and you get just that, no wrapper.

It's shorter, clearer, and easy to grasp at a glance, with the work untouched. We don't claim it produces better answers, that isn't what it's for.

### What changes

- **Answer first.** Conclusion in line one. No wind-up.
- **Short by default.** Says the least that fully answers, then stops.
- **Expands only on what's vital**, so length itself signals importance.
- **Plain English.** Rare technical terms get a five-word definition, once.
- **Built to scan.** `→` markers, heavy bold, real spacing between points.
- **No repetition.** Each point makes one distinct argument, never restated or re-argued.
- **Re-anchors long tasks** and asks one question at a time, so you never lose the thread.
- **Comments too.** Code comments inherit the plain-English "explain the why" rule, but never the chat formatting.

## Spartan

<p align="center"><img src="assets/cat-spartan.png" alt="A cat in a Spartan helmet aims its laser at one lit line" width="860"></p>

Terse mode with the warmth stripped out. Same arrows and bold as Attention-kind, but blunt and imperative, no cushioning, no transitions, maximum compression. For heads-down work when you want signal, not conversation.

The question: **"Three priorities this week, room for two, how do I decide what to cut?"** Both real Opus 5 eval outputs.

<table>
<tr>
<th align="left" width="50%">Default &nbsp;·&nbsp; 310 words</th>
<th align="left" width="50%">Spartan &nbsp;·&nbsp; 168 words</th>
</tr>
<tr valign="top">
<td>

Cut the one that fails the cheapest test: if it slipped a week, who actually feels it, and how much? Run all three through four quick filters and the loser usually falls out on its own. Consequence of delay: two of your three probably have soft deadlines you invented and one has a real one, a person waiting, a dependency downstream, a window that closes. Cut from the self-imposed pile, never the someone-is-blocked-on-me pile. Reversibility: some things get harder the longer they wait, others are exactly as easy next week, so cut the one whose cost curve is flat. Who owns it besides you: if a priority can be delegated or done at 80% by someone else, it is a better cut than one only you can do… *[and it keeps going like this]*

</td>
<td>

**→ Rank by cost of NOT doing it, not by effort or interest.** Ask each: what breaks if this slips a week? The one with the softest consequence gets cut.

**→ Kill the reversible one.** If a task can wait, be delegated, or restarted later with no penalty, cut it. Protect anything with a **hard deadline** or a **dependency** where others are blocked on you.

**→ Run the regret test.** Friday night, which un-done task stings most? Keep that one. The one you'd shrug at is your cut.

**→ Separate loud from important.** The priority screaming at you is often just the most **anxious**, not the most valuable. Cut by impact, not by volume.

**→ Do not half-do all three.** Two finished beats three at 66%. Partial work on the third is the trap, it feels productive and ships nothing.

**→ Cut it out loud.** Tell whoever's affected now, not Friday. A cut you flag is a decision, a cut you hide is a **failure with a delay**.

</td>
</tr>
</table>

Same style-only guarantee as Attention-kind: shorter, more scannable, the work untouched. See the [benchmark](benchmarks/results/2026-08-11-benchmark.md).

## Rundown

<p align="center"><img src="assets/cat-rundown.png" alt="The Rundown cat aims its laser at a checklist, one line lit" width="860"></p>

Briefing style. Opens with a **TL;DR**, shows state as a ✅ / 🟡 / ⬜ / ❔ checklist, tags the next choices with emoji and numbers them so you can pick by number. Built for status updates and standups. **It optimizes for readability and scannability, not brevity**, so reach for it when clarity matters more than length. Includes a guard against inventing status it wasn't given.

The question: **"Summarize where hiring stands: 20 applicants, 5 screened, 2 interviews, no offer, one strong candidate slipping."** Both real Opus 5 eval outputs.

<table>
<tr>
<th align="left" width="50%">Default &nbsp;·&nbsp; a paragraph you read</th>
<th align="left" width="50%">Rundown &nbsp;·&nbsp; a board you scan</th>
</tr>
<tr valign="top">
<td>

Hiring stands at the top of the funnel and thin at the bottom. Twenty applicants in, five screened, two interviews booked. No offer has gone out yet, and that gap is the problem: one of the strongest candidates is cooling off while the process idles. The numbers: applicants 20, screened 5, interviews booked 2, offers out 0, at risk 1 strong candidate slipping away. The read: this is a speed problem, not a supply problem. The pipeline is healthy up top, but nothing has converted to an offer, and the best prospect is drifting. The highest-value move is to fast-track the slipping candidate before the delay decides for us. Bottleneck: the offer stage… *[and it keeps going like this]*

</td>
<td>

TL;DR: Pipeline is healthy up top but the finish line is stalling, and your best candidate is about to walk.

**Hiring funnel**
- ☑️ **Applicants in:** 20 sourced
- ☑️ **Screened:** 5 of 20 done
- 🟡 **Interviews:** 2 booked, not yet run
- ⬜ **Offer:** not drafted, not out

🔴 **Blocker:** One strong candidate is slipping. No offer motion means you lose them by default.

**Your move:**
1. 🚀 Fast-track the strong candidate, skip ahead to offer talk today
2. 📞 Run the 2 booked interviews before deciding
3. 📋 Screen more of the 15 untouched applicants for backup
4. ✍️ Draft the offer now so it is ready to fire

Pick a number: save the candidate now (1), or run the full process and risk losing them?

</td>
</tr>
</table>

## Actually want to cut your token bill?

Attention Span is here to make your agents' answers readable and easy to grasp at a glance. The lighter token bill on those answers is a welcome side effect. If cutting token spend is your actual goal, the bigger cost is the *work* your agent does, not how it talks, and two sister tools go right at it, pairing naturally with these styles:

<p align="center"><img src="assets/save-tokens.png" alt="The Outsourcerer wizard and the Attention Span cat vacuuming up ghost tokens with Token Optimizer" width="900"></p>

**[Token Optimizer](https://github.com/alexgreensh/token-optimizer)** tackles the three layers of token waste most tools never touch:

- **Structural**, e.g. bloated configs, unused skills, stale memory
- **Runtime**, e.g. verbose output, re-reads
- **Behavioral**, e.g. model misrouting, cache expiry, retry loops

...and more in each. On top of that it compresses your output stack, checkpoints and restores your work so your sessions stay continuous across compaction, and puts every token and dollar saved on a live dashboard. It's also the only tool that measures your context quality and adjusts to it, because a cheaper session that does worse work is no saving at all.

*Runs on Claude Code, Codex, OpenCode, OpenClaw, Hermes and Copilot.*

**[Outsourcerer](https://github.com/alexgreensh/outsourcerer)** — stay in one session of whatever agent you like best. In the background it:

- runs a squad across the models and harnesses you already pay for
- picks the best one per task **by benchmark, not just price**
- checks their work and minds your limits in every engine

You keep the cockpit; the grunt work happens elsewhere.

*Works across Claude Code, Codex, Antigravity, Devin, Droid, Cursor, Warp and Hermes.*

Attention Span trims how much Claude says. These two govern what your whole stack spends.

## Install

**Easiest: install the plugin.** One step gets all three styles, the `/style` switcher, and the
user-invoked skills (`/attention-kind`, `/spartan`, `/rundown`, `/tldr`). In Claude Code:

```
/plugin marketplace add alexgreensh/attention-span
/plugin install attention-span
```

Then activate a style under `/config` → *Output style*, or just type a skill like `/attention-kind`
for one conversation. Prefer wiring it up by hand? The manual steps below still work and are unchanged.

**1.** Drop the style into your output-styles folder. Global (every project):

```bash
mkdir -p ~/.claude/output-styles
curl -o ~/.claude/output-styles/attention-kind.md \
  https://raw.githubusercontent.com/alexgreensh/attention-span/main/output-styles/attention-kind.md
```

Or put it in `.claude/output-styles/` inside a single project.

**2.** Set it as your default in `~/.claude/settings.json`. Do this once and it's on every session, forever:

```json
{ "outputStyle": "Attention-kind" }
```

**3.** Restart or `/clear`. That's it.

**Rather not edit JSON?** Install the `/style` command and it does step 2 for you:

```bash
mkdir -p ~/.claude/commands
curl -o ~/.claude/commands/style.md \
  https://raw.githubusercontent.com/alexgreensh/attention-span/main/commands/style.md
```

Then `/style` shows a popup of the styles you have installed. `/style spartan` sets one straight away. `/style default` puts the built-in style back.

It looks in `~/.claude/output-styles/` and in a project's `.claude/output-styles/`. A global style is written to `~/.claude/settings.json`. A project style is written to `.claude/settings.local.json`, so it stays out of your teammates' checkouts.

**Already have it installed?** The styles get updated. Check which version you're on and compare it to the [version badge](https://github.com/alexgreensh/attention-span/releases) above:

```bash
grep attention-span ~/.claude/output-styles/*.md
```

Behind? Re-run the install command in step 1 to overwrite with the latest.

Want to try it for one session first? Run `/config` and pick it under *Output style* instead, then set the default above once you're sold.

**Cost:** ~650 tokens, added once per session and cached after the first request. The benchmark measured ~43% shorter output, so the input cost is negligible after the first reply.

## Use in Claude chats (skills)

The styles also ship as **skills**, so they work in the Claude apps (claude.ai, desktop, mobile), not
just Claude Code. Install the plugin above, or add the skill files directly, then just type the command:

- `/attention-kind`, `/spartan`, or `/rundown` — talk in that style for the rest of the conversation.
- `/tldr` — compress a document, thread, transcript, or pasted text into a scannable briefing. (The
  styles shape how Claude reports its *own* work; `/tldr` compresses something *someone else* wrote.)

The skills are **user-invoked only** (`disable-model-invocation`), so they cost zero passive context
until you call one, and they're generated from the same style sources (`scripts/gen-skills.py`), so they
never drift from the flagship wording.

## Use with other agents

The style body is plain markdown with no Claude-specific behavior. The only Claude-Code part is the YAML frontmatter at the top of each file (the `name`/`description` block the `/config` picker reads). Other agents ignore or choke on frontmatter, so the install strips it.

Each style file has a `<!-- body-start -->` marker after the frontmatter. The strip command is one `sed`:

```bash
curl -sfL <raw-url> | sed '1,/<!-- body-start -->/d'
```

That gives you clean body markdown, ready to drop into any agent's rules or instructions file.

### Install per agent

**Devin** (global, via Windsurf compatibility):

```bash
mkdir -p ~/.codeium/windsurf/memories
curl -sfL https://raw.githubusercontent.com/alexgreensh/attention-span/main/output-styles/attention-kind.md -o /tmp/attention-span.md \
  && sed '1,/<!-- body-start -->/d' /tmp/attention-span.md > ~/.codeium/windsurf/memories/attention-kind.md
```

Or project-level: `.windsurf/rules/attention-kind.md` in your repo root.

**Codex** (append to global `AGENTS.md`, idempotent via fenced markers):

```bash
mkdir -p ~/.codex
curl -sfL https://raw.githubusercontent.com/alexgreensh/attention-span/main/output-styles/attention-kind.md -o /tmp/attention-span.md \
  && { printf '\n<!-- attention-span:start -->\n'; sed '1,/<!-- body-start -->/d' /tmp/attention-span.md; printf '<!-- attention-span:end -->\n'; } >> ~/.codex/AGENTS.md
```

To update later, remove the old block first (in place), then re-run the install: `sed -i.bak '/<!-- attention-span:start -->/,/<!-- attention-span:end -->/d' ~/.codex/AGENTS.md`.

**Antigravity CLI (agy)** (project-level `GEMINI.md`, idempotent via fenced markers):

```bash
curl -sfL https://raw.githubusercontent.com/alexgreensh/attention-span/main/output-styles/attention-kind.md -o /tmp/attention-span.md \
  && { printf '\n<!-- attention-span:start -->\n'; sed '1,/<!-- body-start -->/d' /tmp/attention-span.md; printf '<!-- attention-span:end -->\n'; } >> GEMINI.md
```

Run this in your repo root. agy discovers `GEMINI.md` (or `AGENTS.md`) by walking up from the current directory to the repo root, so the style applies to that project and all subdirectories.

To update later, remove the old block first (in place), then re-run the install: `sed -i.bak '/<!-- attention-span:start -->/,/<!-- attention-span:end -->/d' GEMINI.md`.

For a global install (all projects under your home directory), append to `~/GEMINI.md` instead, agy will find it on the walk-up from any project.

Swap `attention-kind.md` for `spartan.md` or `rundown.md` to install a different style. Same commands, different filename.

**Notes:**

- Devin loads rules via its Windsurf/Cursor compatibility layer, not a native rules directory. The `~/.codeium/windsurf/memories/` path is global; `.windsurf/rules/` is per-project.
- Codex appends to a shared `AGENTS.md`, so the fenced markers (`<!-- attention-span:start -->` / `<!-- attention-span:end -->`) let you update or remove the block without duplicates.
- Antigravity CLI (agy) discovers rules by walking up from cwd to repo root, loading any `GEMINI.md` or `AGENTS.md` it finds. No frontmatter support for standalone rules. Global install works by placing `GEMINI.md` in a parent directory (e.g. `~/`) that's always in the walk-up path.
- The body is ~650 tokens of input, loaded at the start of every session. Claude Code caches it after the first request; other agents may or may not cache (provider-dependent). The output savings (~43%) dwarf the input cost within a few replies either way.
- The `sed` strip assumes macOS/Linux. On Windows, use WSL or Git Bash.

## The styles

| Style | File | Best for |
|---|---|---|
| Attention-kind | [`output-styles/attention-kind.md`](output-styles/attention-kind.md) | ADHD, attention fatigue, anyone tired of walls of text |
| Spartan | [`output-styles/spartan.md`](output-styles/spartan.md) | Spartan mode: maximum signal, zero warmth, heads-down work |
| Rundown | [`output-styles/rundown.md`](output-styles/rundown.md) | Briefings, standups, progress updates (TL;DR + checkboxes) |

Each is one readable markdown file, easy to adapt.

## Notes

- Styles apply to the **main conversation only**. Subagents run their own prompt.
- These keep Claude's coding behavior intact (`keep-coding-instructions: true`).

## License

AGPL-3.0. See [LICENSE](LICENSE).
