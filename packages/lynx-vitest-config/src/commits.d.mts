/**
 * 구간 안 `rLynxChange` commit 집계. 기기 번들에서 `rLynxChange`를 감싸 세는 계측과 정의를 맞춘다.
 * - hydration commit은 세지 않는다. 그 계측의 `count`는 `total` + 구간 안 hydration 수다.
 * - 빈 commit(`total - nonEmpty`)도 native 왕복 비용으로 본다.
 */
export interface CommitCount {
  /** hydration을 뺀 `rLynxChange` 수 */
  total: number;
  /**
   * 그중 빈 commit이 아닌 수. 어느 patch에도 `snapshotPatch`가 없고 `delayedRunOnMainThreadData`도 없으면 빈 commit이다.
   * 런타임(0.123+)이 `flushOptions.emptyPatch`를 붙이는 조건과 같고, 플래그가 없는 버전에도 같은 기준을 쓴다.
   */
  nonEmpty: number;
  /** 구간 안 commit들의 `payload.data`(JSON 문자열) 길이 합 */
  bytes: number;
}

/**
 * 설치된 `@lynx-js/react`가 0.126 미만(Preact 10)인지 나타낸다.
 * 0.126부터 Preact 11로 올라가 commit 수가 달라지므로 기댓값을 이 값으로 나눈다.
 */
export const usesPreact10: boolean;

/**
 * `action`을 실행하고 commit이 더 생기지 않을 때까지 기다리며 그 사이의 commit을 센다.
 * dual-thread render(`enableMainThread`·`enableBackgroundThread`)에서 쓴다.
 */
export function measureCommits(action: () => unknown): Promise<CommitCount>;
