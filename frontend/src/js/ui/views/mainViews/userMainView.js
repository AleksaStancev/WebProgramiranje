import { idCardNumberLength } from "../../../constants.js";
import { UserModel } from "../../../data/models/userModel.js";
import { DomHelper } from "../../../helpers/domHelper.js";
import { ErrorHelper } from "../../../helpers/errorHelper.js";
import { VehicleCreateView } from "../createViews/vehicleCreateView.js";
import { UserInfoView } from "../infoView/userInfoView.js";
import { VehicleNestedView } from "../nestedViews/vehicleNestedView.js";
export class UserMainView {
  #mainContainerDiv;
  #userSelect;
  #userInfoView;
  #user;
  #populateUserSelectCallback;
  #getUserCallback;
  #updateCallback;
  #deleteCallback;
  #showVehiclesCallback;
  #userDataManipulationContainerDiv;
  #userDataManipulationContainerDivWrapper;
  #vehiclesDiv;
  #updateButton;
  #showVehiclesButton;
  #vehicleViews;
  #vehiceViewsWrap;
  #vehicleCreateView;
  #createVehicleCallback;
  #deleteVehicleCallback;
  #updateVehicleCallback;
  #viewPoliciesCallback;
  #createPolicyCallback;
  #deletePolicyCallback;
  #updatePolicyCallback;
  #getPolicyCallback;
  constructor(
    populateUserSelectCallback,
    getUserCallback,
    updateCallback,
    deleteCallback,
    showVehiclesCallback,
    createVehicleCallback,
    updateVehicleCallback,
    deleteVehicleCallback,
    getPolicyCallback,
    viewPoliciesCallback,
    createPolicyCallback,
    updatePolicyCallback,
    deletePolicyCallback
  ) {
    this.#populateUserSelectCallback = populateUserSelectCallback;
    this.#getUserCallback = getUserCallback;
    this.#updateCallback = updateCallback;
    this.#deleteCallback = deleteCallback;
    this.#showVehiclesCallback = showVehiclesCallback;
    this.#vehicleViews = [];
    this.#createPolicyCallback = createPolicyCallback;
    this.#updatePolicyCallback = updatePolicyCallback;
    this.#deletePolicyCallback = deletePolicyCallback;
    this.#viewPoliciesCallback = viewPoliciesCallback;
    this.#getPolicyCallback = getPolicyCallback;

    const checkForChanges = () => {
      if (
        this.#userInfoView.idCardNumberInput.value.length !==
          idCardNumberLength ||
        (this.#userInfoView.nameInput.value === this.#user.name &&
          this.#userInfoView.surnameInput.value === this.#user.surname &&
          this.#userInfoView.cityInput.value === this.#user.city &&
          this.#userInfoView.streetInput.value === this.#user.street &&
          this.#userInfoView.streetNumberInput.value ===
            this.#user.streetNumber &&
          this.#userInfoView.idCardNumberInput.value ===
            this.#user.idCardNumber)
      ) {
        this.#updateButton.disabled = true;
        return;
      }
      this.#updateButton.disabled = false;
    };

    this.#userInfoView = new UserInfoView(checkForChanges);
    this.#createVehicleCallback = createVehicleCallback;
    this.#updateVehicleCallback = updateVehicleCallback;
    this.#deleteVehicleCallback = deleteVehicleCallback;
  }
  async getView() {
    this.#mainContainerDiv = DomHelper.createDiv("main-container");

    DomHelper.appendTitleLabel(this.#mainContainerDiv, "Select user");

    const userSelectCallback = async () => {
      const user = await this.#getUserCallback(this.#userSelect.value);

      const getUserSuccessful = () => {
        if (this.#userDataManipulationContainerDivWrapper.innerHTML === "")
          this.#showUserDataManipulationContainerDiv();
        else this.#showVehiclesButton.innerHTML = "Show vehicles";
        this.#setUser(user);
        this.#vehicleCreateView.ownerUniqueBirthNumber = this.#userSelect.value;
        this.#vehicleViews = [];
      };

      const getUserFailed = () => {
        this.#userSelect.selectedIndex = 0;
        this.#userDataManipulationContainerDivWrapper.innerHTML = "";
      };
      await ErrorHelper.fetchingErrorCheck(
        user,
        getUserSuccessful,
        getUserFailed
      );
    };

    this.#userSelect = DomHelper.appendLabelAndSelect(
      this.#mainContainerDiv,
      "Unique birth number",
      userSelectCallback
    );

    DomHelper.populateSelect(
      this.#userSelect,
      await this.#populateUserSelectCallback()
    );

    this.#userDataManipulationContainerDivWrapper =
      DomHelper.createAndAppendElement(
        this.#mainContainerDiv,
        "div",
        "nested-main-container"
      );

    this.#userDataManipulationContainerDiv = DomHelper.createDiv(
      "data-manipulation-container"
    );

    this.#userDataManipulationContainerDiv.appendChild(
      this.#userInfoView.getView()
    );

    const buttonContainerDiv = DomHelper.createAndAppendElement(
      this.#userDataManipulationContainerDiv,
      "div",
      "button-container"
    );

    const updateHandler = async () => {
      const user = new UserModel(
        this.#userInfoView.nameInput.value,
        this.#userInfoView.surnameInput.value,
        this.#userInfoView.cityInput.value,
        this.#userInfoView.streetInput.value,
        this.#userInfoView.streetNumberInput.value,
        this.#userInfoView.idCardNumberInput.value,
        this.#userSelect.value
      );
      const updateResponse = await this.#updateCallback(user);

      const updateSuccessful = async () => {
        this.#setUser(user);
      };

      await ErrorHelper.fetchingErrorCheck(updateResponse, updateSuccessful);
    };

    this.#updateButton = DomHelper.appendButton(
      buttonContainerDiv,
      "Update",
      updateHandler
    );

