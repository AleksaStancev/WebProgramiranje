import { DomHelper } from "../../../helpers/domHelper.js";
import { VehicleInfoView } from "../infoView/vehicleInfoView.js";
import { ErrorHelper } from "../../../helpers/errorHelper.js";
import { PolicyNestedView } from "../nestedViews/policyNestedView.js";
import { PolicyCreateView } from "../createViews/policyCreateView.js";
import { VehicleModel } from "../../../data/models/vehicleModel.js";

export class VehicleNestedView {
  #id;
  #vehicle;
  #vehicleInfoView;
  #mainContainerDiv;
  #updateCallback;
  #deleteCallback;
  #viewPoliciesCallback;
  #updateButton;
  #policyViews;
  #policyDataManipulationContainerDiv;
  #policyDataManipulationContainerDivWrapper;
  #policiesDiv;
  #policesViewsWrap;
  #policyCreateView;
  #createPolicyCallback;
  #updatePolicyCallback;
  #deletePolicyCallback;
  #getPolicyCallback;
  #viewPoliciesButton;
  constructor(
    vehicle,
    getPolicyCallback,
    updateCallback,
    deleteCallback,
    id,
    viewPoliciesCallback,
    createPolicyCallback,
    updatePolicyCallback,
    deletePolicyCallback
  ) {
    this.#id = id;
    this.#vehicle = vehicle;
    this.#getPolicyCallback = getPolicyCallback;
    this.#updateCallback = updateCallback;
    this.#deleteCallback = deleteCallback;
    this.#viewPoliciesCallback = viewPoliciesCallback;
    this.#policyViews = [];
    this.#createPolicyCallback = createPolicyCallback;
    this.#updatePolicyCallback = updatePolicyCallback;
    this.#deletePolicyCallback = deletePolicyCallback;
    const checkForChanges = () => {
      if (
        this.#vehicle.brand === this.#vehicleInfoView.brandInput.value &&
        this.#vehicle.model === this.#vehicleInfoView.modelInput.value &&
        this.#vehicle.color === this.#vehicleInfoView.colorInput.value &&
        this.#vehicle.yearOfManufacture ===
          this.#vehicleInfoView.yearOfManufactureInput.value &&
        this.#vehicle.licencePlate ===
          this.#vehicleInfoView.licencePlateInput.value &&
        this.#vehicle.engineVolume ===
          this.#vehicleInfoView.engineVolumeInput.value
      ) {
        this.#updateButton.disabled = true;
        return;
      }
      this.#updateButton.disabled = false;
    };

    this.#vehicleInfoView = new VehicleInfoView(checkForChanges);
  }

  getView() {
    this.#mainContainerDiv = DomHelper.createDiv("nested-container");

    this.#policyDataManipulationContainerDivWrapper =
      DomHelper.createAndAppendElement(
        this.#mainContainerDiv,
        "div",
        "nested-main-container"
      );

    this.#policyDataManipulationContainerDiv = DomHelper.createDiv(
      "data-manipulation-container"
    );

    DomHelper.appendTitleLabel(
      this.#policyDataManipulationContainerDiv,
      this.#vehicle.bodyId
    );

