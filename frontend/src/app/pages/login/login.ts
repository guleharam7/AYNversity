import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loading = false;
  serverError = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    this.serverError = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.auth.login({ email, password }).subscribe({
      next: (res: any) => {
        const token = res?.token;
        const user  = res?.user;

        if (!token) {
          this.loading = false;
          this.serverError = 'Login failed: no token received.';
          return;
        }

        localStorage.setItem('token',  token);
        localStorage.setItem('email',  user?.email ?? email);
        localStorage.setItem('role',   user?.role  ?? 'Student');
        localStorage.setItem('userId', user?.id    ?? '');

        this.loading = false;
        this.router.navigate(['/dashboard'], { replaceUrl: true });
      },

      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.message || 'Invalid email or password.';
      }
    });
  }
}