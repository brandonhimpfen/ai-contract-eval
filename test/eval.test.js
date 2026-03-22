import test from "node:test";
import assert from "node:assert/strict";

import {
  createEvaluationCase,
  evaluateCase,
  summarizeSuite,
  validateEvaluationCase,
  validateEvaluationResult
} from "../src/index.js";

test("createEvaluationCase normalizes defaults", () => {
  const testCase = createEvaluationCase({
    name: "basic-case",
    actual: {
      text: "Hello world"
    }
  });

  assert.equal(testCase.version, "1.0");
  assert.equal(testCase.name, "basic-case");
  assert.equal(testCase.task, "general");
  assert.deepEqual(testCase.expected.contains, []);
});

test("evaluateCase passes when all checks succeed", () => {
  const result = evaluateCase({
    name: "contains-check",
    task: "summarization",
    actual: {
      text: "Canada is investing in open data and AI governance."
    },
    expected: {
      contains: ["Canada", "AI"],
      notContains: ["banana"],
      maxLength: 100
    }
  });

  assert.equal(result.status, "pass");
  assert.equal(result.score, 1);
  assert.equal(validateEvaluationResult(result), true);
});

test("evaluateCase fails when checks do not pass", () => {
  const result = evaluateCase({
    name: "failing-check",
    task: "extraction",
    actual: {
      text: "The capital is Ottawa."
    },
    expected: {
      contains: ["Toronto"]
    }
  });

  assert.equal(result.status, "fail");
  assert.equal(result.score, 0);
  assert.equal(result.issues.length > 0, true);
});

test("evaluateCase supports structured key checks", () => {
  const result = evaluateCase({
    name: "structured-key-check",
    task: "extraction",
    actual: {
      text: "Canada",
      structured: {
        entities: ["Canada"]
      }
    },
    expected: {
      structuredKeys: ["entities"]
    }
  });

  assert.equal(result.status, "pass");
  assert.equal(result.score, 1);
});

test("validateEvaluationCase accepts normalized case", () => {
  const testCase = createEvaluationCase({
    name: "validated-case",
    task: "general",
    actual: {
      text: "ok"
    }
  });

  assert.equal(validateEvaluationCase(testCase), true);
});

test("summarizeSuite aggregates results", () => {
  const results = [
    evaluateCase({
      name: "one",
      actual: { text: "Canada is here" },
      expected: { contains: ["Canada"] }
    }),
    evaluateCase({
      name: "two",
      actual: { text: "Ottawa is here" },
      expected: { contains: ["Toronto"] }
    })
  ];

  const summary = summarizeSuite(results);

  assert.equal(summary.total, 2);
  assert.equal(summary.passed, 1);
  assert.equal(summary.failed, 1);
  assert.equal(summary.errors, 0);
  assert.equal(summary.averageScore, 0.5);
});
