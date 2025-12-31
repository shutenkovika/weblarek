import { IProduct } from "../../types";
import { IEvents } from "../base/Events"; // Интерфейс событий

export class BasketModel {
  protected _items: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Получение списка товаров в корзине
  getBasketItems(): IProduct[] {
    return this._items;
  }

  // Добавление товара
  add(item: IProduct): void {
    this._items.push(item);
  }

  // Удаление товара по ID
  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
  }

  // Очистка
  clear(): void {
    this._items = [];
  }

  // Сумма всех товаров
  getTotalPrice(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  // Количество товаров
  getCount(): number {
    return this._items.length;
  }

  // Проверка наличия в корзине
  isInBasket(id: string): boolean {
    return this._items.some((item) => item.id === id);
  }
}
