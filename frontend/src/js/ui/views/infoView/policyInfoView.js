import { DomHelper } from "../../../helpers/domHelper.js";

export class PolicyInfoView {
  policyNumberInput;
  signingDateInput;
  validUntillInput;
  priceInput;
  #onInputHandler;
  #includePolicyNumber;
  constructor(onInputHandler, includePolicyNumber) {
    this.#onInputHandler = onInputHandler;
    this.#includePolicyNumber = includePolicyNumber;
  }

  getView() {
    const inputAndLabelContainerDiv = DomHelper.createDiv("info-container");

    if (this.#includePolicyNumber === true) {
      this.policyNumberInput = DomHelper.appendLabelAndInputInDiv(
        inputAndLabelContainerDiv,
        "Policy number",
        this.#onInputHandler
      );
    } else this.policyNumberInput = null;

    this.signingDateInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Signing date",
      this.#onInputHandler
    );
    this.signingDateInput.type = "date";

    this.validUntillInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Valid untill",
      this.#onInputHandler
    );

    this.validUntillInput.type = "date";

    this.priceInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Price",
      this.#onInputHandler
    );

    this.priceInput.type = "number";
    this.priceInput.min = 0;
    this.priceInput.step = 1;

    return inputAndLabelContainerDiv;
  }
}
