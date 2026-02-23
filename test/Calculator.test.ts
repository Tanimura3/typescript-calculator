import { describe, it, expect } from "vitest";
import { Evaluator } from "../src/Evaluator";
import { Operation } from "../src/Operation";

describe("Evaluator", () => {
  it("1 + 2 = 3", () => {
    const evaluator = new Evaluator();
    expect(evaluator.compute(1, Operation.Add, 2)).toBe(3);
  });

  it("5 - 3 = 2", () => {
    const evaluator = new Evaluator();
    expect(evaluator.compute(5, Operation.Subtract, 3)).toBe(2);
  });

  it("4 × 3 = 12", () => {
    const evaluator = new Evaluator();
    expect(evaluator.compute(4, Operation.Multiply, 3)).toBe(12);
  });

  it("8 ÷ 2 = 4", () => {
    const evaluator = new Evaluator();
    expect(evaluator.compute(8, Operation.Divide, 2)).toBe(4);
  });
});
