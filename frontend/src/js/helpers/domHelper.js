export class DomHelper {
  static createAndAppendElement(host, elementType, style) {
    const element = document.createElement(elementType);
    host.appendChild(element);
    if (style) element.className = style;
    return element;
  }

  static clearSelectAndSetPlaceholder(select, placeholder) {
    select.options.length = 0;
    const option = this.createAndAppendElement(select, "option");
    option.disabled = true;
    option.innerHTML = placeholder;
  }

  static populateSelect(select, options) {
    for (let i = 0; i < options.length; i++) {
      let option = this.createAndAppendElement(select, "option");
      option.innerHTML = options[i];
    }
  }

  static appendLabelAndInputInDiv(div, inputPlacceholder, inputOnChange) {
    const containerDiv = this.createAndAppendElement(div, "div");
    containerDiv.className = "label-input-container";
    const label = this.createAndAppendElement(containerDiv, "label");
    const input = this.createAndAppendElement(containerDiv, "input");
    input.placeholder = inputPlacceholder;
    label.innerHTML = inputPlacceholder + ":";
    label.className = "label-input";
    if (inputOnChange != null)
      input.oninput = () => {
        inputOnChange();
      };
    return input;
  }

  static appendLabelAndSelect(div, selectPlaceholder, onSelectedCallback) {
    const label = this.createAndAppendElement(div, "label");
    const select = this.createAndAppendElement(div, "select");
    const placeholder = this.createAndAppendElement(select, "option");
    placeholder.innerHTML = selectPlaceholder;
    placeholder.disabled = true;

    if (onSelectedCallback != null)
      select.onchange = async () => {
        await onSelectedCallback();
      };

    label.className = "label-input";
    label.innerHTML = selectPlaceholder + ":";
    return select;
  }

  static appendTitleLabel(div, title) {
    const titleLabel = this.createAndAppendElement(div, "label");
    titleLabel.innerHTML = title;
    titleLabel.className = "label-title";
    return titleLabel;
  }

  static createDiv(style) {
    const cudDiv = document.createElement("div");
    if (style != null) cudDiv.className = style;
    return cudDiv;
  }

  static appendButton(div, buttonText, onClickCallback) {
    const button = this.createAndAppendElement(div, "button");
    button.innerHTML = buttonText;

    button.onclick = async () => {
      await onClickCallback();
    };
    return button;
  }
}
