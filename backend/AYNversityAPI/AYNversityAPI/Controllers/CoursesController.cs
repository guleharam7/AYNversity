using AYNversityAPI.Models;
using AYNversityAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AYNversityAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CoursesController : ControllerBase
    {
        private readonly CourseService _courseService;

        public CoursesController(CourseService courseService)
        {
            _courseService = courseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Course>>> Get()
        {
            return await _courseService.GetAllAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> Get(string id)
        {
            var course = await _courseService.GetByIdAsync(id);

            if (course == null)
                return NotFound();

            return course;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCourse(Course course)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            course.UserEmail = email; 

            await _courseService.CreateAsync(course);

            return Ok(course);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, Course course)
        {
            var existingCourse = await _courseService.GetByIdAsync(id);

            if (existingCourse == null)
                return NotFound();

            course.Id = existingCourse.Id;

            await _courseService.UpdateAsync(id, course);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var course = await _courseService.GetByIdAsync(id);

            if (course == null)
                return NotFound();

            await _courseService.DeleteAsync(id);

            return NoContent();
        }
    }
}