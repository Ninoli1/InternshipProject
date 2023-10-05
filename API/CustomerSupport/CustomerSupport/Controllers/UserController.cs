using CustomerSupport.Data;
using CustomerSupport.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

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

            var user= await _context.Users.FirstOrDefaultAsync(x=> x.Username == userObject.Username );

            if (user == null)
            {
                return NotFound();
            }

            if (!PasswordHasher.VerifyPassword(userObject.Password, user.Password)) {
                return BadRequest(new { Message = "Password is incorrect!"});
            }

            user.Token = CreateJWT(user);

            return Ok(new
            {
                Token= user.Token,
                Message = "Successfully Logged In!"
            }) ;
        }

        [HttpPost("register")]
        public async Task<IActionResult> registerUser([FromBody] User user) {
            if (user == null)
                return BadRequest();

            if (await ExistsUsername(user.Username))
                return BadRequest(new { Message = "Username already exists!" });

            if (await ExistsEmail(user.Email))
                return BadRequest(new { Message = "Email already exists! " });

            var password = PasswordStrengthCheck(user.Password);
            if (!string.IsNullOrEmpty(password))
                return BadRequest(new { Message = password.ToString()});

            
            user.Id = new Guid();
            user.Password = PasswordHasher.HashPassword(user.Password);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "User successfully registered!"});
        }

        private async Task<bool> ExistsUsername(string username) {
            return await _context.Users.AnyAsync(x=> x.Username == username );
        }
        private async Task<bool> ExistsEmail(string email)
        {
            return await _context.Users.AnyAsync(x => x.Email == email);
        }

        private string PasswordStrengthCheck(string password) {

            StringBuilder stringBuilder = new StringBuilder();

            if (password.Length < 8)
                stringBuilder.Append("Minimum 8 characters!" + Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
                stringBuilder.Append("Password should be Alphanumeric!" + Environment.NewLine);
            if(!Regex.IsMatch(password,"[<,>,@,!,#,$,%,^,&,*,(,),_,+,\\[,\\],{,},?,;,:,|,',\\,.,/,-,=]"))
                stringBuilder.Append("Password should contain special character " + Environment.NewLine);
            return stringBuilder.ToString();

        }

        private string CreateJWT(User user)
        {

            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("YouCanTrustMe....");
            var identity = new ClaimsIdentity(new Claim[] {

                new Claim(ClaimTypes.Role,user.Role),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {

                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);



        }
    }
}
