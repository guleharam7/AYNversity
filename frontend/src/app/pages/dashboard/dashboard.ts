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

  newCourse = {
    title: '',
    description: '',
    category: ''
  };

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((res: any) => {
      this.courses = res;
    });
  }

  addCourse() {
    if (!this.newCourse.title || !this.newCourse.description) return;

    this.courseService.addCourse(this.newCourse).subscribe(() => {
      this.loadCourses();
      this.newCourse = { title: '', description: '', category: '' };
    });
  }

  deleteCourse(id: string) {
    this.courseService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
    });
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}