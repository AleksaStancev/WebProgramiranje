import { DomHelper } from "../helpers/domHelper.js";
import { UserCreateView } from "./views/createViews/userCreateView.js";
import { UserMainView } from "./views/mainViews/userMainView.js";

export class UIManager {
  #mainContainerDiv;
  #userMainView;
  #userCreateView;
  constructor(
    userSelectPopulateCallback,
    createUserCallback,
    getUserCallback,
    updateUserCallback,
    deleteUserCallback,
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
    this.#mainContainerDiv = DomHelper.createAndAppendElement(
      document.body,
      "div",
      "container-div"
    );

    this.#userMainView = new UserMainView(
      userSelectPopulateCallback,
      getUserCallback,
      updateUserCallback,
      deleteUserCallback,
      showVehiclesCallback,
      createVehicleCallback,
      updateVehicleCallback,
      deleteVehicleCallback,
      getPolicyCallback,
      viewPoliciesCallback,
      createPolicyCallback,
      updatePolicyCallback,
      deletePolicyCallback
    );

    const populateUserSelectOnCreate = () => {
      this.#userMainView.populateUserSelect(true);
    };

    this.#userCreateView = new UserCreateView(
      createUserCallback,
      populateUserSelectOnCreate
    );
  }

  async initializeUI() {
    DomHelper.appendTitleLabel(this.#mainContainerDiv, "Insurance company");

    this.#mainContainerDiv.appendChild(this.#userCreateView.getView());

    this.#mainContainerDiv.appendChild(await this.#userMainView.getView());
  }
}
