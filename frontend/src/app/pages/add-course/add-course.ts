import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css'
})
export class AddCourseComponent implements OnInit {

  courseForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      instructor: ['', Validators.required],
      price: [0, Validators.required]
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) return;

    this.courseService.addCourse(this.courseForm.value)
      .subscribe({
        next: () => {
          alert('Course Added Successfully');
          this.router.navigate(['/courses']);
        },
        error: () => {
          alert('Failed to Add Course');
        }
      });
  }
}