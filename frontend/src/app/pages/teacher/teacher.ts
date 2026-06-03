import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teacher',
  standalone: true,
  templateUrl: './teacher.html',
  styleUrls: ['./teacher.css']
})
export class TeacherComponent {

  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get('https://localhost:5001/api/users')
      .subscribe((res: any) => {
        this.users = res;
      });
  }

  deleteUser(id: string) {
    this.http.delete(`https://localhost:5001/api/users/${id}`)
      .subscribe(() => {
        this.loadUsers();
      });
  }
}