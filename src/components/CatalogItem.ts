import { Card } from "./Card";
import { ensureElement } from "../utils/utils";
//import { IEvents } from "./base/Events";
import { categoryMap } from "../utils/constants";

interface ICatalogItem {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
}

export class CatalogItem extends Card<ICatalogItem> {
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;

  constructor(
    container: HTMLElement,
    actions?: { onClick: (event: MouseEvent) => void }
  ) {
    super("card", container, actions);

    this._image = ensureElement<HTMLImageElement>(".card__image", container);
    this._category = ensureElement<HTMLElement>(".card__category", container);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set category(value: string) {
    this.setText(this._category, value);
    const categoryClass = categoryMap[value as keyof typeof categoryMap];
    if (categoryClass) {
      this.toggleClass(this._category, categoryClass, true);
    }
  }
}
