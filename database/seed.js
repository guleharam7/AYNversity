// ============================================================
// AYNversity — MongoDB Seed Data
// Database: AYNversityDB
// Run with: mongosh < seed.js
// Or paste into MongoDB Compass > MongoShell
// ============================================================

use("AYNversityDB");

// ── Clear existing collections (optional for fresh seed) ──
db.Users.drop();
db.Courses.drop();

// ── USERS ────────────────────────────────────────────────────
// Passwords are BCrypt hashed. Plain-text passwords:
//   admin@aynversity.com  → Admin@123
//   teacher1@ayn.com      → Teacher@123
//   teacher2@ayn.com      → Teacher@123
//   student1@ayn.com      → Student@123
//   student2@ayn.com      → Student@123

db.Users.insertMany([
  {
    Name: "Super Admin",
    Email: "admin@aynversity.com",
    Password: "$2b$10$tZ8n8L9vYh0qP2eR8UjKueMh.V9bV/iL5w7sD/cO2NfA7s8aHwH9y",
    Role: "Admin"
  },
  {
    Name: "Ali Hassan",
    Email: "teacher1@ayn.com",
    Password: "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.",
    Role: "Teacher"
  },
  {
    Name: "Sara Khan",
    Email: "teacher2@ayn.com",
    Password: "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.",
    Role: "Teacher"
  },
  {
    Name: "Usman Tariq",
    Email: "student1@ayn.com",
    Password: "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.",
    Role: "Student"
  },
  {
    Name: "Ayesha Noor",
    Email: "student2@ayn.com",
    Password: "$2a$11$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.",
    Role: "Student"
  }
]);

print("Users seeded:", db.Users.countDocuments());

// ── COURSES ──────────────────────────────────────────────────
db.Courses.insertMany([
  {
    Title: "Introduction to Web Technologies",
    Description: "Learn the foundations of HTML, CSS, and JavaScript to build modern websites.",
    Category: "Web Development",
    Instructor: "Ali Hassan",
    UserEmail: "teacher1@ayn.com",
    NotesUrl: "",
    VideoUrl: "",
    EnrolledUsers: ["student1@ayn.com", "student2@ayn.com"]
  },
  {
    Title: "Angular & TypeScript Masterclass",
    Description: "Build full-scale single-page applications with Angular 17 and TypeScript.",
    Category: "Frontend",
    Instructor: "Ali Hassan",
    UserEmail: "teacher1@ayn.com",
    NotesUrl: "",
    VideoUrl: "",
    EnrolledUsers: ["student1@ayn.com"]
  },
  {
    Title: "ASP.NET Core Web API",
    Description: "Design and build RESTful APIs with ASP.NET Core, JWT authentication, and MongoDB.",
    Category: "Backend",
    Instructor: "Sara Khan",
    UserEmail: "teacher2@ayn.com",
    NotesUrl: "",
    VideoUrl: "",
    EnrolledUsers: ["student2@ayn.com"]
  },
  {
    Title: "Database Design with MongoDB",
    Description: "Understand NoSQL design principles, collections, indexing, and aggregation pipelines.",
    Category: "Database",
    Instructor: "Sara Khan",
    UserEmail: "teacher2@ayn.com",
    NotesUrl: "",
    VideoUrl: "",
    EnrolledUsers: []
  },
  {
    Title: "Full-Stack Project Workshop",
    Description: "End-to-end project building a real-world app with Angular frontend and ASP.NET Core backend.",
    Category: "Full Stack",
    Instructor: "Ali Hassan",
    UserEmail: "teacher1@ayn.com",
    NotesUrl: "",
    VideoUrl: "",
    EnrolledUsers: ["student1@ayn.com", "student2@ayn.com"]
  }
]);

print("Courses seeded:", db.Courses.countDocuments());
print("");
print("── Demo Credentials ─────────────────────────────────");
print("Admin   : admin@aynversity.com  / Admin@123");
print("Teacher : teacher1@ayn.com      / Teacher@123");
print("Teacher : teacher2@ayn.com      / Teacher@123");
print("Student : student1@ayn.com      / Student@123");
print("Student : student2@ayn.com      / Student@123");
print("─────────────────────────────────────────────────────");