import "./scss/styles.scss";
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { EventEmitter } from "./components/base/Events";
import { apiProducts } from "./utils/data";
import { LarekApi } from "./components/LarekApi";
import { API_URL, CDN_URL } from "./utils/constants";

// Cобытия
const events = new EventEmitter();

// CatalogModel
console.log("--- ТЕСТ КАТАЛОГА ---");
const catalog = new CatalogModel(events);
catalog.setItems(apiProducts.items);
console.log("Список всех товаров:", catalog.getItems());
console.log("Поиск товара по ID:", catalog.getItem(apiProducts.items[0].id));

// BasketModel
console.log("--- ТЕСТ КОРЗИНЫ ---");
const basket = new BasketModel(events);
basket.add(apiProducts.items[0]);
basket.add(apiProducts.items[1]);
console.log("Товары в корзине:", basket.getBasketItems());
console.log("Общая сумма:", basket.getTotalPrice());
console.log("Количество товаров:", basket.getCount());
basket.remove(apiProducts.items[0].id);
console.log("Корзина после удаления одного товара:", basket.getBasketItems());

// BuyerModel
console.log("--- ТЕСТ ПОКУПАТЕЛЯ ---");
const buyer = new BuyerModel(events);

// Просмотр валидации в консоли
events.on("formErrors:change", (errors) => {
  console.log("Ошибки валидации:", errors);
});

buyer.setField("email", "test@test.ru");
console.log("Данные покупателя после ввода email:", buyer.getData());
console.log("Валиден ли заказ сейчас?", buyer.validateBuyer().isValid);

buyer.setField("payment", "card");
buyer.setField("address", "ул. Пушкина, дом Колотушкина");
buyer.setField("phone", "+7 999 000 00 00");

const validation = buyer.validateBuyer();
console.log(
  "Валиден ли заказ после заполнения всех полей?",
  validation.isValid
);

// Экземпляр API
const api = new LarekApi(CDN_URL, API_URL);

// Запрос к серверу
api
  .getProductList()
  .then((items) => {
    console.log("--- ТЕСТ СЕРВЕРА ---");
    catalog.setItems(items);
    console.log("Каталог после загрузки с сервера:", catalog.getItems());
  })
  .catch((err) => {
    console.log("Ошибка загрузки данных:", err);
  });