    this.#policyDataManipulationContainerDiv.appendChild(
      this.#vehicleInfoView.getView()
    );

    const buttonContainerDiv = DomHelper.createAndAppendElement(
      this.#policyDataManipulationContainerDiv,
      "div",
      "button-container"
    );

    const updateHandler = async () => {
      const vehicle = new VehicleModel(
        this.#vehicle.bodyId,
        this.#vehicleInfoView.brandInput.value,
        this.#vehicleInfoView.modelInput.value,
        this.#vehicleInfoView.colorInput.value,
        this.#vehicleInfoView.yearOfManufactureInput.value,
        this.#vehicleInfoView.licencePlateInput.value,
        this.#vehicleInfoView.engineVolumeInput.value,
        this.#vehicle.ownerUniqueBirthNumber
      );

      const updateResponse = await this.#updateCallback(vehicle);

      const updateSuccessful = async () => {
        this.#setVehicle(vehicle);
      };

      await ErrorHelper.fetchingErrorCheck(updateResponse, updateSuccessful);
    };

    this.#updateButton = DomHelper.appendButton(
      buttonContainerDiv,
      "Update",
      updateHandler
    );

    this.#updateButton.disabled = true;

    const deletePolicyCallback = async (policy, id, divToRemove) => {
      const deleteResponse = await this.#deletePolicyCallback(policy.policyNumber);
      const deleteSuccessful = async () => {
        this.#policyViews = this.#policyViews.filter((view) => {
          if (view.id > id) view.id = view.id - 1;
          return view !== this.#policyViews[id];
        });
        this.#policiesDiv.removeChild(divToRemove);
      };

      await ErrorHelper.fetchingErrorCheck(deleteResponse, deleteSuccessful);
    };

    const viewPoliciesHandler = async () => {
      if (this.#viewPoliciesButton.innerHTML === "Show policies") {
        if (this.#policyViews.length === 0 && this.#vehicle.hasPolicies) {
          const policies = await this.#viewPoliciesCallback(
            this.#vehicle.bodyId
          );

          this.#policiesDiv.innerHTML = "";
          policies.forEach((policy) => {
            const view = new PolicyNestedView(
              policy,
              this.#updatePolicyCallback,
              deletePolicyCallback,
              this.#policyViews.length
            );
            this.#policyViews.push(view);
            this.#policiesDiv.appendChild(view.getView());
          });
        }
        this.#policesViewsWrap.style.border = "1px solid black";
        this.#showPolicies();
        this.#viewPoliciesButton.innerHTML = "Hide policies";
        return;
      }
      this.#policesViewsWrap.style.border = "none";
      this.#viewPoliciesButton.innerHTML = "Show policies";
      this.#policesViewsWrap.innerHTML = "";
    };

    this.#viewPoliciesButton = DomHelper.appendButton(
      buttonContainerDiv,
      "Show policies",
      viewPoliciesHandler
    );

    const deleteHander = async () => {
      await this.#deleteCallback(
        this.#vehicle,
        this.#id,
        this.#mainContainerDiv
      );
    };

    DomHelper.appendButton(buttonContainerDiv, "Delete", deleteHander);

    this.#policesViewsWrap = DomHelper.createAndAppendElement(
      this.#policyDataManipulationContainerDiv,
      "div",
      "nested-container-wrap"
    );

    this.#policesViewsWrap.style.background = "lightcyan";

    this.#policiesDiv = DomHelper.createDiv();

    const createPolicyCallback = async (policy) => {
      const createResponse = await this.#createPolicyCallback(policy);

      if (createResponse) {
        const view = new PolicyNestedView(
          policy,
          this.#updatePolicyCallback,
          deletePolicyCallback,
          this.#policyViews.length
        );
        this.#policyViews.push(view);
        this.#policiesDiv.appendChild(view.getView());
      }
      return createResponse;
    };

    this.#policyCreateView = new PolicyCreateView(createPolicyCallback);

    this.#policyCreateView.carBodyId = this.#vehicle.bodyId;

    this.#setVehicle(this.#vehicle);
    this.#showPolicyDataManipulationContainerDiv();

    return this.#mainContainerDiv;
  }

  #setVehicle(vehicle) {
    this.#vehicle = vehicle;
    this.#vehicleInfoView.brandInput.value = this.#vehicle.brand;
    this.#vehicleInfoView.modelInput.value = this.#vehicle.model;
    this.#vehicleInfoView.colorInput.value = this.#vehicle.color;
    this.#vehicleInfoView.yearOfManufactureInput.value =
      this.#vehicle.yearOfManufacture;
    this.#vehicleInfoView.licencePlateInput.value = this.#vehicle.licencePlate;
    this.#vehicleInfoView.engineVolumeInput.value = this.#vehicle.engineVolume;
    this.#updateButton.disabled = true;
    this.#policesViewsWrap.innerHTML = "";
  }

  #showPolicyDataManipulationContainerDiv() {
    this.#policyDataManipulationContainerDivWrapper.appendChild(
      this.#policyDataManipulationContainerDiv
    );

    this.#policyDataManipulationContainerDivWrapper.appendChild(
      this.#policesViewsWrap
    );
  }

  #showPolicies() {
    this.#policesViewsWrap.appendChild(this.#policyCreateView.getView());
    this.#policesViewsWrap.appendChild(this.#policiesDiv);
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    this.#id = id;
  }
}
