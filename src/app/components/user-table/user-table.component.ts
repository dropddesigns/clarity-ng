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
      filteredUsers = filteredUsers.filter(user =>
        user.className && this.selectedClassNames.includes(user.className) // Added check for className
      );
    }

    this.dataSource.data = filteredUsers;
  }

  // Button-based filtering for roles
  filterByRole(role: string): void {
    if (this.selectedRoles.includes(role)) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== role);
    } else {
      this.selectedRoles.push(role);
    }
    this.applyFilters(this.userDataService.getUsers());
  }

  // Button-based filtering for year levels
  filterByYear(yearLevel: number): void {
    if (this.selectedYearLevels.includes(yearLevel)) {
      this.selectedYearLevels = this.selectedYearLevels.filter(y => y !== yearLevel);
    } else {
      this.selectedYearLevels.push(yearLevel);
    }
    this.applyFilters(this.userDataService.getUsers());
  }

  // Button-based filtering for class names (updated to work with an array)
  filterByClass(className: string): void {
    if (this.selectedClassNames.includes(className)) {
      // Remove class from the selected array if it's already there
      this.selectedClassNames = this.selectedClassNames.filter(c => c !== className);
    } else {
      // Add class to the selected array if it's not there
      this.selectedClassNames.push(className);
    }
    this.applyFilters(this.userDataService.getUsers());
  }

  // Helper function to retrieve the class name of a user based on their ID:
  getUserClassNameById(userId: number): string | undefined {
    const user = this.userDataService.getUsers().find(u => u.id === userId);
    return user ? user.className : undefined;
  }

  // This method was defined before; no changes needed
  getSortedChildrenClasses(user: User): string[] {
    if (user.children && Array.isArray(user.children)) {
      const classNames = user.children
        .map(childId => this.getUserClassNameById(childId)) // Get the class names of the children
        .filter((className): className is string => className != null) // Filter out null or undefined class names
        .sort((a, b) => {
          // Split the class names into numeric and alphabetic parts
          const matchA = a.match(/(\d+)([A-Za-z]+)/);
          const matchB = b.match(/(\d+)([A-Za-z]+)/);

          if (matchA && matchB) {
            const numA = parseInt(matchA[1], 10); // Numeric part
            const numB = parseInt(matchB[1], 10); // Numeric part
            const alphaA = matchA[2]; // Alphabetic part
            const alphaB = matchB[2]; // Alphabetic part

            // First compare numerically, then alphabetically
            if (numA !== numB) return numA - numB;
            return alphaA.localeCompare(alphaB);
          }

          return 0; // Fallback case if there's no match (shouldn't happen)
        });

      return classNames;
    }
    return [];
  }

  // Reset filters for all the selected filters
  resetFilters(): void {
    if (!this.role) {
      this.selectedRoles = [];  // Reset role filter
    }
    this.selectedYearLevels = [];  // Reset year level filters
    this.selectedClassNames = [];  // Reset class name filter

    this.applyFilters(this.userDataService.getUsers());

    // Manually trigger change detection to update the view immediately
    this.cdr.detectChanges();
  }
}
