using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("Policies")]
    public class PolicyController : ControllerBase
    {
        private readonly InsuranceDbContext _insuranceContext;

        public PolicyController(InsuranceDbContext insuranceContext)
        {
            this._insuranceContext = insuranceContext;
        }
        [HttpGet]
        [Route("GetPolicyById")]
        public async Task<ActionResult<Policy>> GetByID([FromQuery] string policyNumber)
        {
            if (!string.IsNullOrEmpty(policyNumber))
            {
                var policy = await _insuranceContext.FindAsync<Policy>(policyNumber);
                if (policy is not null)
                {
                    return Ok(policy);
                }
            }
            return BadRequest();
        }
        [HttpPost]
        [Route("CreatePolicy")]
        public async Task<IActionResult> CreatePolicy([FromBody] Policy policyToCreate)
        {
            if (policyToCreate.PolicyNumber is not null && policyToCreate.VehicleBodyId is not null)
            {
                var existingVehicle = await _insuranceContext.Set<Vehicle>().AnyAsync(vehicle => vehicle.BodyId == policyToCreate.VehicleBodyId);
                if (existingVehicle)
                {
                    await _insuranceContext.AddAsync<Policy>(policyToCreate);
                    await _insuranceContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpDelete]
        [Route("DeletePolicy")]
        public async Task<IActionResult> DeletePolicy([FromQuery] string policyNumber)
        {
            if (!string.IsNullOrEmpty(policyNumber))
            {
                var policy = await _insuranceContext.FindAsync<Policy>(policyNumber);
                if (policy is not null)
                {
                    _insuranceContext.Remove<Policy>(policy);
                    await _insuranceContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpPut]
        [Route("UpdatePolicy")]
        public async Task<IActionResult> UpdatePolicy([FromBody] Policy policyToUpdate)
        {
            if (policyToUpdate.PolicyNumber is not null && policyToUpdate.VehicleBodyId is not null)
            {
                var existingVehicle = await _insuranceContext.Set<Vehicle>().AnyAsync(vehicle => vehicle.BodyId == policyToUpdate.VehicleBodyId);
                var existingPolicy = await _insuranceContext.Set<Policy>().AnyAsync(policy => policy.PolicyNumber == policyToUpdate.PolicyNumber);
                if (existingVehicle && existingPolicy)
                {
                    _insuranceContext.Update<Policy>(policyToUpdate);
                    await _insuranceContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpGet]
        [Route("GetPoliciesForVehicle")]
        public async Task<ActionResult<ICollection<Policy>>> GetPoliciesForVehicle([FromQuery] string BodyId)
        {
            if (!string.IsNullOrEmpty(BodyId))
            {
                var vehicleExists = await _insuranceContext.Set<Vehicle>().AnyAsync(vehicle => vehicle.BodyId == BodyId);
                if (vehicleExists)
                {
                    var policyList = await _insuranceContext.Set<Policy>().Where(policy => policy.VehicleBodyId == BodyId).ToListAsync();
                    return Ok(policyList);
                }
            }
            return BadRequest();
        }
    }
}