import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AdminComponent } from './pages/admin/admin';
import { CoursesComponent } from './pages/courses/courses';
import { AddCourseComponent } from './pages/add-course/add-course';
import { EditCourseComponent } from './pages/edit-course/edit-course';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent},
  { path: 'courses', component: CoursesComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'edit-course/:id', component: EditCourseComponent }
];