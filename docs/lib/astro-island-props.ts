/**
 * Astro가 `<astro-island props="…">`에 직렬화한 props를 되살린다.
 *
 * 클라이언트 이동에서 유지한 `DocsShell`에 새 페이지의 props를 동기로 넘기려면 새 문서의 island에서
 * props를 직접 읽어야 한다(`components/layout/shell-navigation.ts`). Astro는 이 reviver를 내보내지 않아
 * `astro/dist/runtime/server/astro-island.js`와 같은 규칙을 여기 둔다. 모르는 형식을 만나면 예외를 던진다 →
 * 호출하는 쪽은 셸을 유지하지 않고 body를 통째로 바꾼다. Astro를 올릴 때 형식이 바뀌었는지는 테스트가 잡는다.
 */
export function reviveIslandProps(serialized: string): Record<string, unknown> {
  const raw: unknown = JSON.parse(serialized);
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new Error("island props는 객체여야 합니다.");
  }
  return reviveObject(raw as Record<string, unknown>);
}

/** `[형식, 값]` 쌍. 형식 번호는 `astro/dist/runtime/server/serialize.js`의 `PROP_TYPE`이다. */
function revive(tuple: unknown): unknown {
  if (!Array.isArray(tuple)) {
    throw new Error(`island props 형식이 아닙니다: ${JSON.stringify(tuple)}`);
  }
  const [type, value] = tuple as [number, unknown];
  switch (type) {
    case 0:
      return typeof value === "object" && value !== null
        ? reviveObject(value as Record<string, unknown>)
        : value;
    case 1:
      return reviveArray(value);
    case 2:
      return new RegExp(value as string);
    case 3:
      return new Date(value as string);
    case 4:
      return new Map(reviveArray(value) as [unknown, unknown][]);
    case 5:
      return new Set(reviveArray(value));
    case 6:
      return BigInt(value as string);
    case 7:
      return new URL(value as string);
    case 8:
      return new Uint8Array(value as number[]);
    case 9:
      return new Uint16Array(value as number[]);
    case 10:
      return new Uint32Array(value as number[]);
    case 11:
      return Number.POSITIVE_INFINITY * (value as number);
    default:
      throw new Error(`모르는 island props 형식입니다: ${type}`);
  }
}

function reviveArray(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("island props 배열 형식이 아닙니다.");
  return value.map(revive);
}

function reviveObject(raw: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, revive(value)]));
}
