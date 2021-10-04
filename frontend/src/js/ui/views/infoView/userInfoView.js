import { DomHelper } from "../../../helpers/domHelper.js";
export class UserInfoView {
  nameInput;
  surnameInput;
  cityInput;
  streetInput;
  streetNumberInput;
  idCardNumberInput;
  uniqueBirthNumberInput;
  #includeUniqueBirthNumber;
  #onInputHandler;
  constructor(onInputHandler, includeUniqueBirthNumber) {
    this.#onInputHandler = onInputHandler;
    this.#includeUniqueBirthNumber = includeUniqueBirthNumber;
  }
  getView() {
    const inputAndLabelContainerDiv = DomHelper.createDiv("info-container");

    if (this.#includeUniqueBirthNumber === true) {
      this.uniqueBirthNumberInput = DomHelper.appendLabelAndInputInDiv(
        inputAndLabelContainerDiv,
        "Unique birth number",
        this.#onInputHandler
      );
    } else this.uniqueBirthNumberInput = null;

    this.nameInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Name",
      this.#onInputHandler
    );

    this.surnameInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Surname",
      this.#onInputHandler
    );

    this.cityInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "City",
      this.#onInputHandler
    );

    this.streetInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Street",
      this.#onInputHandler
    );

    this.streetNumberInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Street number",
      this.#onInputHandler
    );

    this.streetNumberInput.type = "number";
    this.streetNumberInput.min = 0;

    this.idCardNumberInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Id number",
      this.#onInputHandler
    );

    return inputAndLabelContainerDiv;
  }
}
