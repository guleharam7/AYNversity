using Microsoft.AspNetCore.Mvc;
using AYNversityAPI.Services;
using AYNversityAPI.Models;

namespace AYNversityAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // GET ALL USERS
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        // UPDATE USER
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, User user)
        {
            var existing = await _userService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            user.Id = id;
            await _userService.UpdateAsync(id, user);

            return Ok("User updated successfully");
        }

        // DELETE USER
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var existing = await _userService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _userService.DeleteAsync(id);
            return Ok("User deleted successfully");
        }
    }
}