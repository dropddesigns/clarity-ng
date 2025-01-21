import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { UserDataService, User } from '../../services/user-data.service';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
  imports: [CommonModule, MatButtonModule, MatChipsModule, MatTableModule]
})
export class UserTableComponent implements OnInit {
  @Input() role?: string;  // Accepts a comma-separated list of roles
  @Input() yearLevel?: number;
  @Input() className?: string;

  @Input() showFilters: boolean = false;  // Input for showing filters
  @Input() filterOptions: string[] = [];  // Input for specifying which filters to show

  displayedColumns: string[] = ['id', 'name', 'role', 'email', 'class'];
  dataSource = new MatTableDataSource<User>();

  // Dynamic filters for buttons
  selectedRoles: string[] = [];
  selectedYearLevels: number[] = [];  // Ensure this is an array of numbers
  selectedClassNames: string[] = [];  // Updated to be an array of strings

  constructor(private userDataService: UserDataService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userDataService.users$.subscribe(users => {
      this.initializeFilters();
      this.applyFilters(users);
    });
  }

  initializeFilters(): void {
    // Set initial filters from @Input() values
    if (this.role) {
      this.selectedRoles = this.role.split(',').map(r => r.trim());
    }

    // Ensure selectedYearLevels is always an array
    this.selectedYearLevels = this.yearLevel !== undefined ? [this.yearLevel] : [];

    this.selectedClassNames = this.className ? [this.className] : [];  // Updated to handle array for class names
  }

  applyFilters(users: User[]): void {
    let filteredUsers = users;

    // Filter by role if selected
    if (this.selectedRoles.length > 0) {
      filteredUsers = filteredUsers.filter(user => this.selectedRoles.includes(user.role));
    }

    // Filter by year level if selected
    if (this.selectedYearLevels.length > 0) {
      filteredUsers = filteredUsers.filter(user =>
        user.yearLevel !== undefined && this.selectedYearLevels.includes(user.yearLevel)
      );
    }

    // Filter by class name if selected (updated for multiple classes)
    if (this.selectedClassNames.length > 0) {
      filteredUsers = filteredUsers.filter(user => {
        // Check for parent users with multiple children's classes
        if (user.role === 'parent' && user.children) {
          // Check if any of the selected class names matches any of the user's children's class names
          return user.children.some(childId => {
            const child = this.userDataService.getUsers().find(u => u.id === childId);
            // Check for exact matches between selected class names and child's class name
            return child && this.selectedClassNames.some(className => (child.className || '').includes(className));
          });
        }
        // For non-parent users, match directly with the className
        return user.className && this.selectedClassNames.some(className => (user.className || '').includes(className));
      });
    }

    this.dataSource.data = filteredUsers;
  }

  // Button-based filtering for roles
  filterByRole(role: string): void {
  if (this.selectedRoles.includes(role)) {
    this.selectedRoles = this.selectedRoles.filter(r => r !== role);
  } else {
    this.selectedRoles = [...this.selectedRoles, role];  // Reassign the array
  }
  this.applyFilters(this.userDataService.getUsers());
  this.cdr.detectChanges();  // Trigger change detection
}

  // Button-based filtering for year levels
  filterByYear(yearLevel: number): void {
  if (this.selectedYearLevels.includes(yearLevel)) {
    this.selectedYearLevels = this.selectedYearLevels.filter(y => y !== yearLevel);
  } else {
    this.selectedYearLevels = [...this.selectedYearLevels, yearLevel];  // Reassign the array
  }
  this.applyFilters(this.userDataService.getUsers());
  this.cdr.detectChanges();  // Trigger change detection
}

  // Button-based filtering for class names (updated to work with an array)
  filterByClass(className: string): void {
  if (this.selectedClassNames.includes(className)) {
    this.selectedClassNames = this.selectedClassNames.filter(c => c !== className);
  } else {
    this.selectedClassNames = [...this.selectedClassNames, className];  // Reassign the array
  }
  this.applyFilters(this.userDataService.getUsers());
  this.cdr.detectChanges();  // Trigger change detection
}

  // Helper function to retrieve the class name of a user based on their ID:
  getUserClassNameById(userId: number): string | undefined {
    const user = this.userDataService.getUsers().find(u => u.id === userId);
    return user ? user.className : undefined;
  }

  // Updated method to handle and return children's class names for parents
  getUserClassNameForParent(user: User): string | string[] {
    if (user.role === 'parent' && user.children) {
      const classNames = user.children
        .map(childId => {
          const child = this.userDataService.getUsers().find(u => u.id === childId);
          return child ? child.className : undefined;
        })
        .filter(className => className != null);

      // Sort class names alphabetically
      classNames.sort((a, b) => {
        const matchA = a?.match(/(\d+)([A-Za-z]+)/);
        const matchB = b?.match(/(\d+)([A-Za-z]+)/);

        if (matchA && matchB) {
          const numA = parseInt(matchA[1], 10);
          const numB = parseInt(matchB[1], 10);
          const alphaA = matchA[2];
          const alphaB = matchB[2];

          if (numA !== numB) return numA - numB;
          return alphaA.localeCompare(alphaB);
        }
        return 0;
      });

      // Return the sorted class names as a comma-separated string
      return classNames.join(', ') || 'No Class Assigned';
    }

    // For non-parents, just return the className
    return user.className || 'No Class Assigned';
  }

  // Reset filters for all the selected filters
  resetFilters(): void {
  if (!this.role) {
    this.selectedRoles = [];  // Reset role filter
  }
  this.selectedYearLevels = [];  // Reset year level filters
  this.selectedClassNames = [];  // Reset class name filter

  this.applyFilters(this.userDataService.getUsers());

  // Trigger change detection to reflect the reset immediately
  this.cdr.detectChanges();
}

}
