export class PolicyModel {
  policyNumber;
  vehicleBodyId;
  signingDate;
  validUntill;
  price;
  constructor(policyNumber, vehicleBodyId, signingDate, validUntill, price) {
    this.policyNumber = policyNumber;
    this.vehicleBodyId = vehicleBodyId;
    this.signingDate = signingDate;
    this.validUntill = validUntill;
    this.price = price;
  }
}
