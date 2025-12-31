import { Api } from "./base/Api";
import { IProduct, IOrder, IOrderResult, ApiListResponse } from "../types";

export interface ILarekApi {
  getProductList: () => Promise<IProduct[]>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  // Список товаров
  getProductList(): Promise<IProduct[]> {
    return this.get<ApiListResponse<IProduct>>("/product").then((data) =>
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image,
      }))
    );
  }

  // Отправка заказа
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post<IOrderResult>("/order", order).then((data) => data);
  }
}
