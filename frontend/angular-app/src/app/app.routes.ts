import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { CreateRoleComponent } from './pages/create-role/create-role';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';

export const routes: Routes = [

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: DashboardLayoutComponent,
    children: [

      {
        path: 'dashboard',
        component: DashboardComponent
      },

      {
        path: 'create-role',
        component: CreateRoleComponent
      }

    ]
  }

];