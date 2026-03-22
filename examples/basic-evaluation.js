import {
  createEvaluationCase,
  evaluateCase,
  summarizeSuite
} from "../src/index.js";

const cases = [
  createEvaluationCase({
    name: "summary-mentions-cities",
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
  }),
  createEvaluationCase({
    name: "summary-excludes-unrelated-term",
    task: "summarization",
    input: {
      prompt: "Summarize the article in 2 sentences."
    },
    actual: {
      text: "The article explains how cities are redesigning streets to improve safety and reduce emissions."
    },
    expected: {
      notContains: ["volcano"]
    }
  })
];

const results = cases.map((testCase) => evaluateCase(testCase));
const summary = summarizeSuite(results);

console.log(JSON.stringify({ results, summary }, null, 2));
