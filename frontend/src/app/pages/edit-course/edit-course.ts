import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './edit-course.html',
  styleUrl: './edit-course.css'
})
export class EditCourseComponent implements OnInit {

  courseForm!: FormGroup;
  courseId: string = '';
  loading = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
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

    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCourse();
  }

  loadCourse() {
    if (!this.courseId) return;
    this.loading = true;
    this.courseService.getCourse(this.courseId).subscribe({
      next: (res: any) => {
        this.courseForm.patchValue({
          title:       res.title,
          description: res.description,
          category:    res.category,
          instructor:  res.instructor || '',
          notesUrl:    res.notesUrl || '',
          videoUrl:    res.videoUrl || ''
        });
        this.loading = false;
      },
      error: (err) => { console.error(err); this.loading = false; }
    });
  }

  onSubmit() {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.courseService.updateCourse(this.courseId, this.courseForm.value).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/courses']);
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        alert('Failed to update course.');
      }
    });
  }
}