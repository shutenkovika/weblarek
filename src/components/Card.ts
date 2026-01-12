import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

interface ICard {
  id: string;
  title: string;
  price: number | null;
}

export class Card<T> extends Component<ICard> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement | null;
  protected _id!: string;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void }
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._button = container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }

  render(data?: Partial<T & ICard>): HTMLElement {
    return super.render(data);
  }

  set id(value: string) {
    this._id = value;
  }

  get id(): string {
    return this._id;
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  set price(value: number | null) {
    if (value === null) {
      this.setText(this._price, "Бесценно");
      if (this._button) {
        this.setDisabled(this._button, true);
      }
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }
}
