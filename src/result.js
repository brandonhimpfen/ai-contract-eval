function createBaseResult({ name, task, status, score, checks = [], issues = [], meta = {} }) {
  return {
    version: "1.0",
    name: name ?? "unnamed-case",
    task: task ?? "general",
    status,
    score,
    checks,
    issues,
    meta: {
      evaluatedAt: meta.evaluatedAt ?? new Date().toISOString(),
      traceId: meta.traceId ?? null,
      model: meta.model ?? null
    }
  };
}

export function toPassResult(payload = {}) {
  return createBaseResult({
    ...payload,
    status: "pass",
    score: payload.score ?? 1
  });
}

export function toFailResult(payload = {}) {
  return createBaseResult({
    ...payload,
    status: "fail",
    score: payload.score ?? 0
  });
}

export function toErrorResult(message, payload = {}) {
  return createBaseResult({
    ...payload,
    status: "error",
    score: 0,
    issues: [...(payload.issues ?? []), { type: "error", message }]
  });
}
