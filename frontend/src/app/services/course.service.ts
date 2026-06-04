import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CourseService {

  private apiUrl = 'https://localhost:7023/api/courses';

  constructor(private http: HttpClient) {}

  private get authHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  // GET ALL COURSES (browse page / teacher view)
  getAllCourses() {
    return this.http.get<any[]>(`${this.apiUrl}/all`, this.authHeaders);
  }

  // GET FILTERED COURSES (role-based)
  getCourses() {
    return this.http.get<any[]>(this.apiUrl, this.authHeaders);
  }

  // GET SINGLE COURSE
  getCourse(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.authHeaders);
  }

  // GET COURSES BY TEACHER EMAIL
  getCoursesByTeacher(email: string) {
    return this.http.get<any[]>(`${this.apiUrl}/by-teacher?email=${encodeURIComponent(email)}`, this.authHeaders);
  }

  // ADD COURSE (form data)
  addCourse(course: any, notesFile?: File, videoFile?: File) {
    const formData = new FormData();
    formData.append('title',       course.title);
    formData.append('description', course.description);
    formData.append('category',    course.category);
    formData.append('instructor',  course.instructor  || '');
    formData.append('userEmail',   course.userEmail   || '');
    formData.append('notesUrl',    course.notesUrl    || '');
    formData.append('videoUrl',    course.videoUrl    || '');

    if (notesFile) formData.append('notesFile', notesFile);
    if (videoFile) formData.append('videoFile', videoFile);

    return this.http.post<any>(this.apiUrl, formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` })
    });
  }

  // UPDATE COURSE (teacher can only update own)
  updateCourse(id: string, course: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, course, this.authHeaders);
  }

  // DELETE COURSE
  deleteCourse(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, this.authHeaders);
  }

  // ENROLL (student only)
  applyCourse(id: string) {
    return this.http.post(`${this.apiUrl}/${id}/apply`, {}, this.authHeaders);
  }
}