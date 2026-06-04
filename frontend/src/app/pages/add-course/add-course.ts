import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css'
})
export class AddCourseComponent implements OnInit {

  courseForm!: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.courseForm = this.fb.group({
      title:       ['', Validators.required],
      description: ['', Validators.required],
      category:    ['', Validators.required],
      instructor:  [''],
      notesUrl:    [''],
      videoUrl:    ['']
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    const userEmail = localStorage.getItem('email') || '';
    this.courseService.addCourse({ ...this.courseForm.value, userEmail }).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        alert('Failed to add course. Make sure you are logged in as Teacher.');
      }
    });
  }
}