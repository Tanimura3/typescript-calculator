import type { IDisplay } from "./IDisplay";

export class DomDisplay implements IDisplay {

  private readonly displayEl: HTMLElement;

  constructor(displayEl: HTMLElement) {
    this.displayEl = displayEl;
  }

  public render(text: string): void {
    this.displayEl.textContent = text;
  }

  public renderError(text: string): void {
    this.displayEl.textContent = text;
  }
}