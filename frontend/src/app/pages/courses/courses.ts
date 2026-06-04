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
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.instructor?.toLowerCase().includes(q)
    );
  }

  constructor(private courseService: CourseService) {}

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
        this.courses = data.filter(c => c.userEmail === this.userEmail);
      },
      error: (err) => console.error(err)
    });
  }

  deleteCourse(id: string) {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
  }

  logout() { localStorage.clear(); window.location.href = '/login'; }
}