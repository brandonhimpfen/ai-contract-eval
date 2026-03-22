import { randomUUID } from "node:crypto";

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

export function normalizeEvaluationCase(input = {}) {
  const now = new Date().toISOString();

  return {
    version: "1.0",
    name: input.name ?? "unnamed-case",
    task: input.task ?? "general",
    input: clone(input.input ?? {}),
    actual: {
      text: input.actual?.text ?? null,
      structured: clone(input.actual?.structured ?? null)
    },
    expected: {
      contains: Array.isArray(input.expected?.contains) ? [...input.expected.contains] : [],
      notContains: Array.isArray(input.expected?.notContains) ? [...input.expected.notContains] : [],
      minLength: Number.isFinite(input.expected?.minLength) ? input.expected.minLength : null,
      maxLength: Number.isFinite(input.expected?.maxLength) ? input.expected.maxLength : null,
      structuredKeys: Array.isArray(input.expected?.structuredKeys) ? [...input.expected.structuredKeys] : []
    },
    meta: {
      traceId: input.meta?.traceId ?? randomUUID(),
      createdAt: input.meta?.createdAt ?? now,
      model: input.meta?.model ?? null
    }
  };
}

export function createEvaluationCase(input = {}) {
  return normalizeEvaluationCase(input);
}
