using CustomerSupport.Data;
using CustomerSupport.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerSupport.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly CustomerSupportDbContext _context;
        public UserController(CustomerSupportDbContext context)
        {
            _context = context;   
        }
        
        [HttpPost("authenticate")]
        public async Task<IActionResult> loginUser(User userObject) {
            if (userObject == null) {
                return BadRequest();
            }

            var user= await _context.Users.FirstOrDefaultAsync(x=> x.Username == userObject.Username && x.Password==userObject.Password);

            if (user == null)
            {
                return NotFound();
            }
            else {
                return Ok(new { Message = "Successfully Logged In!" });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> registerUser([FromBody] User user) {
            if (user == null)
            {
                return BadRequest();
            }

            user.Id = new Guid();
            user.Password = PasswordHasher.HashPassword(user.Password);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "User successfully registered!"});
        }
        
    }
}
