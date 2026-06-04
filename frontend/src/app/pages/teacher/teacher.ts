import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './teacher.html',
  styleUrls: ['./teacher.css']
})
export class TeacherComponent implements OnInit, AfterViewInit {

  // ── State ──────────────────────────────────────────────
  users: any[]       = [];
  myCourses: any[]   = [];
  userEmail: string  = '';
  activeTab: 'courses' | 'users' = 'courses';
  loading    = false;
  usersLoading = false;
  userSearch = '';

  private usersApi = 'https://localhost:7023/api/users';

  constructor(
    private http: HttpClient,
    private router: Router,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email') || '';
    this.loadMyCourses();
    this.loadUsers();
  }

  // ── Vanilla JS DOM demo (requirement from manual) ──────
  ngAfterViewInit() {
    // Animate stat cards in on load using vanilla DOM
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, i) => {
      const el = card as HTMLElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 80);
    });
  }

  private get authHeaders() {
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` })
    };
  }

  // ── Load only THIS teacher's courses ──────────────────
  loadMyCourses() {
    this.loading = true;
    this.courseService.getAllCourses().subscribe({
      next: (res: any[]) => {
        this.myCourses = res.filter(c => c.userEmail === this.userEmail);
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  // ── Load all users (READ-ONLY for teacher) ─────────────
  loadUsers() {
    this.usersLoading = true;
    this.http.get<any[]>(this.usersApi, this.authHeaders).subscribe({
      next: (res) => { this.users = res; this.usersLoading = false; },
      error: (err) => { console.error(err); this.usersLoading = false; }
    });
  }

  // ── Filtered users by search ───────────────────────────
  get filteredUsers(): any[] {
    const q = this.userSearch.toLowerCase().trim();
    if (!q) return this.users;
    return this.users.filter(u =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  }

  // ── Stats ──────────────────────────────────────────────
  get totalEnrolled(): number {
    return this.myCourses.reduce((sum, c) => sum + (c.enrolledUsers?.length || 0), 0);
  }

  get studentCount(): number {
    return this.users.filter(u => u.role === 'Student').length;
  }

  // ── Delete only own course ─────────────────────────────
  deleteCourse(id: string) {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    this.courseService.deleteCourse(id).subscribe({
      next: () => this.loadMyCourses(),
      error: (err) => console.error(err)
    });
  }

  goToDashboard()  { this.router.navigate(['/dashboard']); }
  goToEditCourse(id: string) { this.router.navigate(['/edit-course', id]); }
  logout() { localStorage.clear(); window.location.href = '/login'; }
}