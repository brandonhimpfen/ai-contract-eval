const VALID_CASE_VERSION = "1.0";
const VALID_RESULT_VERSION = "1.0";
const VALID_STATUSES = new Set(["pass", "fail", "error"]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateEvaluationCase(value) {
  assert(value && typeof value === "object", "Evaluation case must be an object.");
  assert(value.version === VALID_CASE_VERSION, "Evaluation case version must be '1.0'.");
  assert(typeof value.name === "string" && value.name.length > 0, "Evaluation case name is required.");
  assert(typeof value.task === "string" && value.task.length > 0, "Evaluation case task is required.");
  assert(value.actual && typeof value.actual === "object", "Evaluation case actual payload is required.");
  assert(value.expected && typeof value.expected === "object", "Evaluation case expected payload is required.");
  assert(Array.isArray(value.expected.contains), "Evaluation case expected.contains must be an array.");
  assert(Array.isArray(value.expected.notContains), "Evaluation case expected.notContains must be an array.");
  assert(Array.isArray(value.expected.structuredKeys), "Evaluation case expected.structuredKeys must be an array.");
  return true;
}

export function validateEvaluationResult(value) {
  assert(value && typeof value === "object", "Evaluation result must be an object.");
  assert(value.version === VALID_RESULT_VERSION, "Evaluation result version must be '1.0'.");
  assert(typeof value.name === "string" && value.name.length > 0, "Evaluation result name is required.");
  assert(typeof value.task === "string" && value.task.length > 0, "Evaluation result task is required.");
  assert(VALID_STATUSES.has(value.status), "Evaluation result status must be 'pass', 'fail', or 'error'.");
  assert(typeof value.score === "number" && value.score >= 0 && value.score <= 1, "Evaluation result score must be a number between 0 and 1.");
  assert(Array.isArray(value.checks), "Evaluation result checks must be an array.");
  assert(Array.isArray(value.issues), "Evaluation result issues must be an array.");
  return true;
}
