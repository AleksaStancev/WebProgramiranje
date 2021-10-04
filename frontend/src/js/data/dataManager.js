import { serverUrl } from "../constants.js";

export class DataManager {
  constructor() {}

  async createUser(user) {
    const response = await fetch(serverUrl + "/Users/CreateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return response.ok;
  }

  async updateUser(user) {
    const response = await fetch(serverUrl + "/Users/UpdateUser", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    return response.ok;
  }

  async deleteUser(uniqueBirthNumber) {
    const response = await fetch(
      serverUrl +
        "/Users/DeleteUserById?UniqueBirthNumber=" +
        uniqueBirthNumber,
      {
        method: "DELETE",
      }
    );
    return response.ok;
  }

  async getAllUniqueBirthNumbers() {
    const response = await fetch(
      serverUrl + "/Users/GetAllUniqueBirthNumbers",
      {
        method: "GET",
      }
    );
    const responseJson = await response.json();
    return responseJson;
  }

  async getUser(uniqueBirthNumber) {
    const response = await fetch(
      serverUrl + "/Users/GetUserById?UniqueBirthNumber=" + uniqueBirthNumber,
      {
        method: "GET",
      }
    );
    const responseJson = await response.json();
    return responseJson;
  }

  async createVehicle(vehicle) {
    const response = await fetch(serverUrl + "/Vehicles/CreateVehicle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicle),
    });
    return response.ok;
  }

  async updateVehicle(vehicle) {
    const response = await fetch(serverUrl + "/Vehicles/UpdateVehicle", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(vehicle),
    });
    return response.ok;
  }

  async deleteVehice(bodyId) {
    const response = await fetch(
      serverUrl + "/Vehicles/DeleteVehicleById?bodyId=" + bodyId,
      {
        method: "DELETE",
      }
    );
    return response.ok;
  }

  async getVehiclesForUser(uniqueBirthNumber) {
    const response = await fetch(
      serverUrl +
        "/Vehicles/GetVehiclesForUser?uniqueBirthNumber=" +
        uniqueBirthNumber,
      {
        method: "GET",
      }
    );
    const responseJson = await response.json();
    return responseJson;
  }

  async createPolicy(policy) {
    const response = await fetch(serverUrl + "/Policies/CreatePolicy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policy),
    });
    return response.ok;
  }

  async updatePolicy(policy) {
    const response = await fetch(serverUrl + "/Policies/UpdatePolicy", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policy),
    });
    return response.ok;
  }

  async deletePolicy(policyNumber) {
    const response = await fetch(
      serverUrl + "/Policies/DeletePolicy?policyNumber=" + policyNumber,
      {
        method: "DELETE",
      }
    );
    return response.ok;
  }

  async getPoliciesForVehicle(bodyId) {
    const response = await fetch(
      serverUrl + "/Policies/GetPoliciesForVehicle?bodyId=" + bodyId,
      {
        method: "GET",
      }
    );
    const responseJson = await response.json();
    return responseJson;
  }
}
