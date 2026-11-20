import { expect, test } from "bun:test";
import { type CommitRecord, recordCommits, summarizeCommitLog } from "./commit-log";

test("counts explicit empty flushes and older mutation-free envelopes", () => {
  const records: CommitRecord[] = [];
  let time = 10;
  const app = recordCommits(
    {
      callLepusMethod(_name: string, _data: unknown, callback?: () => void) {
        time += 2;
        callback?.();
      },
    },
    records,
    () => time,
  );

  app.callLepusMethod("other", {});
  const payloads = [
    '{"patchList":[{"id":1}],"flushOptions":{"emptyPatch":true}}',
    '{"patchList":[{"id":2}]}',
    '{"patchList":[{"id":3,"snapshotPatch":["탭"]}]}',
    '{"patchList":[{"id":4}],"delayedRunOnMainThreadData":[1]}',
    "unexpected shape",
  ];
  for (const data of payloads) app.callLepusMethod("rLynxChange", { data });

  expect(records.map(({ empty, emptySource }) => [empty, emptySource])).toEqual([
    [true, "flag"],
    [true, "payload"],
    [false, "payload"],
    [false, "payload"],
    [null, null],
  ]);
  const summary = summarizeCommitLog(records);
  expect([summary.count, summary.empty, summary.unknown]).toEqual([5, 2, 1]);
  expect(summary.bytes).toEqual(payloads.map((payload) => Buffer.byteLength(payload)));
  expect(summary.roundTripMs).toEqual([2, 2, 2, 2, 2]);
});
