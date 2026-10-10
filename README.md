# ai-contract-eval

[![Support Open Work](https://img.shields.io/badge/Support-Open%20Work-0A0A0A?style=flat&logo=github)](https://github.com/brandonhimpfen/support) 
[![DOI](https://zenodo.org/badge/1188978511.svg)](https://doi.org/10.5281/zenodo.19685015)
[![GitHub Sponsor](https://srv-cdn.himpfen.io/badges/github/github-flat.svg)](https://github.com/sponsors/brandonhimpfen) 
[![Buy Me a Coffee](https://srv-cdn.himpfen.io/badges/buymeacoffee/buymeacoffee-flat.svg)](https://buymeacoffee.com/brandonhimpfen) 
[![Ko-Fi](https://srv-cdn.himpfen.io/badges/kofi/kofi-flat.svg)](https://ko-fi.com/brandonhimpfen) 
[![PayPal](https://srv-cdn.himpfen.io/badges/paypal/paypal-flat.svg)](https://paypal.me/brandonhimpfen)

A lightweight evaluation layer for AI systems built on structured contracts.

This project solves a very common problem in AI applications: teams often judge outputs informally instead of evaluating them against explicit expectations. That makes systems harder to compare, harder to improve, and harder to trust over time.

`ai-contract-eval` provides a lightweight framework for:

- defining evaluation cases for AI tasks.
- running model outputs against explicit expectations.
- scoring structure, content, and constraints.
- generating repeatable summaries across individual cases and suites.

It is intentionally small so it can be understood quickly, adopted easily, and extended as systems grow.

It can be used as both a reference implementation and a lightweight standard for evaluating AI interactions.

## Why this project exists

Most AI evaluation is still ad hoc.

- One workflow compares outputs manually.
- Another relies on a few vague metrics.
- A third stores examples with no consistent scoring method.
- A fourth reruns prompts but cannot explain whether the system improved.

The result is weak comparability, poor traceability, and limited confidence in whether a system is getting better or worse.

This package defines a simple evaluation layer that sits on top of structured AI inputs and outputs.

## Mental model

Think of the package as a small evaluation boundary:

`AI Contract -> Evaluation Case -> Scoring -> Result -> Summary`

The evaluation layer sits after the model interaction, turning outputs into structured results that can be compared across runs, prompts, and models.

This does not replace human judgment.

It makes evaluation more explicit, repeatable, and composable.

## What is included

- Evaluation case builder.
- Rule-based scoring helpers.
- Single-case evaluation runner.
- Multi-case suite evaluation runner.
- Structured result normalization.
- Example usage demonstrating real-world integration.
- Test coverage for evaluation and summary behavior.

## Install

```bash
npm install ai-contract-eval
```

## Example

```js
import {
  createEvaluationCase,
  evaluateCase,
  summarizeSuite
} from "ai-contract-eval";

const testCase = createEvaluationCase({
  name: "summarization-basic",
  task: "summarization",
  input: {
    prompt: "Summarize the article in 2 sentences."
  },
  actual: {
    text: "The article explains how cities are redesigning streets to improve safety and reduce emissions."
  },
  expected: {
    contains: ["cities", "safety"],
    maxLength: 140
  }
});

const result = evaluateCase(testCase);

const suite = summarizeSuite([result]);
console.log(result);
console.log(suite);
```

## Evaluation case contract

An evaluation case looks like this:

```json
{
  "version": "1.0",
  "name": "summarization-basic",
  "task": "summarization",
  "input": {
    "prompt": "Summarize the article in 2 sentences."
  },
  "actual": {
    "text": "The article explains how cities are redesigning streets to improve safety and reduce emissions.",
    "structured": null
  },
  "expected": {
    "contains": ["cities", "safety"],
    "notContains": [],
    "minLength": null,
    "maxLength": 140,
    "structuredKeys": []
  },
  "meta": {
    "traceId": "...",
    "createdAt": "..."
  }
}
```

## Evaluation result contract

An evaluation result looks like this:

```json
{
  "version": "1.0",
  "name": "summarization-basic",
  "task": "summarization",
  "status": "pass",
  "score": 1,
  "checks": [
    {
      "name": "contains:cities",
      "passed": true
    },
    {
      "name": "contains:safety",
      "passed": true
    },
    {
      "name": "maxLength",
      "passed": true
    }
  ],
  "issues": [],
  "meta": {
    "evaluatedAt": "...",
    "traceId": "..."
  }
}
```

## Status model

The evaluation status is intentionally narrow:

- `pass` means the case met all required checks.
- `fail` means one or more required checks did not pass.
- `error` means the case could not be evaluated safely.

This is useful because many AI workflows treat evaluation as a vague quality signal rather than a clear decision boundary.

## Quick wrapper example

```js
import {
  createEvaluationCase,
  evaluateCase,
  summarizeSuite
} from "ai-contract-eval";

async function evaluateModelOutput(runModel, prompt) {
  const actual = await runModel(prompt);

  const testCase = createEvaluationCase({
    name: "entity-extraction-basic",
    task: "extraction",
    input: { prompt },
    actual: {
      text: actual.text,
      structured: actual.structured ?? null
    },
    expected: {
      contains: ["Canada"],
      structuredKeys: ["entities"]
    },
    meta: {
      model: actual.model ?? "unknown"
    }
  });

  const result = evaluateCase(testCase);
  return {
    result,
    summary: summarizeSuite([result])
  };
}
```

## Non-Goals

This project does not attempt to:

- Replace model SDKs or providers.
- Provide judge-model evaluation frameworks.
- Define domain-specific quality metrics for every AI task.

It focuses only on defining a consistent, lightweight contract for evaluating AI outputs.

## Design Principles

This project is intentionally minimal.

It defines a small, explicit evaluation layer rather than a full platform. The goal is to provide a stable way to measure AI outputs that is easy to understand, easy to adopt, and easy to extend.

The design emphasizes:

- Simplicity over abstraction.
- Explicit checks over vague scoring.
- Repeatability over novelty.
- Composability over completeness.

This allows the evaluator to be used across different models, prompts, and workflows without introducing unnecessary complexity.

## Roadmap

This project is designed as a foundation for more reliable AI systems. Future extensions may include:

- JSON Schema export for evaluation cases and results.
- TypeScript types for stronger developer ergonomics.
- Integration with `ai-contract-kit` envelopes.
- Integration with `ai-contract-observer` logs.
- Pluggable scoring rules.
- Golden test fixtures and replayable evaluation suites.

## License

MIT
