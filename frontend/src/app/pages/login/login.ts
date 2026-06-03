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

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.auth.login({ email, password }).subscribe({
      next: (res: any) => {

        const token = res?.token;

        if (!token) {
          throw new Error('Token missing from backend response');
        }

        localStorage.setItem('token', token);
        localStorage.setItem('email', email ?? '');

        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.error(err);
        alert('Invalid email or password');
      },

      complete: () => {
        this.loading = false;
      }
    });
  }
}