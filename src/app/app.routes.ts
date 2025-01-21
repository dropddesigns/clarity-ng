import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PrincipalDashboardComponent } from './principal-dashboard/principal-dashboard.component';
import { TeacherDashboardComponent } from './teacher-dashboard/teacher-dashboard.component';
import { ParentDashboardComponent } from './parent-dashboard/parent-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { UnauthorisedComponent } from './unauthorised/unauthorised.component';
import { AuthGuard } from './auth/auth.guard';

// Define your routes here
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'principal-dashboard',
    component: PrincipalDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['principal', 'teacher', 'parent', 'student'] }
  },
  {
    path: 'teacher-dashboard',
    component: TeacherDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['teacher', 'principal', 'parent', 'student'] }
  },
  {
    path: 'parent-dashboard',
    component: ParentDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['parent', 'teacher', 'student'] }
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['student', 'teacher', 'parent'] }
  },
  { path: 'unauthorised', component: UnauthorisedComponent },
];
