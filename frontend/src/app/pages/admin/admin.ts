import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  activeTab: 'users' | 'courses' = 'users';

  users: any[]   = [];
  courses: any[] = [];

  loadingUsers   = false;
  loadingCourses = false;

  searchUsers   = '';
  searchCourses = '';

  adminEmail = '';

  private api = 'https://localhost:7023/api';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.adminEmail = localStorage.getItem('email') || 'Admin';
    this.loadUsers();
    this.loadCourses();
  }

  private get headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  // ── USERS ────────────────────────────────────────────────
  loadUsers(): void {
    this.loadingUsers = true;
    this.http.get<any[]>(`${this.api}/users`, this.headers).subscribe({
      next: (data) => { this.users = data; this.loadingUsers = false; },
      error: (err) => { console.error(err); this.loadingUsers = false; }
    });
  }

  get filteredUsers(): any[] {
    const q = this.searchUsers.toLowerCase().trim();
    if (!q) return this.users;
    return this.users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  }

  deleteUser(id: string, email: string): void {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    this.http.delete(`${this.api}/users/${id}`, this.headers).subscribe({
      next: () => this.loadUsers(),
      error: (err) => { console.error(err); alert('Failed to delete user.'); }
    });
  }

  // ── COURSES ──────────────────────────────────────────────
  loadCourses(): void {
    this.loadingCourses = true;
    this.http.get<any[]>(`${this.api}/courses/all`, this.headers).subscribe({
      next: (data) => { this.courses = data; this.loadingCourses = false; },
      error: (err) => { console.error(err); this.loadingCourses = false; }
    });
  }

  get filteredCourses(): any[] {
    const q = this.searchCourses.toLowerCase().trim();
    if (!q) return this.courses;
    return this.courses.filter(c =>
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.userEmail?.toLowerCase().includes(q)
    );
  }

  deleteCourse(id: string, title: string): void {
    if (!confirm(`Delete course "${title}"? This cannot be undone.`)) return;
    this.http.delete(`${this.api}/courses/${id}`, this.headers).subscribe({
      next: () => this.loadCourses(),
      error: (err) => { console.error(err); alert('Failed to delete course.'); }
    });
  }

  // ── STATS ────────────────────────────────────────────────
  get totalStudents(): number { return this.users.filter(u => u.role === 'Student').length; }
  get totalTeachers(): number { return this.users.filter(u => u.role === 'Teacher').length; }
  get totalAdmins(): number   { return this.users.filter(u => u.role === 'Admin').length; }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/admin-login']);
  }
}