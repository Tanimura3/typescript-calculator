import { describe, it, expect } from "vitest";
import { InputBuffer } from "../src/InputBuffer";

describe("InputBuffer", () => {

  it("数字を追加できる", () => {
    const buffer = new InputBuffer(8);
    buffer.pushDigit(1);
    buffer.pushDigit(2);
    expect(buffer.toString()).toBe("12");
  });

  it("先頭0は置き換わる", () => {
    const buffer = new InputBuffer(8);
    buffer.pushDigit(0);
    buffer.pushDigit(5);
    expect(buffer.toString()).toBe("5");
  });

  it("小数点は1つだけ", () => {
    const buffer = new InputBuffer(8);
    buffer.pushDigit(1);
    buffer.pushDecimal();
    buffer.pushDecimal();
    expect(buffer.toString()).toBe("1.");
  });

  it("桁数制限を超えない", () => {
    const buffer = new InputBuffer(2);
    buffer.pushDigit(1);
    buffer.pushDigit(2);
    buffer.pushDigit(3);
    expect(buffer.toString()).toBe("12");
  });

});
