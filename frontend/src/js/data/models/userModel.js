export class UserModel {
  name;
  surname;
  city;
  street;
  streetNumber;
  idCardNumber;
  uniqueBirthNumber;
  hasVehicles;
  constructor(
    name,
    surname,
    city,
    street,
    streetNumber,
    idCardNumber,
    uniqueBirthNumber,
    hasVehicles
  ) {
    this.name = name;
    this.surname = surname;
    this.city = city;
    this.street = street;
    this.streetNumber = streetNumber;
    this.idCardNumber = idCardNumber;
    this.uniqueBirthNumber = uniqueBirthNumber;
    this.hasVehicles = hasVehicles;
  }
}
