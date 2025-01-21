import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRoles: string[] = next.data['roles'] || [];
    const isLoggedIn = this.authService.isLoggedIn;  // Correctly check the boolean state of logged in
    const userRole = this.authService.getRole();  // Get the user's role

    // If the user is not logged in, redirect to login
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // If the user is logged in, but the role is null, redirect to login or unauthorised
    if (!userRole) {
      this.router.navigate(['/unauthorised']);
      return false;
    }

    // If the route has no role requirement or the user has the required role, grant access
    if (requiredRoles.length === 0 || requiredRoles.includes(userRole)) {
      return true;
    }

    // If the role is not allowed, redirect to an unauthorised page
    this.router.navigate(['/unauthorised']);
    return false;
  }
}
