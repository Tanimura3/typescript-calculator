export const Operation = {
  Add: "Add",
  Subtract: "Subtract",
  Multiply: "Multiply",
  Divide: "Divide",
} as const;

export type Operation = typeof Operation[keyof typeof Operation];


export const CalcState = {
  Ready: "Ready",
  InputtingFirst: "InputtingFirst",
  OperatorEntered: "OperatorEntered",
  InputtingSecond: "InputtingSecond",
  ResultShown: "ResultShown",
  Error: "Error",
} as const;

export type CalcState = typeof CalcState[keyof typeof CalcState];
