import { DomHelper } from "../../../helpers/domHelper.js";

export class VehicleInfoView {
  brandInput;
  modelInput;
  colorInput;
  yearOfManufactureInput;
  licencePlateInput;
  engineVolumeInput;
  bodyIdInput;
  #onInputHandler;
  #includeBodyID;
  constructor(onInputHandler, includeBodyID) {
    this.#onInputHandler = onInputHandler;
    this.#includeBodyID = includeBodyID;
  }

  getView() {
    const inputAndLabelContainerDiv = DomHelper.createDiv("info-container");

    if (this.#includeBodyID === true) {
      this.bodyIdInput = DomHelper.appendLabelAndInputInDiv(
        inputAndLabelContainerDiv,
        "Body ID",
        this.#onInputHandler
      );
    } else this.bodyIdInput = null;

    this.brandInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Brand",
      this.#onInputHandler
    );

    this.modelInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Model",
      this.#onInputHandler
    );

    this.colorInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Color",
      this.#onInputHandler
    );

    this.colorInput.type = "color";

    this.yearOfManufactureInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Year of manufacture",
      this.#onInputHandler
    );

    this.yearOfManufactureInput.type = "number";
    this.yearOfManufactureInput.min = 1500;
    this.yearOfManufactureInput.step = 1;
    this.yearOfManufactureInput.max = new Date().getFullYear();
    
    this.licencePlateInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Licence plate",
      this.#onInputHandler
    );

    this.engineVolumeInput = DomHelper.appendLabelAndInputInDiv(
      inputAndLabelContainerDiv,
      "Engine volume",
      this.#onInputHandler
    );

    return inputAndLabelContainerDiv;
  }
}
