import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {

  courses: any[] = [];
  userEmail: string | null = '';
  role: string | null = '';

  newCourse = {
    title: '',
    description: '',
    category: '',
    instructor: '',
    userEmail: ''
  };

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    this.role = localStorage.getItem('role');

    this.loadCourses();
  }

  // ================= ROLE HELPERS =================

  isTeacher(): boolean {
    return this.role === 'Teacher';
  }

  isStudent(): boolean {
    return this.role === 'Student';
  }

  // ================= LOAD COURSES =================

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (res: any) => {
        this.courses = res;
      },
      error: (err) => {
        console.error('Load courses error:', err);
      }
    });
  }

  // ================= ADD COURSE =================

  addCourse() {

    const course = {
      title: this.newCourse.title?.trim(),
      description: this.newCourse.description?.trim(),
      category: this.newCourse.category?.trim(),
      instructor: this.newCourse.instructor?.trim(),
      userEmail: this.newCourse.userEmail?.trim()
    };

    if (
      !course.title ||
      !course.description ||
      !course.category ||
      !course.instructor ||
      !course.userEmail
    ) {
      alert('Please fill all course fields');
      return;
    }

    this.courseService.addCourse(course).subscribe({
      next: () => {

        alert('Course added successfully');

        this.loadCourses();

        this.newCourse = {
          title: '',
          description: '',
          category: '',
          instructor: '',
          userEmail: ''
        };
      },

      error: (err) => {
        console.log('FULL ERROR:', err);
        console.log('ERROR BODY:', err.error);
        console.log('VALIDATION ERRORS:', err.error?.errors);

        alert('Failed to add course');
      }
    });
  }

  // ================= APPLY COURSE =================

  applyCourse(id: string): void {

    this.courseService.applyCourse(id).subscribe({
      next: () => {
        alert('Course applied successfully!');
        this.loadCourses();
      },

      error: (err) => {
        console.error(err);
        alert('Failed to apply course');
      }
    });
  }

  // ================= DELETE COURSE =================

  deleteCourse(id: string) {

    if (!confirm('Delete this course?')) {
      return;
    }

    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.loadCourses();
      },

      error: (err) => {
        console.error(err);
        alert('Failed to delete course');
      }
    });
  }

  // ================= LOGOUT =================

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}