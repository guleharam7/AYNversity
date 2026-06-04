import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // All courses from API
  allCourses: any[] = [];

  userEmail: string | null = '';
  userInitial: string = '?';
  role: string | null = '';

  // Student tab toggle
  activeTab: 'browse' | 'enrolled' = 'browse';

  newCourse = {
    title: '',
    description: '',
    category: '',
    instructor: '',
    userEmail: '',
    notesUrl: '',
    videoUrl: ''
  };

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    this.role = localStorage.getItem('role');
    this.userInitial = (this.userEmail || 'U')[0].toUpperCase();
    this.loadCourses();
  }

  isTeacher(): boolean { return this.role === 'Teacher'; }
  isStudent(): boolean { return this.role === 'Student'; }

  // Courses belonging to this teacher
  get myCourses(): any[] {
    return this.allCourses.filter(c => c.userEmail === this.userEmail);
  }

  // Courses this student is enrolled in
  get enrolledCourses(): any[] {
    return this.allCourses.filter(c =>
      c.enrolledUsers && c.enrolledUsers.includes(this.userEmail)
    );
  }

  isEnrolled(course: any): boolean {
    return course.enrolledUsers && course.enrolledUsers.includes(this.userEmail);
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (res: any) => { this.allCourses = res; },
      error: (err) => console.error('Load courses error:', err)
    });
  }

  addCourse() {
    if (!this.newCourse.title || !this.newCourse.description || !this.newCourse.category) {
      alert('Title, description, and category are required.');
      return;
    }

    // Attach the teacher's email automatically
    this.newCourse.userEmail = this.userEmail || '';

    this.courseService.addCourse(this.newCourse, undefined, undefined).subscribe({
      next: () => {
        this.loadCourses();
        this.newCourse = { title: '', description: '', category: '', instructor: '', userEmail: '', notesUrl: '', videoUrl: '' };
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add course. Make sure you are logged in as a Teacher.');
      }
    });
  }

  applyCourse(id: string) {
    this.courseService.applyCourse(id).subscribe({
      next: () => this.loadCourses(),
      error: (err) => console.error(err)
    });
  }

  deleteCourse(id: string) {
    if (!confirm('Delete this course?')) return;
    this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}