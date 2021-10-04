import { DataManager } from "./data/dataManager.js";
import { UIManager } from "./ui/uiManager.js";

export class InsuranceCompany {
  #uiManager;
  #userView;
  #policyView;
  #vehicleView;
  #dataManager;
  constructor() {
    this.#dataManager = new DataManager();
    this.#uiManager = new UIManager(
      this.#dataManager.getAllUniqueBirthNumbers,
      this.#dataManager.createUser,
      this.#dataManager.getUser,
      this.#dataManager.updateUser,
      this.#dataManager.deleteUser,
      this.#dataManager.getVehiclesForUser,
      this.#dataManager.createVehicle,
      this.#dataManager.updateVehicle,
      this.#dataManager.deleteVehice,
      this.#dataManager.getPolicy,
      this.#dataManager.getPoliciesForVehicle,
      this.#dataManager.createPolicy,
      this.#dataManager.updatePolicy,
      this.#dataManager.deletePolicy
    );
  }

  async start() {
    this.#uiManager.initializeUI();
  }
}
