import { ZERO_LENGTH } from '@constants';

export type ComponentProperties<K extends keyof HTMLElementTagNameMap = 'div'> = Partial<
  HTMLElementTagNameMap[K]
> & {
  text?: string;
  elementTag: K;
  classes?: string[];
};

export default class BaseComponent<K extends keyof HTMLElementTagNameMap = 'div'> {
  public childComponents: BaseComponent<keyof HTMLElementTagNameMap>[] = [];
  protected parentComponent: BaseComponent<keyof HTMLElementTagNameMap> | undefined = undefined;
  protected element: HTMLElementTagNameMap[K];

  constructor(
    properties: ComponentProperties<K>,
    ...children: BaseComponent<keyof HTMLElementTagNameMap>[]
  ) {
    const { elementTag, text, classes, ...rest } = properties;
    this.element = document.createElement(elementTag);

    if (children.length > ZERO_LENGTH) {
      this.appendChildren(...children);
    }

    if (text) {
      this.setText(text);
    }

    if (classes && classes.length > ZERO_LENGTH) {
      this.addClasses(...classes);
    }

    Object.assign(this.element, rest);
  }

  public appendChildren(...children: BaseComponent<keyof HTMLElementTagNameMap>[]): this {
    for (const child of children) {
      child.parentComponent = this;
      this.appendSingle(child);
    }

    return this;
  }

  public appendSingle(child: BaseComponent<keyof HTMLElementTagNameMap>): this {
    this.element.append(child.getElement());
    this.childComponents.push(child);
    child.parentComponent = this;

    return this;
  }

  public prependSingle(child: BaseComponent<keyof HTMLElementTagNameMap>): this {
    this.element.prepend(child.getElement());
    this.childComponents.unshift(child);
    child.parentComponent = this;

    return this;
  }

  public appendSingleSVG(svgElement: SVGElement): this {
    this.element.append(svgElement);

    return this;
  }

  public prependSingleSVG(svgElement: SVGElement): this {
    this.element.prepend(svgElement);

    return this;
  }

  public getElement(): HTMLElementTagNameMap[K] {
    return this.element;
  }

  public removeSelf(): void {
    if (this.parentComponent) {
      this.parentComponent.childComponents = this.parentComponent?.childComponents.filter(
        (child) => child !== this
      );
    }

    this.removeChildren();
    this.element.remove();
  }

  public removeChildren(): this {
    for (const child of this.childComponents) child.removeSelf();

    return this;
  }

  public unMountSelf(): this {
    this.element.remove();

    if (this.parentComponent) {
      this.parentComponent.childComponents = this.parentComponent?.childComponents.filter(
        (child) => child !== this
      );
    }

    this.parentComponent = undefined;

    return this;
  }

  public addClasses(...classes: string[]): this {
    this.element.classList.add(...classes);

    return this;
  }

  public removeClasses(...classes: string[]): this {
    this.element.classList.remove(...classes);

    return this;
  }

  public toggleClasses(...classes: string[]): this {
    for (const className of classes) {
      this.element.classList.toggle(className);
    }

    return this;
  }

  public addAttributes(attributes: Record<string, string>): this {
    for (const [key, value] of Object.entries(attributes)) {
      this.element.setAttribute(key, value);
    }

    return this;
  }

  public removeAttributes(attributes: string[]): this {
    for (const attribute of attributes) {
      this.element.removeAttribute(attribute);
    }

    return this;
  }

  public toggleAttributes(attributes: string[], force?: boolean): this {
    for (const attribute of attributes) {
      this.element.toggleAttribute(attribute, force);
    }

    return this;
  }

  public setText(text: string): this {
    this.element.textContent = text;

    return this;
  }

  public addListener(
    eventType: keyof DocumentEventMap,
    handler: EventListenerOrEventListenerObject,
    options?: AddEventListenerOptions
  ): this {
    this.element.addEventListener(eventType, handler, options);

    return this;
  }

  public removeListener(
    eventType: keyof DocumentEventMap,
    handler: EventListenerOrEventListenerObject
  ): this {
    this.element.removeEventListener(eventType, handler);

    return this;
  }
}
