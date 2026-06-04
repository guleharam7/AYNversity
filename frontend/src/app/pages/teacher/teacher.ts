import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher.html',
  styleUrls: ['./teacher.css']
})
export class TeacherComponent implements OnInit {

  users: any[] = [];
  userEmail: string | null = '';
  loading = false;

  private api = 'https://localhost:7023/api/users';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.userEmail = localStorage.getItem('email');
    this.loadUsers();
  }

  private get authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  loadUsers() {
    this.loading = true;
    this.http.get<any[]>(this.api, this.authHeaders).subscribe({
      next: (res) => { this.users = res; this.loading = false; },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  deleteUser(id: string) {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    this.http.delete(`${this.api}/${id}`, this.authHeaders).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error(err)
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}