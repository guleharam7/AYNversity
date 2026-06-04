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

  selectedNotesFile: File | null = null;
  selectedVideoFile: File | null = null;

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
    this.loadCourses();
  }

  isTeacher(): boolean {
    return this.role === 'Teacher';
  }

  isStudent(): boolean {
    return this.role === 'Student';
  }

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

  onNotesFileChange(event: any) {
    this.selectedNotesFile = event.target.files[0];
  }

  onVideoFileChange(event: any) {
    this.selectedVideoFile = event.target.files[0];
  }

  addCourse() {

    if (!this.newCourse.title || !this.newCourse.description || !this.newCourse.category) {
      alert('Fill required fields');
      return;
    }

    this.courseService.addCourse(
      this.newCourse,
      this.selectedNotesFile!,
      this.selectedVideoFile!
    ).subscribe({
      next: (res: any) => {
        alert('Course added successfully');
        this.courses.unshift(res);

        this.loadCourses();

        this.newCourse = {
          title: '',
          description: '',
          category: '',
          instructor: '',
          userEmail: '',
          notesUrl: '',
          videoUrl: ''
        };

        this.selectedNotesFile = null;
        this.selectedVideoFile = null;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add course');
      }
    });
  }

  applyCourse(id: string) {
    this.courseService.applyCourse(id).subscribe({
      next: () => {
        alert('Applied!');
        this.loadCourses();
      },
      error: (err) => console.error(err)
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