import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true; 

  const { email, password } = this.loginForm.value;

  this.auth.login({ email, password }).subscribe({
    next: (res: any) => {

      console.log("LOGIN RESPONSE:", res);

      const token = res?.token;
      const user = res?.user;

      if (!token) {
        this.loading = false;
        throw new Error('Token missing from backend response');
      }

      // ================= STORE AUTH DATA =================
      localStorage.setItem('token', token);
      localStorage.setItem('email', user?.email ?? email);
      localStorage.setItem('role', user?.role ?? 'Student');

      this.loading = false; 

      this.router.navigate(['/dashboard']);
    },

    error: (err) => {

      this.loading = false; 

      console.error(err);
      alert(err?.error?.message || 'Invalid email or password');
    }
  });
} 

}