import { Card } from "./Card";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/Events";

interface IBasketItem {
  id: string;
  title: string;
  price: number | null;
  index: number;
}

export class BasketItem extends Card<IBasketItem> {
  protected _index: HTMLElement;
  protected _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super("card", container);

    this._index = ensureElement<HTMLElement>(".basket__item-index", container);
    this._deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container
    );

    this._deleteButton.addEventListener("click", () => {
      events.emit("basket:remove", { id: this._id });
    });
  }

  set index(value: number) {
    this.setText(this._index, String(value));