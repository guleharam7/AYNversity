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

    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id') || '';
      if (!this.courseId) {
        this.loadError = 'No course ID found in URL.';
        return;
      }
      this.loadCourse();
    });
  }

  loadCourse() {
    this.loading = true;
    this.loadError = '';

    this.courseService.getCourse(this.courseId).subscribe({
      next: (res: any) => {
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
        console.error('Failed to load course:', err);
        this.loadError = err?.error?.message || 'Failed to load course. Please go back and try again.';
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
        console.error(err);
        this.saving = false;
        alert('Failed to update course.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/courses']);
  }
}