import { Card } from "./Card";
import { ensureElement } from "../utils/utils";
//import { IEvents } from "./base/Events";

interface IBasketItem {
  id: string;
  title: string;
  price: number | null;
  index: number;
}

export class BasketItem extends Card<IBasketItem> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: { onDelete: () => void }) {
    super("card", container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    if (actions?.onDelete) {
      this._deleteButton.addEventListener("click", actions.onDelete);
    }
  }

  set index(value: number) {
    this.setText(this._index, String(value));
  }
}
