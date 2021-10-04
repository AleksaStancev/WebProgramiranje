using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace api.Controllers
{
    [ApiController]
    [Route("Users")]
    public class UserController : ControllerBase
    {
        private readonly InsuranceDbContext _insuranceDbContext;

        public UserController(InsuranceDbContext insuranceDbContext)
        {
            _insuranceDbContext = insuranceDbContext;
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<IActionResult> CreateUser([FromBody] User userToCreate)
        {
            if (userToCreate.UniqueBirthNumber is not null
                && userToCreate.IdCardNumber is not null
                && userToCreate.City is not null
                && userToCreate.Street is not null
                && userToCreate.StreetNumber is not null
                && userToCreate.Name is not null
                && userToCreate.Surname is not null)
            {
                var existingUser = _insuranceDbContext.Set<User>().Any(user => user.UniqueBirthNumber == userToCreate.UniqueBirthNumber);
                if (!existingUser)
                {
                    await _insuranceDbContext.Set<User>().AddAsync(userToCreate);
                    await _insuranceDbContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpGet]
        [Route("GetAllUniqueBirthNumbers")]
        public async Task<ActionResult<ICollection<string>>> GetAllUniqueBirthNumbers()
        {
            var UniqueBirthNumberList = new List<string>();
            var list = await _insuranceDbContext.Set<User>().Select(user => user.UniqueBirthNumber).ToListAsync();

            return Ok(list);
        }
        [HttpPut]
        [Route("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] User userToUpdate)
        {
            if (userToUpdate.UniqueBirthNumber is not null
               && userToUpdate.IdCardNumber is not null
               && userToUpdate.City is not null
               && userToUpdate.Street is not null
               && userToUpdate.StreetNumber is not null
               && userToUpdate.Name is not null
               && userToUpdate.Surname is not null)
            {
                var existingUser = await _insuranceDbContext.Set<User>().AnyAsync(user => user.UniqueBirthNumber == userToUpdate.UniqueBirthNumber);
                if (existingUser)
                {
                    _insuranceDbContext.Update<User>(userToUpdate);
                    await _insuranceDbContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
        [HttpGet]
        [Route("GetUserById")]
        public async Task<ActionResult> GetUserById([FromQuery] string UniqueBirthNumber)
        {
            if (!string.IsNullOrEmpty(UniqueBirthNumber))
            {
                var user = await _insuranceDbContext.Set<User>()
                    .Include(user => user.Vehicles)
                    .FirstOrDefaultAsync(user => user.UniqueBirthNumber == UniqueBirthNumber);
                if (user is not null)
                    return Ok(new { UniqueBirthNumber = user.UniqueBirthNumber, Name = user.Name, Surname = user.Surname, Street = user.Street, StreetNumber = user.StreetNumber, City = user.City, IdCardNumber = user.IdCardNumber, HasVehicles = user.Vehicles.Count > 0 });

            }
            return BadRequest();
        }
        [HttpDelete]
        [Route("DeleteUserById")]
        public async Task<IActionResult> DeleteUserById([FromQuery] string UniqueBirthNumber)
        {
            if (!string.IsNullOrEmpty(UniqueBirthNumber))
            {
                var user = await _insuranceDbContext.Set<User>().FindAsync(UniqueBirthNumber);
                if (user is not null)
                {
                    _insuranceDbContext.Set<User>().Remove(user);
                    await _insuranceDbContext.SaveChangesAsync();
                    return Ok();
                }
            }
            return BadRequest();
        }
    }
}