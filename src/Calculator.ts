import type { KeyToken } from "./KeyToken";
import type { IDisplay } from "./IDisplay";
import { Operation } from "./Operation";
import { InputBuffer } from "./InputBuffer";
import { Evaluator, DivisionByZeroError } from "./Evaluator";

export class Calculator {
  /** 最大有効桁数（. と - は除外） */
  static readonly MAX_DIGITS = 8;

  /** 表示インタフェース */
  private readonly display: IDisplay;

  /** 入力中オペランド管理 */
  private readonly buffer: InputBuffer;

  /** 計算実行クラス */
  private readonly evaluator = new Evaluator();

  private state:
    | "Ready"
    | "Inputting"
    | "OperatorEntered"
    | "Result"
    | "Error" = "Ready";

  private left?: number;

  /** 保留中の演算子 */
  private operator?: Operation;

  /** 式表示用文字列 */
  private expression: string = "";

  constructor(display: IDisplay) {
    this.display = display;
    this.buffer = new InputBuffer(Calculator.MAX_DIGITS);

    // 初期表示
    this.display.render("0");
  }

  public handle(token: KeyToken): void {
    // Error状態では clear または digit 以外を無視
    if (
      this.state === "Error" &&
      token.kind !== "clear" &&
      token.kind !== "digit"
    ) {
      return;
    }

    switch (token.kind) {
      case "digit":
        this.handleDigit(token.value);
        break;

      case "decimal":
        this.handleDecimal();
        break;

      case "op":
        this.handleOperator(token.value);
        break;

      case "equal":
        this.handleEqual();
        break;

      case "clear":
        this.reset();
        break;
    }
  }

  //数字入力処理
  private handleDigit(d: number): void {
    // 結果表示直後の数字入力は新規開始
    if (this.state === "Result" || this.state === "Error") {
      this.reset();
    }

    // 追加前の桁数チェック
    if (this.buffer.digitCount() >= Calculator.MAX_DIGITS) {
      return; // 9桁目は無視
    }

    // 先頭マイナス入力対応
    if (
      this.left === undefined &&
      this.state === "Ready" &&
      this.buffer.getValue() === "0" &&
      d !== 0
    ) {
      this.buffer.clear();
    }

    // InputBuffer に桁制御を任せる
    this.buffer.pushDigit(d);

    // expression 再構築
    if (this.left !== undefined && this.operator !== undefined) {
      const symbol = this.getOperatorSymbol(this.operator);
      this.expression =
        this.left.toString() + symbol + this.buffer.getValue();
    } else {
      this.expression = this.buffer.getValue();
    }

    this.display.render(this.expression);

    this.state = "Inputting";
  }

  // 小数点入力処理
  private handleDecimal(): void {
    this.buffer.pushDecimal();

    // expression 再構築
    if (this.left !== undefined && this.operator !== undefined) {
      const symbol = this.getOperatorSymbol(this.operator);
      this.expression =
        this.left.toString() + symbol + this.buffer.getValue();
    } else {
      this.expression = this.buffer.getValue();
    }

    this.display.render(this.expression);
    this.state = "Inputting";
  }

  //演算子入力処理
  private handleOperator(op: Operation): void {
    //  left が undefined かつ buffer が "-" の場合、負の数入力確定
    if (this.left === undefined && this.buffer.getValue() === "-" && op !== Operation.Subtract) {
      this.left = this.buffer.toNumber(); // - を数字として left に反映
      this.buffer.clear();
    }

    // left が undefined かつ buffer が空のとき、先頭マイナス入力開始
    if (this.left === undefined && this.buffer.isEmpty() && op === Operation.Subtract) {
      this.buffer.pushMinus();
      this.expression = this.buffer.getValue();
      this.display.render(this.expression);
      this.state = "Inputting";
      return;
    }

    // バッファに値がある場合のみ評価
    if (!this.buffer.isEmpty()) {
      const current = this.buffer.toNumber();

      if (this.left === undefined) {
        // 初回演算
        this.left = current;
      } else if (this.operator !== undefined) {
        // 左から順評価
        this.left = this.evaluator.compute(
          this.left,
          this.operator,
          current
        );
      }

      this.buffer.clear();
    }

    // 演算子更新（多重演算子は上書き）
    this.operator = op;

    // 式再構築
    if (!this.buffer.isEmpty()) {
      this.expression =
        this.left?.toString() + this.getOperatorSymbol(this.operator) + this.buffer.getValue();
    } else {
      this.expression = this.left?.toString() + this.getOperatorSymbol(this.operator);
    }

    this.display.render(this.expression);

    this.state = "OperatorEntered";
  }

  private handleEqual(): void {
    if (
      this.left === undefined ||
      this.operator === undefined ||
      this.buffer.isEmpty()
    ) {
      return;
    }

    try {
      const right = this.buffer.toNumber();

      const result = this.evaluator.compute(
        this.left,
        this.operator,
        right
      );

      const formatted = this.formatResult(result);
      this.display.render(formatted);

      // 結果を次の left に保持
      this.left = result;
      this.operator = undefined;
      this.buffer.clear();
      this.expression = formatted;

      this.state = "Result";
    } catch (e) {
      if (e instanceof DivisionByZeroError) {
        this.display.renderError("Error");
        this.state = "Error";
      }
    }
  }

  private reset(): void {
    this.left = undefined;
    this.operator = undefined;
    this.buffer.clear();
    this.expression = "";

    this.display.render("0");
    this.state = "Ready";
  }

  private formatResult(value: number): string {
    if (!isFinite(value)) {
      return "Error";
    }

    // 有効桁数8桁を超えた場合は指数表記
    let str = value.toString();

    // 小数点以下を含む場合の丸めは不要（そのまま指数判定）
    const digitCount = str.replace(/[.\-]/g, "").length;

    if (digitCount > Calculator.MAX_DIGITS) {
      return value.toExponential(6);
    }

    // 小数の不要な0削除
    if (str.includes(".")) {
      str = str.replace(/\.?0+$/, "");
    }

    return str;
  }

  private getOperatorSymbol(op: Operation): string {
    switch (op) {
      case Operation.Add:
        return "+";
      case Operation.Subtract:
        return "-";
      case Operation.Multiply:
        return "×";
      case Operation.Divide:
        return "÷";
    }
  }
}