import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLoginComponent implements OnInit {

  adminForm!: FormGroup;
  loading = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If already logged in as Admin, go straight to admin panel
    if (this.auth.isLoggedIn() && this.auth.isAdmin()) {
      this.router.navigate(['/admin']);
      return;
    }
    // Non-admin logged in → send to dashboard
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.adminForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onAdminLogin(): void {
    this.serverError = '';
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.adminForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res: any) => {
        const token = res?.token;
        const user  = res?.user;

        if (!token) {
          this.loading = false;
          this.serverError = 'Login failed: no token received.';
          return;
        }

        const role = user?.role ?? '';

        // ── ONLY ADMINS allowed here ──────────────────────────────
        if (role !== 'Admin') {
          this.loading = false;
          this.serverError = 'Access denied. This portal is for admins only.';
          return;
        }

        localStorage.setItem('token',  token);
        localStorage.setItem('email',  user?.email ?? email);
        localStorage.setItem('role',   role);
        localStorage.setItem('userId', user?.id    ?? '');

        this.loading = false;
        this.router.navigate(['/admin'], { replaceUrl: true });
      },

      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.message || 'Invalid admin credentials.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }
}