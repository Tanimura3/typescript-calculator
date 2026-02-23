export class NumberFormatter {
  private readonly maxDigits: number;

  constructor(maxDigits: number) {
    this.maxDigits = maxDigits;
  }

  public formatForDisplay(n: number): string {
    if (!isFinite(n)) return "Error";

    const str = n.toString();
    const digitCount = str.replace(/[.\-]/g, "").length;

    // 桁あふれ → 指数表記
    if (digitCount > this.maxDigits) {
      return n.toExponential(this.maxDigits - 1);
    }

    // 最後の不要な 0 を除去
    return str
      .replace(/\.0+$/, "")
      .replace(/(\.\d*?)0+$/, "$1");
  }
}
