import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  loading = false;

  serverError: string = '';   

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).{6,}$/)
        ]
      ],
      role: ['Student']
    });
  }

  onSignup(): void {

    this.serverError = '';

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.auth.register(this.signupForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },

      error: (err) => {
  this.loading = false;

  console.log('FULL ERROR:', err); 

  const message =
    err?.error?.message ||
    err?.error ||
    err?.message ||
    '';

  if (message.toLowerCase().includes('exists')) {
    this.serverError = 'Email already exists. Please login instead.';
  } else {
    this.serverError = 'Signup failed. Please try again.';
  }
}
    });
  }
}