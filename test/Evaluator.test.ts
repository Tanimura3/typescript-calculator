import { describe, it, expect } from "vitest";
import { Evaluator, DivisionByZeroError } from "../src/Evaluator";
import { Operation } from "../src/Operation";

describe("Evaluator", () => {
  const evaluator = new Evaluator();

  it("足し算", () => {
    expect(evaluator.compute(2, Operation.Add, 3)).toBe(5);
  });

  it("引き算", () => {
    expect(evaluator.compute(5, Operation.Subtract, 2)).toBe(3);
  });

  it("掛け算", () => {
    expect(evaluator.compute(3, Operation.Multiply, 4)).toBe(12);
  });

  it("割り算", () => {
    expect(evaluator.compute(8, Operation.Divide, 2)).toBe(4);
  });

  it("0除算で例外", () => {
    expect(() => {
      evaluator.compute(5, Operation.Divide, 0);
    }).toThrow(DivisionByZeroError);
  });
});
