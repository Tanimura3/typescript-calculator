import { DomDisplay } from "./DomDisplay";
import { Calculator } from "./Calculator";
import { KeyMapper } from "./KeyMapper";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const displayEl = document.getElementById("display")!;

  const display = new DomDisplay(displayEl);
  const calc = new Calculator(display);
  const mapper = new KeyMapper();

  document.querySelectorAll<HTMLButtonElement>(".btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const token = mapper.resolve(btn);
      if (token) {
        calc.handle(token);
      }
    });
  });
});
