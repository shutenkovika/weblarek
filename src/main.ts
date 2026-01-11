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
import { Page } from "./components/Page";
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
const page = new Page(document.body, events);

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
  page.catalog = items.map((item) => {
    const card = new Ca