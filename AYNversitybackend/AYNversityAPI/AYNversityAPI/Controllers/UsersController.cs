using Microsoft.AspNetCore.Mvc;
using AYNversityAPI.Models;
using AYNversityAPI.Services;

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

        [HttpGet]
        public async Task<List<User>> Get()
        {
            return await _userService.GetAsync();
        }

        [HttpPost]
        public async Task<IActionResult> Create(User user)
        {
            await _userService.CreateAsync(user);
            return Ok(user);
        }
    }
}