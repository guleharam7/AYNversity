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
  saving  = false;
  loadError = '';

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

    console.log('Edit course ID:', this.courseId);   // ← debug: check console

    if (!this.courseId) {
      this.loadError = 'No course ID in URL. Go back and try again.';
      return;
    }

    this.loadCourse();
  }

  loadCourse() {
    this.loading   = true;
    this.loadError = '';

    this.courseService.getCourse(this.courseId).subscribe({
      next: (res: any) => {
        console.log('Course data received:', res);   // ← debug: check console

        const data = res ?? {};

        this.courseForm.patchValue({
          title:       data.title       ?? data.Title       ?? '',
          description: data.description ?? data.Description ?? '',
          category:    data.category    ?? data.Category    ?? '',
          instructor:  data.instructor  ?? data.Instructor  ?? '',
          notesUrl:    data.notesUrl    ?? data.NotesUrl    ?? '',
          videoUrl:    data.videoUrl    ?? data.VideoUrl    ?? ''
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('getCourse error:', err);      // ← debug: check console
        this.loadError = err?.error?.message
          || `Error ${err?.status}: Failed to load course.`;
        this.loading = false;
      }
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
        console.error('updateCourse error:', err);
        this.saving = false;
        alert('Failed to update course. Check console for details.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}