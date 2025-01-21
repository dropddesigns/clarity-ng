import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  children?: number[];  // List of student IDs related to this parent
  className?: string; // Optional: For filtering students by class
  email: string;
  name: string;
  role: 'parent' | 'principal' | 'student' | 'teacher';
  yearLevel?: number; // Optional: For filtering students by year
}

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor() {
    // Mock data
    const mockUsers: User[] = [
      { id: 1, name: 'Seymour Skinner', role: 'principal', email: 'seymour.skinner@clarityps.wa.edu.au' },
      { id: 2, name: 'Edna Krabappel', role: 'teacher', email: 'edna.krabappel@clarityps.wa.edu.au', className: '06A' },
      { id: 3, name: 'Homer Simpson', role: 'parent', email: 'homer.simpson@clarityps.wa.edu.au', children: [5, 6] },
      { id: 4, name: 'Marge Simpson', role: 'parent', email: 'marge.simpson@clarityps.wa.edu.au', children: [5, 6] },
      { id: 5, name: 'Lisa Simpson', role: 'student', email: 'lisa.simpson@clarityps.wa.edu.au', yearLevel: 6, className: '06A' },
      { id: 6, name: 'Bart Simpson', role: 'student', email: 'bart.simpson@clarityps.wa.edu.au', yearLevel: 4, className: '04F' },
      { id: 7, name: 'Elizabeth Hoover', role: 'teacher', email: 'elizabeth.hoover@clarityps.wa.edu.au', className: '06A' },
      { id: 8, name: 'Ned Flanders', role: 'parent', email: 'ned.flanders@clarityps.wa.edu.au', children: [10, 11] },
      { id: 9, name: 'Maude Flanders', role: 'parent', email: 'maude.flanders@clarityps.wa.edu.au', children: [10, 11] },
      { id: 10, name: 'Rod Simpson', role: 'student', email: 'rod.flanders@clarityps.wa.edu.au', yearLevel: 6, className: '06A' },
      { id: 11, name: 'Todd Simpson', role: 'student', email: 'todd.flanders@clarityps.wa.edu.au', yearLevel: 3, className: '03C' }
    ];
    this.setUsers(mockUsers);
  }

  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  getUsers(): User[] {
    return this.usersSubject.getValue();
  }

  filterUsers(filterFn: (user: User) => boolean): User[] {
    return this.getUsers().filter(filterFn);
  }
}
