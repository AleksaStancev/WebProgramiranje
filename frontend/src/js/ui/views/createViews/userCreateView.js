import { DomHelper } from "../../../helpers/domHelper.js";
import { UserInfoView } from "../infoView/userInfoView.js";
import { UserModel } from "../../../data/models/userModel.js";
import { ErrorHelper } from "../../../helpers/errorHelper.js";
import {
  idCardNumberLength,
  uniqueBirthNumberLength,
} from "../../../constants.js";

export class UserCreateView {
  #userInfoView;
  #createUserCallback;
  #populateUserSelectCallback;
  #createButton;
  constructor(createUserCallback, populateUserSelectCallback) {
    const checkForChanges = () => {
      if (
        this.#userInfoView.idCardNumberInput.value === "" ||
        this.#userInfoView.streetInput.value === "" ||
        this.#userInfoView.cityInput.value === "" ||
        this.#userInfoView.streetNumberInput.value === "" ||
        this.#userInfoView.nameInput.value === "" ||
        this.#userInfoView.surnameInput.value === "" ||
        this.#userInfoView.uniqueBirthNumberInput.value === "" ||
        this.#userInfoView.idCardNumberInput.value.length !==
          idCardNumberLength ||
        this.#userInfoView.uniqueBirthNumberInput.value.length !==
          uniqueBirthNumberLength
      ) {
        this.#createButton.disabled = true;
        return;
      }
      this.#createButton.disabled = false;
    };

    this.#userInfoView = new UserInfoView(checkForChanges, true);
    this.#createUserCallback = createUserCallback;
    this.#populateUserSelectCallback = populateUserSelectCallback;
  }
  getView() {
    const createDiv = DomHelper.createDiv("main-container");

    DomHelper.appendTitleLabel(createDiv, "Create user");

    const userDataManipulationContainerDiv = DomHelper.createAndAppendElement(
      createDiv,
      "div",
      "data-manipulation-container"
    );

    userDataManipulationContainerDiv.appendChild(this.#userInfoView.getView());

    const createUserCallback = async () => {
      const createResponse = await this.#createUserCallback(
        this.#createUserFromInputs()
      );

      const createSuccessful = async () => {
        this.#clearInputs();
        this.#populateUserSelectCallback();
        this.#createButton.disabled = true;
      };

      await ErrorHelper.fetchingErrorCheck(createResponse, createSuccessful);
    };

    const buttonContainer = DomHelper.createAndAppendElement(
      userDataManipulationContainerDiv,
      "div",
      "button-container"
    );

    this.#createButton = DomHelper.appendButton(
      buttonContainer,
      "Create",
      createUserCallback
    );

    this.#createButton.disabled = true;

    return createDiv;
  }

  #createUserFromInputs() {
    return new UserModel(
      this.#userInfoView.nameInput.value,
      this.#userInfoView.surnameInput.value,
      this.#userInfoView.cityInput.value,
      this.#userInfoView.streetInput.value,
      this.#userInfoView.streetNumberInput.value,
      this.#userInfoView.idCardNumberInput.value,
      this.#userInfoView.uniqueBirthNumberInput.value
    );
  }

  #clearInputs() {
    this.#userInfoView.idCardNumberInput.value = "";
    this.#userInfoView.streetInput.value = "";
    this.#userInfoView.cityInput.value = "";
    this.#userInfoView.streetNumberInput.value = "";
    this.#userInfoView.nameInput.value = "";
    this.#userInfoView.surnameInput.value = "";
    this.#userInfoView.uniqueBirthNumberInput.value = "";
  }
}
