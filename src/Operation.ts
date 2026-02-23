export const Operation = {
  Add: "Add",
  Subtract: "Subtract",
  Multiply: "Multiply",
  Divide: "Divide",
} as const;

export type Operation =
  typeof Operation[keyof typeof Operation];