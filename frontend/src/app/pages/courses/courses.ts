import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit, AfterViewInit {

  courses: any[]   = [];
  searchQuery      = '';
  userEmail        = '';

  get filteredCourses(): any[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.courses;
    return this.courses.filter(c =>
      this.val(c, 'title')?.toLowerCase().includes(q) ||
      this.val(c, 'category')?.toLowerCase().includes(q) ||
      this.val(c, 'instructor')?.toLowerCase().includes(q)
    );
  }

  constructor(private courseService: CourseService) {}

  // Read a field regardless of whether API returns camelCase or PascalCase
  val(course: any, field: string): any {
    const upper = field.charAt(0).toUpperCase() + field.slice(1);
    return course[field] ?? course[upper];
  }

  getId(course: any): string {
    return course['id'] ?? course['Id'] ?? course['_id'] ?? '';
  }

  ngOnInit() {
    this.userEmail = localStorage.getItem('email') || '';
    this.loadCourses();
  }

  ngAfterViewInit() {
    const searchInput = document.getElementById('course-search') as HTMLInputElement;
    const countBadge  = document.getElementById('result-count');
    if (searchInput && countBadge) {
      searchInput.addEventListener('input', () => {
        countBadge.style.transition = 'transform 0.15s ease';
        countBadge.style.transform  = 'scale(1.35)';
        setTimeout(() => { countBadge.style.transform = 'scale(1)'; }, 150);
      });
    }
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (data: any[]) => {
        console.log('RAW API response:', data);           
        console.log('Logged-in email:', this.userEmail);  
        // Match regardless of casing
        this.courses = data.filter(c =>
          (c['userEmail'] ?? c['UserEmail']) === this.userEmail
        );
        console.log('Filtered courses:', this.courses);
      },
      error: (err) => console.error('loadCourses error:', err)
    });
  }

  deleteCourse(course: any) {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    this.courseService.deleteCourse(this.getId(course)).subscribe(() => this.loadCourses());
  }

  logout() { localStorage.clear(); window.location.href = '/login'; }
}