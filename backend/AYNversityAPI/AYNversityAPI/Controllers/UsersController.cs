using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AYNversityAPI.Services;
using AYNversityAPI.Models;

namespace AYNversityAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // GET ALL USERS — Admin or Teacher
        [HttpGet]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> Get()
        {
            var users = await _userService.GetAllAsync();
            var result = users.Select(u => new { u.Id, u.Name, u.Email, u.Role });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound(new { message = "User not found" });
            return Ok(new { user.Id, user.Name, user.Email, user.Role });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(string id, User user)
        {
            var existing = await _userService.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "User not found" });
            user.Id = id;
            user.Password = existing.Password;
            await _userService.UpdateAsync(id, user);
            return Ok(new { message = "User updated successfully" });
        }

        // DELETE — Admin only
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _userService.GetByIdAsync(id);
            if (existing == null) return NotFound(new { message = "User not found" });
            await _userService.DeleteAsync(id);
            return Ok(new { message = "User deleted successfully" });
        }
    }
}