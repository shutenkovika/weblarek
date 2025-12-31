export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

// ---- НОВЫЕ ТИПЫ ----

// Способ оплаты
export type TPayment = "card" | "cash";

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс данных покупателя
export interface IBuyer {
  payment: TPayment | string;
  //payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

// Интерфейс для ошибок валидации
export type FormErrors = Partial<Record<keyof IBuyer, string>>;

// Интерфейс для заказа
export interface IOrder extends IBuyer {
  items: string[]; // Купленные товары (массив)
  total: number; // Сумма заказа
}

// Интерфейс ответа сервера при успешном заказе
export interface IOrderResult {
  id: string; // ID заказа
  total: number; // Подтвержденная сумма
}

// Тип для ответа сервера со списком товаров (обертка над массивом)
export type ApiListResponse<Type> = {
  total: number;
  items: Type[];
};
