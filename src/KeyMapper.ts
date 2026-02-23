import type { KeyToken } from "./KeyToken";
import { Operation } from "./Operation";

export class KeyMapper {

  public resolve(el: Element): KeyToken | undefined {
    const key = el.getAttribute("data-key");
    if (!key) return undefined;

    // 数字
    if (/^\d$/.test(key)) {
      return { kind: "digit", value: Number(key) };
    }

    // 小数点
    if (key === ".") {
      return { kind: "decimal" };
    }

    // イコール
    if (key === "eq") {
      return { kind: "equal" };
    }

    // クリア
    if (key === "C") {
      return { kind: "clear" };
    }

    // 演算子（enumへ変換）
    if (key.startsWith("op:")) {
      const symbol = key.slice(3);

      switch (symbol) {
        case "+":
          return { kind: "op", value: Operation.Add };
        case "-":
          return { kind: "op", value: Operation.Subtract };
        case "*":
          return { kind: "op", value: Operation.Multiply };
        case "/":
          return { kind: "op", value: Operation.Divide };
      }
    }

    return undefined;
  }
}
