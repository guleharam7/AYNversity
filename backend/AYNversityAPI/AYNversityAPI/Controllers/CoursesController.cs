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

        // ======================================================
        // GET ALL COURSES (TEACHER VIEW ONLY)
        // ======================================================
        [HttpGet("all")]
        [Authorize(Roles = "Teacher")]
        public async Task<ActionResult<List<Course>>> GetAllCourses()
        {
            return await _courseService.GetAllAsync();
        }

        // ======================================================
        // GET MY COURSES (STUDENT VIEW)
        // ======================================================
        [HttpGet]
        public async Task<ActionResult<List<Course>>> Get()
        {
            return await _courseService.GetAllAsync();
        }

        // ======================================================
        // GET COURSE BY ID
        // ======================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> Get(string id)
        {
            var course = await _courseService.GetByIdAsync(id);

            if (course == null)
                return NotFound();

            return course;
        }

        // ======================================================
        // CREATE COURSE (Teacher ONLY)
        // ======================================================
        [HttpPost]
        public async Task<IActionResult> CreateCourse(Course course)
        {
            await _courseService.CreateAsync(course);
            return Ok(course);
        }

        // ======================================================
        // UPDATE COURSE (Teacher ONLY)
        // ======================================================
        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Update(string id, Course course)
        {
            var existingCourse = await _courseService.GetByIdAsync(id);

            if (existingCourse == null)
                return NotFound();

            course.Id = existingCourse.Id;

            await _courseService.UpdateAsync(id, course);

            return NoContent();
        }

        // ======================================================
        // DELETE COURSE (Teacher ONLY)
        // ======================================================
        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Delete(string id)
        {
            var course = await _courseService.GetByIdAsync(id);

            if (course == null)
                return NotFound();

            await _courseService.DeleteAsync(id);

            return NoContent();
        }

        // ======================================================
        // APPLY COURSE (STUDENT ONLY)
        // ======================================================
        [HttpPost("{id}/apply")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> ApplyToCourse(string id)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            var course = await _courseService.GetByIdAsync(id);
            if (course == null)
                return NotFound();

            if (!course.EnrolledUsers.Contains(email))
            {
                course.EnrolledUsers.Add(email);
            }

            await _courseService.UpdateAsync(id, course);

            return Ok(new { message = "Course applied successfully" });
        }
    }
}
