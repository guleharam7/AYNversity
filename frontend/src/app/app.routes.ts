import { Routes } from '@angular/router';

import { LoginComponent }      from './pages/login/login';
import { SignupComponent }     from './pages/signup/signup';
import { DashboardComponent }  from './pages/dashboard/dashboard';
import { TeacherComponent }    from './pages/teacher/teacher';
import { CoursesComponent }    from './pages/courses/courses';
import { AddCourseComponent }  from './pages/add-course/add-course';
import { EditCourseComponent } from './pages/edit-course/edit-course';

import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [

  // ── DEFAULT ──────────────────────────────────────
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // ── AUTH ──────────────────────────────────────────
  { path: 'login',  component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // ── STUDENT + TEACHER ─────────────────────────────
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },

  // ── TEACHER ONLY ──────────────────────────────────
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher'] }
  },
  {
    path: 'courses',
    component: CoursesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher'] }
  },
  {
    path: 'add-course',
    component: AddCourseComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher'] }
  },
  {
    path: 'edit-course/:id',
    component: EditCourseComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Teacher'] }
  },

  // ── FALLBACK ──────────────────────────────────────
  { path: '**', redirectTo: 'login' }
];