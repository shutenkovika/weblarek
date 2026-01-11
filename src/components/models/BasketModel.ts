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
    this.events.emit("basket:changed");
  }

  // Удаление товара по ID
  remove(id: string): void {
    this._items = this._items.filter((item) => item.id !== id);
    this.events.emit("basket:changed");
  }

  // Очистка
  clear(): void {
    this._items = [];
    this.events.emit("basket:changed");
  }

  // Сумма всех товаров
  getTotalPrice(): number {
    return this._items.reduce((total, item) => total + (item.price || 0), 0);
  }

  // Количество товаров
  getCount(): number {
    return this._items.length;
  }

  // Проверка налич