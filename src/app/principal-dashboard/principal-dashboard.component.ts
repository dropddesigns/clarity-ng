import { Component } from '@angular/core';

import  { MatTabsModule } from '@angular/material/tabs';

import { UserTableComponent } from '../components/user-table/user-table.component';

@Component({
  selector: 'app-principal-dashboard',
  templateUrl: './principal-dashboard.component.html',
  styleUrls: ['./principal-dashboard.component.css'],
  imports: [MatTabsModule, UserTableComponent]
})
export class PrincipalDashboardComponent {}

