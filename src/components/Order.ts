import { Form } from "./Form";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IOrderForm {
  payment: string;
  address: string;
}

export class Order extends Form<IOrderForm> {
  protected _buttons: HTMLButtonElement[];
  protected _addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttons = Array.from(
      container.querySelectorAll(".button_alt")
    ) as HTMLButtonElement[];

    this._addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this._buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.name;
        this.payment = value;
        events.emit("order:change", {
          field: "payment",
          value,
        });
      });
    });
  }

  set payment(value: string) {
    this._buttons.forEach((button) => {
      this.toggleClass(button, "button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this._addressInput.value = value;
  }
}
