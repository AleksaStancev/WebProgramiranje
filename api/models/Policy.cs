using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.models
{
    public class Policy
    {
        [Key]
        public string PolicyNumber { get; set; }
        public DateTime SigningDate { get; set; }
        public int Price { get; set; }
        public DateTime ValidUntill { get; set; }
        public string VehicleBodyId { get; set; }
        [JsonIgnore]
        public Vehicle Vehicle { get; set; }
    }
}