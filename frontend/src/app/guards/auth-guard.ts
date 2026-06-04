import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles: string[] = route.data?.['roles'] ?? [];

    // Admin-only routes
    if (requiredRoles.includes('Admin')) {
      if (role !== 'Admin') {
        // Admins that somehow land on a non-admin route go to admin panel
        // Others go to dashboard
        this.router.navigate([role === 'Admin' ? '/admin' : '/dashboard']);
        return false;
      }
      return true;
    }

    // Block admins from student/teacher routes
    if (role === 'Admin') {
      this.router.navigate(['/admin']);
      return false;
    }

    // Teacher-only routes
    if (requiredRoles.includes('Teacher') && role !== 'Teacher') {
      this.router.navigate(['/dashboard']);
      return false;
    }

    return true;
  }
}