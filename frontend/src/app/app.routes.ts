import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { SignupComponent } from './pages/signup/signup';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { TeacherComponent } from './pages/teacher/teacher';
import { CoursesComponent } from './pages/courses/courses';
import { AddCourseComponent } from './pages/add-course/add-course';
import { EditCourseComponent } from './pages/edit-course/edit-course';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'teacher', component: TeacherComponent},
  { path: 'courses', component: CoursesComponent, canActivate: [AuthGuard] },
  { path: 'add-course', component: AddCourseComponent, canActivate: [AuthGuard] },
  { path: 'edit-course/:id', component: EditCourseComponent }
];