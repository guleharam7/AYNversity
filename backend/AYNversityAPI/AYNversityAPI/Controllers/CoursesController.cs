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
        // GET ALL COURSES (Teacher + Student both)
        // ======================================================
        [HttpGet]
        public async Task<ActionResult<List<Course>>> Get()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var courses = await _courseService.GetAllAsync();

            // Teacher → only their own courses
            if (role == "Teacher")
            {
                return courses
                    .Where(c => c.UserEmail == email)
                    .ToList();
            }

            // Student → only enrolled courses
            if (role == "Student")
            {
                return courses
                    .Where(c => c.EnrolledUsers != null && c.EnrolledUsers.Contains(email))
                    .ToList();
            }

            return courses;
        }

        // ======================================================
        // GET COURSE BY ID
        // ======================================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetById(string id)
        {
            var course = await _courseService.GetByIdAsync(id);

            if (course == null)
                return NotFound();

            return Ok(course);
        }

        // ======================================================
        // CREATE COURSE (Teacher ONLY)
        // ======================================================
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> CreateCourse(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] string category,
            [FromForm] string instructor,
            [FromForm] string userEmail,
            IFormFile? notesFile,
            IFormFile? videoFile)
        {
            string? notesPath = null;
            string? videoPath = null;

            // Upload Notes
            if (notesFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(notesFile.FileName);

                var path = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/uploads/notes",
                    fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(path)!);

                using var stream = new FileStream(path, FileMode.Create);
                await notesFile.CopyToAsync(stream);

                notesPath = "/uploads/notes/" + fileName;
            }

            // Upload Video
            if (videoFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(videoFile.FileName);

                var path = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot/uploads/videos",
                    fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(path)!);

                using var stream = new FileStream(path, FileMode.Create);
                await videoFile.CopyToAsync(stream);

                videoPath = "/uploads/videos/" + fileName;
            }

            var course = new Course
            {
                Title = title,
                Description = description,
                Category = category,
                Instructor = instructor,
                UserEmail = userEmail,
                NotesUrl = notesPath,
                VideoUrl = videoPath,
                EnrolledUsers = new List<string>()
            };

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
            var existing = await _courseService.GetByIdAsync(id);

            if (existing == null)
                return NotFound();

            course.Id = id;

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
        // APPLY COURSE (Student ONLY)
        // ======================================================
        [HttpPost("{id}/apply")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> ApplyToCourse(string id)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            var course = await _courseService.GetByIdAsync(id);

            if (course == null)
                return NotFound();

            course.EnrolledUsers ??= new List<string>();

            if (!course.EnrolledUsers.Contains(email))
            {
                course.EnrolledUsers.Add(email);
            }

            await _courseService.UpdateAsync(id, course);

            return Ok(new { message = "Course applied successfully" });
        }
    }
}