// Button.ts

import { DOMElement } from './DOMElement';

export class Button extends DOMElement<HTMLButtonElement> {
  constructor(
    instance: HTMLButtonElement | string,
    id: string,
    className?: string,
    text?: string,
    ariaLabel?: string
  ) {
    super(instance, className, id);
    if (text) {
      this.setText(text);
    }
    if (ariaLabel) {
      this.setupAccessibility(ariaLabel);
    }
  }

  private setupAccessibility(ariaLabel: string): void {
    this.element.setAttribute('aria-label', ariaLabel);
    this.element.setAttribute('role', 'button');
    this.element.setAttribute('tabindex', '0');
  }

  setText(text: string): void {
    this.element.textContent = text;
  }

  setTooltip(tooltip: string): void {
    this.element.title = tooltip;
    this.element.setAttribute('aria-description', tooltip);
  }

  disable(): void {
    this.element.disabled = true;
    this.element.setAttribute('aria-disabled', 'true');
  }

  enable(): void {
    this.element.disabled = false;
    this.element.removeAttribute('aria-disabled');
  }
}
