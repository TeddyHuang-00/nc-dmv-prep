import test from "node:test";
import assert from "node:assert/strict";
import {
  ROUND_KEYS,
  clearRound,
  loadRound,
  saveRound,
  type ExamRound,
  type PracticeRound,
  type RoundStore,
} from "./round.ts";

function fakeStore() {
  const data = new Map<string, string>();
  const store: RoundStore & { data: Map<string, string> } = {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
  return store;
}

const practice: PracticeRound = {
  ids: ["a", "b", "c"],
  i: 1,
  picked: 0,
  wrongIds: [["b", 3]],
  score: 1,
  done: false,
  updatedAt: 1_700_000_000_000,
};

const exam: ExamRound = {
  ids: ["a", "b"],
  i: 1,
  answers: { 0: 2, 1: 1 },
  submitted: false,
  updatedAt: 1_700_000_000_001,
};

test("empty storage loads null", () => {
  const s = fakeStore();
  assert.equal(loadRound("practice", s), null);
  assert.equal(loadRound("exam", s), null);
});

test("save/load round-trips both kinds under their own key", () => {
  const s = fakeStore();
  saveRound("practice", practice, s);
  saveRound("exam", exam, s);
  assert.deepEqual(loadRound("practice", s), practice);
  assert.deepEqual(loadRound("exam", s), exam);
  assert.deepEqual([...s.data.keys()].sort(), [ROUND_KEYS.exam, ROUND_KEYS.practice].sort());
});

test("corrupt or non-round JSON loads null", () => {
  const s = fakeStore();
  for (const bad of ["{not json", "5", '"str"', "null", "[]", '{"i":3}']) {
    s.setItem(ROUND_KEYS.practice, bad);
    assert.equal(loadRound("practice", s), null, `expected null for ${bad}`);
  }
});

test("corrupt practice fields degrade to safe defaults, never throw", () => {
  const s = fakeStore();
  const safe = { ids: ["a"], i: 0, picked: null, wrongIds: [], score: 0, done: false, updatedAt: 0 };
  for (const bad of [
    '{"ids":["a"],"i":0,"wrongIds":"oops"}', // blanked /practice pre-fix (flatMap TypeError)
    '{"ids":["a"],"i":"abc"}', // NaN index -> blank body pre-fix
    '{"ids":["a"],"i":"abc","picked":"2","score":"nope","done":"yes","updatedAt":"x"}',
    '{"ids":["a"],"i":1e999}', // parses to Infinity
    '{"ids":["a"],"i":-3,"picked":-1}',
    '{"ids":["a"]}', // missing everything
  ]) {
    s.setItem(ROUND_KEYS.practice, bad);
    assert.deepEqual(loadRound("practice", s), safe, `expected safe defaults for ${bad}`);
  }
});

test("ids keeps only strings; no usable ids loads null", () => {
  const s = fakeStore();
  s.setItem(ROUND_KEYS.practice, '{"ids":["a",1,null,{"x":1},"b"],"i":0}');
  assert.deepEqual(loadRound<PracticeRound>("practice", s)?.ids, ["a", "b"]);
  for (const bad of ['{"ids":[1,null]}', '{"ids":[]}', '{"ids":"a"}']) {
    s.setItem(ROUND_KEYS.practice, bad);
    assert.equal(loadRound("practice", s), null, `expected null for ${bad}`);
  }
});

test("wrongIds keeps only [string, number] pairs", () => {
  const s = fakeStore();
  s.setItem(ROUND_KEYS.practice, '{"ids":["a"],"wrongIds":["oops",["b",2],["c","x"],[3,1],[null,2],["d",1.5]]}');
  assert.deepEqual(loadRound<PracticeRound>("practice", s)?.wrongIds, [["b", 2]]);
});

test("exam answers/submitted are coerced", () => {
  const s = fakeStore();
  for (const bad of ["null", "[]", '"oops"', "5"]) {
    s.setItem(ROUND_KEYS.exam, `{"ids":["a"],"answers":${bad},"submitted":"yes"}`);
    assert.deepEqual(loadRound<ExamRound>("exam", s), {
      ids: ["a"],
      i: 0,
      answers: {},
      submitted: false,
      updatedAt: 0,
    });
  }
  s.setItem(ROUND_KEYS.exam, '{"ids":["a"],"answers":{"0":2,"1":"x","2":-1,"3":1.5,"nope":3}}');
  assert.deepEqual(loadRound<ExamRound>("exam", s)?.answers, { 0: 2 });
});

test("load -> save round-trip of a valid round is unchanged", () => {
  const s = fakeStore();
  saveRound("practice", practice, s);
  saveRound("exam", exam, s);
  saveRound("practice", loadRound<PracticeRound>("practice", s)!, s);
  saveRound("exam", loadRound<ExamRound>("exam", s)!, s);
  assert.deepEqual(loadRound("practice", s), practice);
  assert.deepEqual(loadRound("exam", s), exam);
});

test("clear removes only its own kind", () => {
  const s = fakeStore();
  saveRound("practice", practice, s);
  saveRound("exam", exam, s);
  clearRound("practice", s);
  assert.equal(loadRound("practice", s), null);
  assert.deepEqual(loadRound("exam", s), exam);
  clearRound("exam", s);
  assert.equal(s.data.size, 0);
});

test("a thrown setItem does not propagate", () => {
  const hostile: RoundStore = {
    getItem: () => {
      throw new Error("nope");
    },
    setItem: () => {
      throw new Error("quota");
    },
    removeItem: () => {
      throw new Error("nope");
    },
  };
  assert.equal(loadRound("practice", hostile), null);
  saveRound("practice", practice, hostile);
  clearRound("practice", hostile);
});
