/**
 * Базовый компонент
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
    // Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
  }

  // Инструментарий для работы с DOM в дочерних компонентах

  // Переключить класс
  protected toggleClass(
    element: HTMLElement,
    className: string,
    force?: boolean
  ) {
    element.classList.toggle(className, force);
  }

  // Установить текстовое содержимое
  protected setText(element: HTMLElement, value: unknown) {
    if (element) {
      element.textContent = String(value);
    }
  }

  // Сменить статус блокировки
  protected setDisabled(element: HTMLElement, state: boolean) {
    if (elemen