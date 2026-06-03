using Microsoft.AspNetCore.Mvc;
using AYNversityAPI.Services;
using AYNversityAPI.Models;
using AYNversityAPI.DTOs;
using Microsoft.Extensions.Options;
using AYNversityAPI.Data;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MongoDB.Driver;

namespace AYNversityAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtSettings _jwtSettings;

        public AuthController(UserService userService, IOptions<JwtSettings> jwtSettings)
        {
            _userService = userService;
            _jwtSettings = jwtSettings.Value;
        }

        // ---------------- REGISTER ----------------
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid request");

            var existingUser = await _userService.GetByEmailAsync(dto.Email);

            if (existingUser != null)
            {
                return Conflict(new
                {
                    message = "Email already exists. Please login instead."
                });
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email.ToLower().Trim(),
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role ?? "Student"
            };

            await _userService.CreateAsync(user);

            return Ok(new
            {
                message = "User registered successfully"
            });
        }

        // ---------------- LOGIN ----------------
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userService.GetByEmailAsync(dto.Email);

            if (user == null)
                return BadRequest("Invalid credentials");

            bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);

            if (!isValid)
                return BadRequest("Invalid credentials");

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                token,

                user = new
                {
                    email = user.Email,
                    role = user.Role
                }
            });
        }
        // ---------------- JWT GENERATOR ----------------
        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtSettings.Key));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role ?? "Student")
            };

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}