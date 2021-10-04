using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.models
{
    public class Vehicle
    {
        [Key]
        public string BodyId { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public string Color { get; set; }
        public int YearOfManufacture { get; set; }
        public string LicencePlate { get; set; }
        public int EngineVolume { get; set; }
        public string OwnerUniqueBirthNumber { get; set; }
        [JsonIgnore]
        public User Owner { get; set; }
        [JsonIgnore]
        public ICollection<Policy> Policies { get; set; }
    }
}