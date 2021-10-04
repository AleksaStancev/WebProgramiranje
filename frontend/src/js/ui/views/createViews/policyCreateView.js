import { policyNumberLength } from "../../../constants.js";
import { DomHelper } from "../../../helpers/domHelper.js";
import { ErrorHelper } from "../../../helpers/errorHelper.js";
import { PolicyInfoView } from "../infoView/policyInfoView.js";
import { PolicyModel } from "../../../data/models/policyModel.js";

export class PolicyCreateView {
  #policyInfoView;
  #createPolicyCallback;
  #createButton;
  #carBodyId;
  constructor(createPolicyCallback) {
    const checkForChanges = () => {
      if (
        this.#policyInfoView.policyNumberInput.value === "" ||
        this.#policyInfoView.validUntillInput.value === "" ||
        this.#policyInfoView.signingDateInput.value === "" ||
        this.#policyInfoView.priceInput.value === "" ||
        this.#policyInfoView.policyNumberInput.value.length !=
          policyNumberLength
      ) {
        this.#createButton.disabled = true;
        return;
      }
      this.#createButton.disabled = false;
    };

    this.#policyInfoView = new PolicyInfoView(checkForChanges, true);
    this.#createPolicyCallback = createPolicyCallback;
  }
  getView() {
    const createDiv = DomHelper.createDiv("nested-main-container");

    DomHelper.appendTitleLabel(createDiv, "Add policy");

    const policyDataManipulationsContainerDiv =
      DomHelper.createAndAppendElement(
        createDiv,
        "div",
        "data-manipulation-container"
      );

    policyDataManipulationsContainerDiv.appendChild(
      this.#policyInfoView.getView()
    );

    const createPolicyCallback = async () => {
      const createResponse = await this.#createPolicyCallback(
        this.#createPolicyFromInputs()
      );

      const createSuccessful = async () => {
        this.#clearInputs();
        this.#createButton.disabled = true;
      };

      await ErrorHelper.fetchingErrorCheck(createResponse, createSuccessful);
    };

    const buttonContainer = DomHelper.createAndAppendElement(
      policyDataManipulationsContainerDiv,
      "div",
      "button-container"
    );

    this.#createButton = DomHelper.appendButton(
      buttonContainer,
      "Add",
      createPolicyCallback
    );

    this.#createButton.disabled = true;

    return createDiv;
  }

  #createPolicyFromInputs() {
    return new PolicyModel(
      this.#policyInfoView.policyNumberInput.value,
      this.#carBodyId,
      this.#policyInfoView.signingDateInput.value,
      this.#policyInfoView.validUntillInput.value,
      this.#policyInfoView.priceInput.value
    );
  }
  #clearInputs() {
    this.#policyInfoView.policyNumberInput.value = "";
    this.#policyInfoView.signingDateInput.value = "";
    this.#policyInfoView.validUntillInput.value = "";
    this.#policyInfoView.priceInput.value = "";
  }

  set carBodyId(bodyId) {
    this.#carBodyId = bodyId;
  }
}
