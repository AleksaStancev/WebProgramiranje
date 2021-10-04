import { PolicyModel } from "../../../data/models/policyModel.js";
import { DomHelper } from "../../../helpers/domHelper.js";
import { PolicyInfoView } from "../infoView/policyInfoView.js";
import { ErrorHelper } from "../../../helpers/errorHelper.js";

export class PolicyNestedView {
  #id;
  #policy;
  #policyInfoView;
  #mainContainerDiv;
  #updateCallback;
  #deleteCallback;
  #updateButton;
  constructor(policy, updateCallback, deleteCallback, id) {
    this.#id = id;
    this.#policy = policy;
    this.#updateCallback = updateCallback;
    this.#deleteCallback = deleteCallback;

    const checkForChanges = () => {
      if (
        this.#policyInfoView.validUntillInput.value === policy.validUntill &&
        this.#policyInfoView.signingDateInput.value === policy.signingDate &&
        this.#policyInfoView.priceInput.value === policy.price
      ) {
        this.#updateButton.disabled = true;
        return;
      }
      this.#updateButton.disabled = false;
    };

    this.#policyInfoView = new PolicyInfoView(checkForChanges);
  }

  getView() {
    this.#mainContainerDiv = DomHelper.createDiv("nested-container");

    DomHelper.appendTitleLabel(
      this.#mainContainerDiv,
      this.#policy.policyNumber
    );

    this.#mainContainerDiv.appendChild(this.#policyInfoView.getView());

    const buttonContainerDiv = DomHelper.createAndAppendElement(
      this.#mainContainerDiv,
      "div"
    );

    const updateHandler = async () => {
      const policy = new PolicyModel(
        this.#policy.policyNumber,
        this.#policy.vehicleBodyId,
        this.#policyInfoView.signingDateInput.value,
        this.#policyInfoView.validUntillInput.value,
        this.#policyInfoView.priceInput.value
      );

      const updateResponse = await this.#updateCallback(policy);

      const updateSuccessful = async () => {
        this.#setPolicy(policy);
        this.#updateButton.disabled = true;
      };

      await ErrorHelper.fetchingErrorCheck(updateResponse, updateSuccessful);
    };

    this.#updateButton = DomHelper.appendButton(
      buttonContainerDiv,
      "Update",
      updateHandler
    );

    this.#updateButton.disabled = true;

    const deleteHander = async () => {
      await this.#deleteCallback(
        this.#policy,
        this.#id,
        this.#mainContainerDiv
      );
    };

    DomHelper.appendButton(buttonContainerDiv, "Delete", deleteHander);

    this.#setPolicy(this.#policy);

    return this.#mainContainerDiv;
  }

  #setPolicy(policy) {
    this.#policy = policy;
    this.#policyInfoView.validUntillInput.value = new Date(policy.validUntill)
      .toISOString()
      .slice(0, 10);
    this.#policyInfoView.signingDateInput.value = new Date(policy.signingDate)
      .toISOString()
      .slice(0, 10);
    this.#policyInfoView.priceInput.value = policy.price;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    this.#id = id;
  }
}
