import { IBuyer, TPayment, FormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerModel implements IBuyer {
  payment: TPayment | string = "";
  address: string = "";
  email: string = "";
  phone: string = "";
  formErrors: FormErrors = {};
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  // Сохранение данных
  setField(field: keyof IBuyer, value: string): void {
    this[field] = value;

    // Вызываем валидацию
    const result = this.validateBuyer();

    // Проверка валидности
    this.events.emit("formErrors:change", result.errors);
  }

  // Получение всех данных
  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  // Очистка данных
  clearData(): void {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
    this.formErrors = {};
    this.events.emit("formErrors changed", this.formErrors);
  }

  // Валидация (проверка на пустые поля)
  validateBuyer(): { errors: FormErrors; isValid: boolean } {
    const errors: FormErrors = {};

    if (!this.payment) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }

    if (!this.address) {
      errors.address = "Необходимо указать адрес";
    }

    if (!this.email) {
      errors.email = "Необходимо указать email";
    }

    if (!this.phone) {
      errors.phone = "Необходимо указать телефон";
    }

    this.formErrors = errors;

    // Сообщение o валидации
    this.events.emit("formErrors:change", this.formErrors);

    return { errors, isValid: Object.keys(errors).length === 0 };
  }
}
