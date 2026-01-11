import { Card } from "./Card";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/Events";
import { categoryMap } from "../utils/constants";

interface IPreviewItem {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string;
  price: number | null;
}

export class PreviewItem extends Card<IPreviewItem> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _description: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super("card", container, {
      onClick: () => events.emit("card:toggle", { id: this._id }),
    });

    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
    this._description = ensureElement<HTMLElement>(".card__text", container);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.className = `card__category`;
    const categoryClass = categoryMap[value as keyof typeof categoryMap];

    if (categoryClass) {
      this.toggleClass(this._category, categoryClass, true);
    }
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  set buttonText(value: string) {
    if (this._button) {
      this.setText(this._button, value);
    }
  }

  set buttonDisabled(value: boolean) {
    if (this._button) {
      this.set