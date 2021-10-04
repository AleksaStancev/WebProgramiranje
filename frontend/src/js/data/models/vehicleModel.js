export class VehicleModel {
  bodyId;
  brand;
  model;
  color;
  yearOfManufacture;
  licencePlate;
  engineVolume;
  ownerUniqueBirthNumber;
  constructor(
    bodyId,
    brand,
    model,
    color,
    yearOfManufacture,
    licencePlate,
    engineVolume,
    ownerUniqueBirthNumber
  ) {
    this.bodyId = bodyId;
    this.brand = brand;
    this.model = model;
    this.color = color;
    this.yearOfManufacture = yearOfManufacture;
    this.licencePlate = licencePlate;
    this.engineVolume = engineVolume;
    this.ownerUniqueBirthNumber = ownerUniqueBirthNumber;
  }
}
