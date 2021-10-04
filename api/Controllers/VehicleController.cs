using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("Vehicles")]
    public class VehicleController : ControllerBase
    {
        private readonly InsuranceDbContext _insuranceContext;

        public VehicleController(InsuranceDbContext insuranceContext)
        {
            this._insuranceContext = insuranceContext;
        }

        [HttpGet]
        [Route("GetVehicleById")]
        public async Task<ActionResult> GetVehicleById([FromQuery] string bodyId)
        {
            if (!string.IsNullOrEmpty(bodyId))
            {
                var vehicle = await _insuranceContext.Set<Vehicle>()
                    .Include(vehicle => vehicle.Policies)
                    .FirstOrDefaultAsync(vehicle => vehicle.BodyId == bodyId);
                if (vehicle is not null)
                    return Ok(new { BodyId = vehicle.BodyId, Model = vehicle.Model, Brand = vehicle.Brand, LicencePlate = vehicle.LicencePlate, YearOfManufacture = vehicle.YearOfManufacture, Color = vehicle.Color, EngineVolume = vehicle.EngineVolume, HasPolicies = vehicle.Policies.Count > 0 });
            }
            return BadRequest();
        }

        [HttpPost]
        [Route("CreateVehicle")]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicleToCreate)
        {
            if (vehicleToCreate.BodyId is not null
                && vehicleToCreate.Brand is not null
                && vehicleToCreate.Color is not null
                && vehicleToCreate.LicencePlate is not null
                && vehicleToCreate.Model is not null
                && vehicleToCreate.OwnerUniqueBirthNumber is not null)
            {
                var existingOwner = await _insuranceContext.Set<User>().AnyAsync(user => user.UniqueBirthNumber == vehicleToCreate.OwnerUniqueBirthNumber);
                if (existingOwner)
                {
                    await _insuranceContext.AddAsync<Vehicle>(vehicleToCreate);
                    await _insuranceContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpPut]
        [Route("UpdateVehicle")]
        public async Task<IActionResult> UpdateVehicle([FromBody] Vehicle vehicleToUpdate)
        {
            if (vehicleToUpdate.BodyId is not null
                && vehicleToUpdate.Brand is not null
                && vehicleToUpdate.Color is not null
                && vehicleToUpdate.LicencePlate is not null
                && vehicleToUpdate.Model is not null
                && vehicleToUpdate.OwnerUniqueBirthNumber is not null)
            {
                var existingOwner = await _insuranceContext.Set<User>().AnyAsync(user => user.UniqueBirthNumber == vehicleToUpdate.OwnerUniqueBirthNumber);
                var existingVehicle = await _insuranceContext.Set<Vehicle>().AnyAsync(vehicle => vehicle.BodyId == vehicleToUpdate.BodyId);
                if (existingOwner && existingVehicle)
                {
                    _insuranceContext.Update<Vehicle>(vehicleToUpdate);
                    await _insuranceContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpDelete]
        [Route("DeleteVehicleById")]
        public async Task<IActionResult> DeleteVehicleById([FromQuery] string bodyId)
        {
            if (!string.IsNullOrEmpty(bodyId))
            {
                var vehicle = await _insuranceContext.FindAsync<Vehicle>(bodyId);
                if (vehicle is not null)
                {
                    _insuranceContext.Remove<Vehicle>(vehicle);
                    await _insuranceContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpGet]
        [Route("GetVehiclesForUser")]
        public async Task<ActionResult<ICollection>> GetVehiclesForUser([FromQuery] string uniqueBirthNumber)
        {
            if (!string.IsNullOrEmpty(uniqueBirthNumber))
            {
                var userExists = await _insuranceContext.Set<User>().AnyAsync(user => user.UniqueBirthNumber == uniqueBirthNumber);
                if (userExists)
                {
                    var vehicleList = await _insuranceContext.Set<Vehicle>()
                        .Where(vehicle => vehicle.OwnerUniqueBirthNumber == uniqueBirthNumber)
                        .Select(vehicle => new { BodyId = vehicle.BodyId, Model = vehicle.Model, Brand = vehicle.Brand, LicencePlate = vehicle.LicencePlate, YearOfManufacture = vehicle.YearOfManufacture, Color = vehicle.Color, EngineVolume = vehicle.EngineVolume, OwnerUniqeBirthNumber = vehicle.OwnerUniqueBirthNumber, HasPolicies = vehicle.Policies.Count > 0 })
                        .ToListAsync();
                    return Ok(vehicleList);
                }
            }
            return BadRequest();
        }
    }
}