import { Component } from '@angular/core';

import  { MatTabsModule } from '@angular/material/tabs';

import { UserTableComponent } from '../components/user-table/user-table.component';

@Component({
  selector: 'app-principal-dashboard',
  templateUrl: './principal-dashboard.component.html',
  styleUrls: ['./principal-dashboard.component.scss'],
  imports: [MatTabsModule, UserTableComponent]
})
export class PrincipalDashboardComponent {
  activeTab: string = 'All'; // Default active tab

  // Handle tab change
  onTabChange(event: any): void {
    const tabLabels = ['All', 'Staff', 'Parents', 'Students'];
    this.activeTab = tabLabels[event.index]; // Match tab index to labels
  }
}

