import type { Operation } from "./Operation";

export type CalcState =
  | { kind: "input"; buffer: string }
  | { kind: "operator"; left: number; operator: Operation }
  | { kind: "result"; value: number }
  | { kind: "error" };

