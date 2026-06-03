import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = 'https://localhost:7023/api/Courses';

  constructor(private http: HttpClient) {}

  getCourses() {
    return this.http.get(this.apiUrl);
  }

  getCourse(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addCourse(course: any) {
    return this.http.post(this.apiUrl, course);
  }

  updateCourse(id: string, course: any) {
    return this.http.put(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}