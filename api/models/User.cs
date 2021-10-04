using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.models
{
    public class User
    {

        [Key]
        public string UniqueBirthNumber { get; set; }
        public string IdCardNumber { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string StreetNumber { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        [JsonIgnore]
        public ICollection<Vehicle> Vehicles { get; set; }
    }
}