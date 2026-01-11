import { IProduct } from "../../types";
import { IEvents } from "../base/Events"; // Интерфейс событий

export class CatalogModel {
  protected _items: IProduct[] = [];
  protected _preview: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Сохранение товаров (массив)
  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit("items:changed");
  }

  // Получение товара по id
  getItem(id: string): IProduct | undefined {
    return this._items.find((item) => item.id === id);
  }

  // Получение всех товаров
  getItems(): IProduct[] {
    return this._items;
  }

  setPreview(item: IProduct): void {
    this._preview = item;
    this.events.emit("preview:changed");
  }

  // Товары для