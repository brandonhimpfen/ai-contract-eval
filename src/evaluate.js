import { createEvaluationCase } from "./case.js";
import { toPassResult, toFailResult, toErrorResult } from "./result.js";
import { validateEvaluationCase, validateEvaluationResult } from "./validate.js";

function addCheck(checks, issues, name, passed, details = {}) {
  checks.push({ name, passed, ...details });
  if (!passed) {
    issues.push({ type: "check_failed", name, ...details });
  }
}

function hasStructuredKey(obj, keyPath) {
  if (!obj || typeof obj !== "object") return false;
  const segments = keyPath.split(".");
  let current = obj;
  for (const segment of segments) {
    if (current == null || typeof current !== "object" || !(segment in current)) {
      return false;
    }
    current = current[segment];
  }
  return true;
}

export function evaluateCase(input) {
  try {
    const testCase = createEvaluationCase(input);
    validateEvaluationCase(testCase);

    const checks = [];
    const issues = [];
    const actualText = testCase.actual.text ?? "";
    const expected = testCase.expected;

    for (const token of expected.contains) {
      const passed = actualText.toLowerCase().includes(String(token).toLowerCase());
      addCheck(checks, issues, `contains:${token}`, passed);
    }

    for (const token of expected.notContains) {
      const passed = !actualText.toLowerCase().includes(String(token).toLowerCase());
      addCheck(checks, issues, `notContains:${token}`, passed);
    }

    if (expected.minLength != null) {
      addCheck(checks, issues, "minLength", actualText.length >= expected.minLength, {
        actualLength: actualText.length,
        expectedMinLength: expected.minLength
      });
    }

    if (expected.maxLength != null) {
      addCheck(checks, issues, "maxLength", actualText.length <= expected.maxLength, {
        actualLength: actualText.length,
        expectedMaxLength: expected.maxLength
      });
    }

    for (const key of expected.structuredKeys) {
      const passed = hasStructuredKey(testCase.actual.structured, key);
      addCheck(checks, issues, `structuredKey:${key}`, passed);
    }

    const totalChecks = checks.length;
    const passedChecks = checks.filter((check) => check.passed).length;
    const score = totalChecks === 0 ? 1 : Number((passedChecks / totalChecks).toFixed(4));

    const result = issues.length === 0
      ? toPassResult({
          name: testCase.name,
          task: testCase.task,
          score,
          checks,
          issues,
          meta: testCase.meta
        })
      : toFailResult({
          name: testCase.name,
          task: testCase.task,
          score,
          checks,
          issues,
          meta: testCase.meta
        });

    validateEvaluationResult(result);
    return result;
  } catch (error) {
    const result = toErrorResult(error instanceof Error ? error.message : "Unknown evaluation error", {
      name: input?.name,
      task: input?.task,
      meta: input?.meta
    });
    validateEvaluationResult(result);
    return result;
  }
}

export function summarizeSuite(results = []) {
  const normalized = Array.isArray(results) ? results : [];
  const total = normalized.length;
  const passed = normalized.filter((result) => result?.status === "pass").length;
  const failed = normalized.filter((result) => result?.status === "fail").length;
  const errors = normalized.filter((result) => result?.status === "error").length;
  const averageScore = total === 0
    ? 0
    : Number((normalized.reduce((sum, result) => sum + (typeof result?.score === "number" ? result.score : 0), 0) / total).toFixed(4));

  return {
    version: "1.0",
    total,
    passed,
    failed,
    errors,
    averageScore,
    generatedAt: new Date().toISOString()
  };
}