    this.#updateButton.disabled = true;

    const deleteVehicleCallback = async (vehicle, id, divToRemove) => {
      const deleteResponse = await this.#deleteVehicleCallback(vehicle.bodyId);
      const deleteSuccessful = async () => {
        this.#vehicleViews = this.#vehicleViews.filter((view) => {
          if (view.id > id) view.id = view.id - 1;
          return view !== this.#vehicleViews[id];
        });
        this.#vehiclesDiv.removeChild(divToRemove);
      };

      await ErrorHelper.fetchingErrorCheck(deleteResponse, deleteSuccessful);
    };

    const showVehiclesHandler = async () => {
      if (this.#showVehiclesButton.innerHTML === "Show vehicles") {
        if (this.#vehicleViews.length === 0 && this.#user.hasVehicles) {
          const vehicles = await this.#showVehiclesCallback(
            this.#user.uniqueBirthNumber
          );
          this.#vehiclesDiv.innerHTML = "";
          vehicles.forEach((vehicle) => {
            const view = new VehicleNestedView(
              vehicle,
              this.#getPolicyCallback,
              this.#updateVehicleCallback,
              deleteVehicleCallback,
              this.#vehicleViews.length,
              this.#viewPoliciesCallback,
              this.#createPolicyCallback,
              this.#updatePolicyCallback,
              this.#deletePolicyCallback
            );
            this.#vehicleViews.push(view);
            this.#vehiclesDiv.appendChild(view.getView());
          });
        }
        this.#vehiceViewsWrap.style.border = "1px solid black";
        this.#showVehicles();
        this.#showVehiclesButton.innerHTML = "Hide vehicles";
        return;
      }
      this.#vehiceViewsWrap.style.border = "none";
      this.#showVehiclesButton.innerHTML = "Show vehicles";
      this.#vehiceViewsWrap.innerHTML = "";
    };

    this.#showVehiclesButton = DomHelper.appendButton(
      buttonContainerDiv,
      "Show vehicles",
      showVehiclesHandler
    );

    const deleteHandler = async () => {
      const deleteResponse = await this.#deleteCallback(this.#userSelect.value);

      if (deleteResponse) await this.#deleteView();
    };

    DomHelper.appendButton(buttonContainerDiv, "Delete", deleteHandler);

    this.#vehiceViewsWrap = DomHelper.createAndAppendElement(
      this.#mainContainerDiv,
      "div",
      "nested-container-wrap"
    );

    this.#vehiclesDiv = DomHelper.createDiv();

    const createVehicleCallback = async (vehicle) => {
      const createResponse = await this.#createVehicleCallback(vehicle);

      if (createResponse) {
        const view = new VehicleNestedView(
          vehicle,
          this.#getPolicyCallback,
          this.#updateVehicleCallback,
          deleteVehicleCallback,
          this.#vehicleViews.length,
          this.#viewPoliciesCallback,
          this.#createPolicyCallback,
          this.#updatePolicyCallback,
          this.#deletePolicyCallback
        );
        this.#vehicleViews.push(view);
        this.#vehiclesDiv.appendChild(view.getView());
      }

      return createResponse;
    };

    this.#vehicleCreateView = new VehicleCreateView(createVehicleCallback);

    return this.#mainContainerDiv;
  }

  #setUser(user) {
    this.#user = user;
    this.#userInfoView.nameInput.value = this.#user.name;
    this.#userInfoView.surnameInput.value = this.#user.surname;
    this.#userInfoView.cityInput.value = this.#user.city;
    this.#userInfoView.streetInput.value = this.#user.street;
    this.#userInfoView.streetNumberInput.value = this.#user.streetNumber;
    this.#userInfoView.idCardNumberInput.value = this.#user.idCardNumber;
    this.#updateButton.disabled = true;
    this.#vehiceViewsWrap.innerHTML = "";
  }

  async #deleteView() {
    await this.populateUserSelect();
    this.#userSelect.selectedIndex = 0;
    this.#userDataManipulationContainerDivWrapper.innerHTML = "";
  }

  async populateUserSelect(keepSelection) {
    const selectedValue = this.#userSelect.value;
    DomHelper.clearSelectAndSetPlaceholder(
      this.#userSelect,
      "Unique birth number"
    );
    DomHelper.populateSelect(
      this.#userSelect,
      await this.#populateUserSelectCallback()
    );

    if (keepSelection === true) this.#userSelect.value = selectedValue;
  }

  #showUserDataManipulationContainerDiv() {
    this.#userDataManipulationContainerDivWrapper.appendChild(
      this.#userDataManipulationContainerDiv
    );
    this.#userDataManipulationContainerDivWrapper.appendChild(
      this.#vehiceViewsWrap
    );
  }
  #showVehicles() {
    this.#vehiceViewsWrap.appendChild(this.#vehicleCreateView.getView());
    this.#vehiceViewsWrap.appendChild(this.#vehiclesDiv);
  }
}
