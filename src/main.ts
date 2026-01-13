import "./scss/styles.scss";
import { CatalogModel } from "./components/models/CatalogModel";
import { BasketModel } from "./components/models/BasketModel";
import { BuyerModel } from "./components/models/BuyerModel";
import { EventEmitter } from "./components/base/Events";
//import { apiProducts } from "./utils/data";
import { IBuyer } from "./types";
import { LarekApi } from "./components/LarekApi";
import { API_URL, CDN_URL } from "./utils/constants";

// Импорты компонентов View
//import { Page } from "./components/Page";
import { Header } from "./components/Header";
import { Gallery } from "./components/Gallery";
import { Modal } from "./components/Modal";
import { CatalogItem } from "./components/CatalogItem";
import { PreviewItem } from "./components/PreviewItem";
import { Basket } from "./components/Basket";
import { BasketItem } from "./components/BasketItem";
import { Order } from "./components/Order";
import { Contacts } from "./components/Contacts";
import { Success } from "./components/Success";
import { cloneTemplate, ensureElement } from "./utils/utils";

// Cобытия
const events = new EventEmitter();

// CatalogModel, BasketModel, BuyerModel, API

const catalog = new CatalogModel(events);

const basket = new BasketModel(events);

const buyer = new BuyerModel(events);

const api = new LarekApi(CDN_URL, API_URL);

// Создание компонентов View

// Главная страница

const header = new Header(ensureElement<HTMLElement>(".header"), events);
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

// Модальное окно
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

// Темплейты
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

// Переиспользуемые компоненты
const basketView = new Basket(cloneTemplate(basketTemplate), events);
const orderView = new Order(cloneTemplate(orderTemplate), events);
const contactsView = new Contacts(cloneTemplate(contactsTemplate), events);

// ПРЕЗЕНТЕР: ОБРАБОТЧИКИ СОБЫТИЙ

// Изменился каталог товаров
events.on("items:changed", () => {
  const items = catalog.getItems();
  gallery.catalog = items.map((item) => {
    const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", { id: item.id }),
    });
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});

// Изменился товар для предпросмотра
events.on("preview:changed", () => {
  const item = catalog.getPreview();

  if (item) {
    const card = new PreviewItem(cloneTemplate(cardPreviewTemplate), {
      onClick: () => events.emit("card:toggle", { id: item.id }),
    });
    const isInBasket = basket.isInBasket(item.id);

    modal.render({
      content: card.render({
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        price: item.price,
      }),
    });

    // Устанавливаем текст кнопки в зависимости от наличия в корзине
    if (item.price === null) {
      card.buttonDisabled = true;
    } else {
      card.buttonText = isInBasket ? "Удалить из корзины" : "В корзину";
    }
  }
});

// Изменилась корзина
events.on("basket:changed", () => {
  const items = basket.getBasketItems();

  // Обновляем счетчик на главной странице
  header.counter = basket.getCount();

  // Обновляем содержимое корзины
  basketView.items = items.map((item, index) => {
    const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
      onDelete: () => events.emit("card:select", { id: item.id }),
    });
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  // Обновляем общую сумму
  basketView.total = basket.getTotalPrice();
});

// Изменились ошибки валидации
events.on("formErrors:change", (errors: Record<string, string>) => {
  const { email, phone, address, payment } = errors;

  // Обновляем форму Order
  orderView.valid = !address && !payment;
  orderView.errors = Object.values({ address, payment })
    .filter((i) => !!i)
    .join("; ");

  // Обновляем форму Contacts
  contactsView.valid = !email && !phone;
  contactsView.errors = Object.values({ phone, email })
    .filter((i) => !!i)
    .join("; ");
});

// СОБЫТИЯ ОТ ПРЕДСТАВЛЕНИЙ

// Открыть карточку товара
events.on("card:select", (data: { id: string }) => {
  const item = catalog.getItem(data.id);
  if (item) {
    catalog.setPreview(item);
  }
});

// Добавить/удалить товар из корзины (через превью)
events.on("card:toggle", (data: { id: string }) => {
  const item = catalog.getItem(data.id);

  if (item) {
    if (basket.isInBasket(data.id)) {
      basket.remove(data.id);
    } else {
      basket.add(item);
    }
    modal.close();
  }
});

// Удалить товар из корзины
events.on("basket:remove", (data: { id: string }) => {
  basket.remove(data.id);
});

// Открыть корзину
events.on("basket:open", () => {
  modal.render({
    content: basketView.render(),
  });
});

// Открыть форму заказа
events.on("order:open", () => {
  modal.render({
    content: orderView.render({
      payment: "",
      address: "",
      valid: false,
      errors: [],
    }),
  });
});

// Изменение полей формы Order
events.on("order:change", (data: { field: string; value: string }) => {
  buyer.setField(data.field as keyof IBuyer, data.value);

  // Перерисовка формы после изменения payment
  if (data.field === "payment") {
    orderView.payment = data.value;
  }
});

// Отправка формы Order (переход к Contacts)
events.on("order:submit", () => {
  modal.render({
    content: contactsView.render({
      email: "",
      phone: "",
      valid: false,
      errors: [],
    }),
  });
});

// Изменение полей формы Contacts
events.on("contacts:change", (data: { field: string; value: string }) => {
  buyer.setField(data.field as keyof IBuyer, data.value);
});

// Отправка формы Contacts (финальная оплата)
events.on("contacts:submit", () => {
  const items = basket.getBasketItems();
  const total = basket.getTotalPrice();

  api
    .orderProducts({
      payment: buyer.payment,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      total: total,
      items: items.map((item) => item.id),
    })
    .then((result) => {
      const success = new Success(cloneTemplate(successTemplate), events);

      modal.render({
        content: success.render({
          total: result.total,
        }),
      });

      // Очищаем корзину и данные покупателя
      basket.clear();
      buyer.clearData();
    })
    .catch((err) => {
      console.error("Ошибка при оформлении заказа:", err);
    });
});

// Закрыть окно успешного заказа
events.on("success:close", () => {
  modal.close();
});

// Закрытие модального окна
//events.on("modal:close", () => {
//  page.locked = false;
//});

// Открытие модального окна
//events.on("modal:open", () => {
//  page.locked = true;
//});

// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ

// // Запрос к серверу
api
  .getProductList()
  .then((items) => {
    catalog.setItems(items);
    console.log("Каталог загружен с сервера:", items.length, "товаров");
  })
  .catch((err) => {
    console.error("Ошибка загрузки данных:", err);
  });
