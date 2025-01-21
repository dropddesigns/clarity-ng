import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<any>(null);

  // Store credentials locally (for demo purposes)
  private users = [
    { username: 'principal', password: '1234', role: 'principal' },
    { username: 'teacher', password: '1234', role: 'teacher' },
    { username: 'parent', password: '1234', role: 'parent' },
    { username: 'student', password: '1234', role: 'student' },
  ];

  constructor() {
    // Check localStorage for login state and user info on initialization
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUser.next(user);
      this.loggedIn.next(true);
    }
  }

  get isLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUser$(): Observable<any> {
    return this.currentUser.asObservable();
  }

  // Login method (checks credentials against the "users" array)
  login(username: string, password: string): boolean {
    const user = this.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.loggedIn.next(true); // Set logged-in state to true
      this.currentUser.next(user); // Set the current user with their details
      localStorage.setItem('currentUser', JSON.stringify(user)); // Save user to localStorage
      return true;
    }
    return false;
  }

  // Logout method
  logout(): void {
    this.loggedIn.next(false);
    this.currentUser.next(null);
    localStorage.removeItem('currentUser'); // Remove from localStorage
  }

  // Get the current user's role
  getRole(): string | null {
    const user = this.currentUser.getValue();
    return user ? user.role : null;
  }
}
