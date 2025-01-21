import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './auth/auth.service';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,  // Indicating that this is a standalone component
  imports: [RouterOutlet, MatButtonModule], // Import RouterModule for routing functionality
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isAuthenticated = false;
  title = 'clarity-app';

  constructor(private authService: AuthService, private router: Router) {
    // Subscribe to authentication status
    this.authService.isLoggedIn$.subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
    });
  }

  handleAuthAction() {
    if (this.isAuthenticated) {
      this.authService.logout();
      this.router.navigate(['/login']); // Redirect to login on logout
    } else {
      this.router.navigate(['/login']); // Navigate to login if not authenticated
    }
  }
}

