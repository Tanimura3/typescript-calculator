export class InputBuffer {
  private buffer: string = "";
  private readonly maxDigits: number;

  constructor(maxDigits: number) {
    this.maxDigits = maxDigits;
  }

  clear(): void {
    this.buffer = "";
  }

  // 現在の入力文字列を取得
  getValue(): string {
    return this.buffer || "0";
  }

  toNumber(): number {
    if (this.buffer === "" || this.buffer === "-") return 0;
    return Number(this.buffer);
  }

  digitCount(): number {
    return this.buffer.replace(".", "").replace("-", "").length;
  }

  isEmpty(): boolean {
    return this.buffer === "" || this.buffer === "-";
  }

  pushDigit(digit: number): void {
    if (this.digitCount() >= this.maxDigits) return;

    if (this.buffer === "0") {
      if (digit === 0) return;
      this.buffer = digit.toString();
      return;
    }

    if (this.buffer === "-") {
      this.buffer += digit.toString(); // - の後に数字追加
      return;
    }

    this.buffer += digit.toString();
  }

  pushDecimal(): void {
    if (this.buffer.includes(".")) return;

    if (this.buffer === "" || this.buffer === "-") {
      this.buffer += "0."; // 空またはマイナスの後に 0. を追加
    } else {
      this.buffer += ".";
    }
  }

  pushMinus(): void {
    if (this.buffer === "") {
      this.buffer = "-";
    }
  }
}