import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {

  private apiUrl = 'https://localhost:7023/api/courses';

  constructor(private http: HttpClient) {}

  private get authHeaders() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };
  }

  // GET ALL COURSES 
  getAllCourses() {
    return this.http.get(`${this.apiUrl}/all`, this.authHeaders);
  }

  // GET COURSES 
  getCourses() {
    return this.http.get(this.apiUrl, this.authHeaders);
  }

  // GET SINGLE COURSE
  getCourse(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`, this.authHeaders);
  }

  // ADD COURSE
  addCourse(course: any, notesFile?: File, videoFile?: File) {
    const formData = new FormData();
    formData.append('title', course.title);
    formData.append('description', course.description);
    formData.append('category', course.category);
    formData.append('instructor', course.instructor || '');
    formData.append('userEmail', course.userEmail || '');
    formData.append('notesUrl', course.notesUrl || '');
    formData.append('videoUrl', course.videoUrl || '');

    if (notesFile)  formData.append('notesFile', notesFile);
    if (videoFile)  formData.append('videoFile', videoFile);

    return this.http.post(this.apiUrl, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
  }

  // UPDATE COURSE
  updateCourse(id: string, course: any) {
    return this.http.put(`${this.apiUrl}/${id}`, course, this.authHeaders);
  }

  // DELETE COURSE
  deleteCourse(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.authHeaders);
  }

  // APPLY (enroll) to a course
  applyCourse(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/apply`, {}, this.authHeaders);
  }
}