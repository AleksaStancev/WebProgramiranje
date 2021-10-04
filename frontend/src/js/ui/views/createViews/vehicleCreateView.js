import { DomHelper } from "../../../helpers/domHelper.js";
import { VehicleInfoView } from "../../views/infoView/vehicleInfoView.js";
import { VehicleModel } from "../../../data/models/vehicleModel.js";
import { ErrorHelper } from "../../../helpers/errorHelper.js";
import { bodyIdLength } from "../../../constants.js";

export class VehicleCreateView {
  #vehicleInfoView;
  #createVehicleCallback;
  #ownerUniqueBirthNumber;
  #createButton;
  constructor(createVehicleCallback) {
    const checkForChanges = () => {
      if (
        this.#vehicleInfoView.brandInput.value === "" ||
        this.#vehicleInfoView.modelInput.value === "" ||
        this.#vehicleInfoView.yearOfManufactureInput.value === "" ||
        this.#vehicleInfoView.licencePlateInput.value === "" ||
        this.#vehicleInfoView.engineVolumeInput.value === "" ||
        this.#vehicleInfoView.bodyIdInput.value.length !== bodyIdLength
      ) {
        this.#createButton.disabled = true;
        return;
      }
      this.#createButton.disabled = false;
    };
    this.#createVehicleCallback = createVehicleCallback;
    this.#vehicleInfoView = new VehicleInfoView(checkForChanges, true);
  }

  getView() {
    const createDiv = DomHelper.createDiv("nested-main-container");

    DomHelper.appendTitleLabel(createDiv, "Add vehicle");

    const vehicleDataManipulationContainerDiv =
      DomHelper.createAndAppendElement(
        createDiv,
        "div",
        "data-manipulation-container"
      );

    vehicleDataManipulationContainerDiv.appendChild(
      this.#vehicleInfoView.getView()
    );

    const createVehicleCallback = async () => {
      const createResponse = await this.#createVehicleCallback(
        this.#createVehicleFromInputs()
      );

      const createSuccessful = async () => {
        this.#clearInputs();
        this.#createButton.disabled = true;
      };

      await ErrorHelper.fetchingErrorCheck(createResponse, createSuccessful);
    };

    const buttonContainer = DomHelper.createAndAppendElement(
      vehicleDataManipulationContainerDiv,
      "div",
      "button-container"
    );

    this.#createButton = DomHelper.appendButton(
      buttonContainer,
      "Add",
      createVehicleCallback
    );

    this.#createButton.disabled = true;

    return createDiv;
  }

  #createVehicleFromInputs() {
    return new VehicleModel(
      this.#vehicleInfoView.bodyIdInput.value,
      this.#vehicleInfoView.brandInput.value,
      this.#vehicleInfoView.modelInput.value,
      this.#vehicleInfoView.colorInput.value,
      this.#vehicleInfoView.yearOfManufactureInput.value,
      this.#vehicleInfoView.licencePlateInput.value,
      this.#vehicleInfoView.engineVolumeInput.value,
      this.#ownerUniqueBirthNumber
    );
  }
  #clearInputs() {
    this.#vehicleInfoView.bodyIdInput.value = "";
    this.#vehicleInfoView.brandInput.value = "";
    this.#vehicleInfoView.modelInput.value = "";
    this.#vehicleInfoView.colorInput.value = "#000000";
    this.#vehicleInfoView.yearOfManufactureInput.value = "";
    this.#vehicleInfoView.licencePlateInput.value = "";
    this.#vehicleInfoView.engineVolumeInput.value = "";
  }
  set ownerUniqueBirthNumber(uniqueBirthNumber) {
    this.#ownerUniqueBirthNumber = uniqueBirthNumber;
  }
}
