import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'https://localhost:7023/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: any) {
    return this.http.post(`${this.api}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.api}/register`, data);
  }

  // ── Helpers ──────────────────────────────────────────────
  get token(): string | null { return localStorage.getItem('token'); }
  get email(): string | null { return localStorage.getItem('email'); }
  get role(): string | null  { return localStorage.getItem('role'); }
  get userId(): string | null { return localStorage.getItem('userId'); }

  isAdmin(): boolean   { return this.role === 'Admin'; }
  isTeacher(): boolean { return this.role === 'Teacher'; }
  isStudent(): boolean { return this.role === 'Student'; }
  isLoggedIn(): boolean { return !!this.token; }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}