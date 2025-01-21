import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,  // This makes the component standalone
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule]  // Include FormsModule in the imports array, Import CommonModule for *ngIf
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (this.authService.login(this.username, this.password)) {
      // Redirect based on the role after successful login
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          switch (user.role) {
            case 'principal':
              this.router.navigate(['/principal-dashboard']);
              break;
            case 'teacher':
              this.router.navigate(['/teacher-dashboard']);
              break;
            case 'parent':
              this.router.navigate(['/parent-dashboard']);
              break;
            case 'student':
              this.router.navigate(['/student-dashboard']);
              break;
          }
        }
      });
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
