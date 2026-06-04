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

        // ── GET ALL (no role filter) — for student browse & teacher view ──
        [HttpGet("all")]
        public async Task<ActionResult<List<Course>>> GetAll()
        {
            var courses = await _courseService.GetAllAsync();
            return Ok(courses);
        }

        // ── GET FILTERED (role-based) — original endpoint kept ──
        [HttpGet]
        public async Task<ActionResult<List<Course>>> Get()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var courses = await _courseService.GetAllAsync();

            if (role == "Teacher")
                return Ok(courses.Where(c => c.UserEmail == email).ToList());

            if (role == "Student")
                return Ok(courses.Where(c =>
                    c.EnrolledUsers != null && c.EnrolledUsers.Contains(email)).ToList());

            return Ok(courses);
        }

        // ── GET BY ID ──
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetById(string id)
        {
            var course = await _courseService.GetByIdAsync(id);
            if (course == null) return NotFound();
            return Ok(course);
        }

        // ── CREATE (Teacher only) ──
        [HttpPost]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> CreateCourse(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] string category,
            [FromForm] string? instructor,
            [FromForm] string? userEmail,
            [FromForm] string? notesUrl,
            [FromForm] string? videoUrl,
            IFormFile? notesFile,
            IFormFile? videoFile)
        {
            // If files are provided, save them and override URLs
            if (notesFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(notesFile.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/notes", fileName);
                Directory.CreateDirectory(Path.GetDirectoryName(path)!);
                using var stream = new FileStream(path, FileMode.Create);
                await notesFile.CopyToAsync(stream);
                notesUrl = "/uploads/notes/" + fileName;
            }

            if (videoFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(videoFile.FileName);
                var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/videos", fileName);
                Directory.CreateDirectory(Path.GetDirectoryName(path)!);
                using var stream = new FileStream(path, FileMode.Create);
                await videoFile.CopyToAsync(stream);
                videoUrl = "/uploads/videos/" + fileName;
            }

            var course = new Course
            {
                Title = title,
                Description = description,
                Category = category,
                Instructor = instructor,
                UserEmail = userEmail,
                NotesUrl = notesUrl,
                VideoUrl = videoUrl,
                EnrolledUsers = new List<string>()
            };

            await _courseService.CreateAsync(course);
            return Ok(course);
        }

        // ── UPDATE (Teacher only) ──
        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Update(string id, [FromBody] Course course)
        {
            var existing = await _courseService.GetByIdAsync(id);
            if (existing == null) return NotFound();

            course.Id = id;
            // Preserve enrolled users
            course.EnrolledUsers = existing.EnrolledUsers;
            await _courseService.UpdateAsync(id, course);
            return NoContent();
        }

        // ── DELETE (Teacher only) ──
        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> Delete(string id)
        {
            var course = await _courseService.GetByIdAsync(id);
            if (course == null) return NotFound();
            await _courseService.DeleteAsync(id);
            return NoContent();
        }

        // ── APPLY (Student only) ──
        [HttpPost("{id}/apply")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> ApplyToCourse(string id)
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var course = await _courseService.GetByIdAsync(id);
            if (course == null) return NotFound();

            course.EnrolledUsers ??= new List<string>();
            if (!course.EnrolledUsers.Contains(email))
                course.EnrolledUsers.Add(email);

            await _courseService.UpdateAsync(id, course);
            return Ok(new { message = "Enrolled successfully" });
        }
    }
}