interface Edit {
  type: " " | "-" | "+";
  line: string;
}

/** Myers' O((N+M)D) diff over lines, after trimming the common prefix and suffix. */
export function diffLines(a: string[], b: string[]): Edit[] {
  let prefix = 0;
  while (prefix < a.length && prefix < b.length && a[prefix] === b[prefix]) prefix++;

  let suffix = 0;
  while (
    suffix < a.length - prefix &&
    suffix < b.length - prefix &&
    a[a.length - 1 - suffix] === b[b.length - 1 - suffix]
  )
    suffix++;

  const oldLines = a.slice(prefix, a.length - suffix);
  const newLines = b.slice(prefix, b.length - suffix);

  return [
    ...a.slice(0, prefix).map((line) => ({ type: " " as const, line })),
    ...myers(oldLines, newLines),
    ...a.slice(a.length - suffix).map((line) => ({ type: " " as const, line })),
  ];
}

function myers(a: string[], b: string[]): Edit[] {
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const offset = max + 1;
  const v = new Int32Array(2 * max + 3);
  const trace: Int32Array[] = [];

  outer: for (let d = 0; d <= max; d++) {
    // Step d only reads diagonals -d..d, so that slice is all the backtrack needs.
    trace.push(v.slice(offset - d, offset + d + 1));
    for (let k = -d; k <= d; k += 2) {
      let x =
        k === -d || (k !== d && (v[offset + k - 1] ?? 0) < (v[offset + k + 1] ?? 0))
          ? (v[offset + k + 1] ?? 0)
          : (v[offset + k - 1] ?? 0) + 1;
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) break outer;
    }
  }

  const edits: Edit[] = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const previous = trace[d];
    const at = (diagonal: number) => previous?.[diagonal + d] ?? 0;
    const k = x - y;
    const previousK = k === -d || (k !== d && at(k - 1) < at(k + 1)) ? k + 1 : k - 1;
    const previousX = at(previousK);
    const previousY = previousX - previousK;

    while (x > previousX && y > previousY) {
      x--;
      y--;
      edits.push({ type: " ", line: a[x] ?? "" });
    }
    if (d > 0) {
      if (x === previousX) edits.push({ type: "+", line: b[--y] ?? "" });
      else edits.push({ type: "-", line: a[--x] ?? "" });
    }
  }

  return edits.reverse();
}

/**
 * Unified-diff hunks without file headers. Like git, each hunk header names the nearest line
 * above it that starts at column 0, which in a rendered surface is the owning export.
 */
export function unifiedDiff(a: string[], b: string[], context = 3) {
  const edits = diffLines(a, b);
  const changes = edits.flatMap((edit, index) => (edit.type === " " ? [] : [index]));
  if (changes.length === 0) return "";

  const ranges: Array<[number, number]> = [];
  for (const index of changes) {
    const last = ranges.at(-1);
    if (last && index - last[1] <= 2 * context + 1) last[1] = index;
    else ranges.push([index, index]);
  }

  const oldLineAt: number[] = [];
  const newLineAt: number[] = [];
  let oldLine = 0;
  let newLine = 0;
  for (const edit of edits) {
    oldLineAt.push(oldLine);
    newLineAt.push(newLine);
    if (edit.type !== "+") oldLine++;
    if (edit.type !== "-") newLine++;
  }

  return ranges
    .map(([first, last]) => {
      const start = Math.max(0, first - context);
      const end = Math.min(edits.length - 1, last + context);
      const hunk = edits.slice(start, end + 1);

      const oldCount = hunk.filter((edit) => edit.type !== "+").length;
      const newCount = hunk.filter((edit) => edit.type !== "-").length;
      const oldStart = oldLineAt[start] ?? 0;
      const newStart = newLineAt[start] ?? 0;
      const owner = a.slice(0, oldStart).findLast((line) => /^[A-Za-z$_]/.test(line));

      return [
        `@@ -${range(oldStart, oldCount)} +${range(newStart, newCount)} @@${owner ? ` ${owner}` : ""}`,
        ...hunk.map((edit) => `${edit.type}${edit.line}`),
      ].join("\n");
    })
    .join("\n");
}

/** `start,count` in 1-based lines; an empty range names the line before it, a single line drops the count. */
const range = (start: number, count: number) =>
  count === 0 ? `${start},0` : count === 1 ? `${start + 1}` : `${start + 1},${count}`;
